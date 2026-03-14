import { createClient } from '@/utils/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main>
      <h1>andwhat</h1>
      <p>User: {user ? user.email : 'Not logged in'}</p>
    </main>
  )
}