import { createClient } from "@/utils/supabase/server";
import Header from "@/components/Header";

export default async function HeaderWrapper() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <Header user={user} />;
}
