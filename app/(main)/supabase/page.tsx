import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from('todos').select();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-4 text-2xl font-semibold">Supabase Todos</h1>
      <ul className="list-disc pl-6">
        {todos?.map((todo, idx) => (
          <li key={idx}>{JSON.stringify(todo)}</li>
        ))}
      </ul>
    </main>
  );
}
