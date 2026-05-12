"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getDocPage(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("doc_pages")
    .select("*")
    .eq("slug", slug)
    .single();
  return data as { slug: string; title: string; content: string; updated_at: string } | null;
}

export async function upsertDocPage(slug: string, title: string, content: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("doc_pages")
    .upsert(
      { slug, title, content, updated_at: new Date().toISOString() },
      { onConflict: "slug" }
    );
  if (error) return { error: error.message };
  revalidatePath(`/docs/${slug}`);
  return { error: null };
}

export async function uploadDocImage(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;
  if (!file) return { error: "파일이 없습니다." };

  const ext = file.name.split(".").pop();
  const path = `${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("doc-images")
    .upload(path, file, { contentType: file.type });

  if (error) return { error: error.message };

  const { data } = supabase.storage.from("doc-images").getPublicUrl(path);
  return { url: data.publicUrl };
}
