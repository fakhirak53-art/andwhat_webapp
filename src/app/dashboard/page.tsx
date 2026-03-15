import { logout } from '@/app/actions/auth'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    // Middleware already handles this but double-check here
    if (!user) redirect('/login')

    return (
        <main style={{ padding: 48 }}>
            <h1>Dashboard</h1>
            <p>Welcome, {user.email}</p>
            <p>User ID: {user.id}</p>

            <form action={logout}>
                <button type="submit">Log out</button>
            </form>
        </main>
    )
}