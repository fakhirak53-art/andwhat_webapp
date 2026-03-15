import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main>
      <div className="w-full px-4 pt-4 sm:px-6 lg:px-8">
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-normal text-ink">andwhat</h1>
        <p className="mt-2 text-muted">
          User: {user ? user.email : "Not logged in"}
        </p>
      </div>
    </main>
  );
}