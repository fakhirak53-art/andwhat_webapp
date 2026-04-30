'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getPilotAccessForUser } from '@/lib/pilot-access'

const MIN_PASSWORD_LENGTH = 6

function missingSupabaseConfigMessage(): string | null {
    if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
    ) {
        return 'Authentication is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.example).'
    }
    return null
}

/** Canonical origin for Supabase email redirects (reset password). Add to Supabase Auth redirect allow list: `${url}/auth/callback` */
function getSiteUrl(): string {
    const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
    if (explicit) {
        return explicit.replace(/\/$/, '')
    }
    const vercel = process.env.VERCEL_URL?.trim()
    if (vercel) {
        const host = vercel.replace(/^https?:\/\//, '')
        return `https://${host}`
    }
    return 'http://localhost:3000'
}

export async function login(formData: FormData) {
    const configError = missingSupabaseConfigMessage()
    if (configError) {
        return { error: configError }
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    })

    if (error) {
        return { error: error.message }
    }

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (user) {
        const pilotAccess = await getPilotAccessForUser(user.id)
        if (pilotAccess.blocked) {
            await supabase.auth.signOut()
            return {
                error:
                    'Your school pilot has expired. Please contact your school administrator.',
            }
        }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signInWithGoogle(): Promise<
    { error: string } | undefined
> {
    const configError = missingSupabaseConfigMessage()
    if (configError) {
        return { error: configError }
    }

    const supabase = await createClient()
    const siteUrl = getSiteUrl()
    const redirectTo = `${siteUrl}/auth/callback?next=${encodeURIComponent('/dashboard')}`

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo,
        },
    })

    if (error) {
        return { error: error.message }
    }
    if (!data.url) {
        return { error: 'Could not start Google sign-in.' }
    }

    redirect(data.url)
}

export async function signup(formData: FormData) {
    const configError = missingSupabaseConfigMessage()
    if (configError) {
        return { error: configError }
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                full_name: formData.get('full_name') as string,
            }
        }
    })

    if (error) {
        return { error: error.message }
    }

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (user) {
        const pilotAccess = await getPilotAccessForUser(user.id)
        if (pilotAccess.blocked) {
            await supabase.auth.signOut()
            return {
                error:
                    'Your school pilot has expired. Please contact your school administrator.',
            }
        }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function logout() {
    if (!missingSupabaseConfigMessage()) {
        const supabase = await createClient()
        await supabase.auth.signOut()
    }
    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function requestPasswordReset(
    formData: FormData,
): Promise<{ success: true } | { error: string }> {
    const email = (formData.get('email') as string)?.trim()
    if (!email) {
        return { error: 'Please enter your email address.' }
    }

    const configError = missingSupabaseConfigMessage()
    if (configError) {
        return { error: configError }
    }

    const supabase = await createClient()
    const siteUrl = getSiteUrl()
    const nextPath = '/login/update-password'
    const redirectTo = `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function updatePassword(
    formData: FormData,
): Promise<{ error: string } | void> {
    const password = formData.get('password') as string
    const confirm = formData.get('confirm_password') as string

    if (!password || password.length < MIN_PASSWORD_LENGTH) {
        return {
            error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
        }
    }
    if (password !== confirm) {
        return { error: 'Passwords do not match.' }
    }

    const configError = missingSupabaseConfigMessage()
    if (configError) {
        return { error: configError }
    }

    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return {
            error:
                'Your reset link may have expired. Request a new one from forgot password.',
        }
    }

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}