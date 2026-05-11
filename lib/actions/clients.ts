"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ClientInfo, Product, HistoryItem, HistoryDetail, CheckItem, AttachedFile } from "@/types/client";
import { mockClients } from "@/lib/mock-data";

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ─── 타입 매핑 (snake_case → camelCase) ───────────────────────────

function mapFile(r: Record<string, unknown>): AttachedFile {
  return { id: r.id as string, name: r.name as string, type: r.type as AttachedFile["type"] };
}

function mapCheckItem(r: Record<string, unknown>): CheckItem {
  return { id: r.id as string, label: r.label as string, done: r.done as boolean };
}

function mapDetail(r: Record<string, unknown>): HistoryDetail {
  const checks = (r.check_items as Record<string, unknown>[] | null) ?? [];
  const files = (r.attached_files as Record<string, unknown>[] | null) ?? [];
  return {
    id: r.id as string,
    summary: (r.summary as string) ?? "",
    requestedAt: (r.requested_at as string) ?? "",
    dueDate: (r.due_date as string) ?? "",
    members: (r.members as string) ?? "",
    budget: (r.budget as string) ?? "",
    checkItems: checks
      .slice()
      .sort((a, b) => ((a.sort_order as number) ?? 0) - ((b.sort_order as number) ?? 0))
      .map(mapCheckItem),
    files: files
      .slice()
      .sort((a, b) => ((a.sort_order as number) ?? 0) - ((b.sort_order as number) ?? 0))
      .map(mapFile),
  };
}

function mapHistoryItem(r: Record<string, unknown>): HistoryItem {
  const details = (r.history_details as Record<string, unknown>[] | null) ?? [];
  return {
    id: r.id as string,
    date: (r.date as string) ?? "",
    name: r.name as string,
    assignee: (r.assignee as string) ?? "",
    status: r.status as HistoryItem["status"],
    note: (r.note as string) ?? "",
    detail: details[0] ? mapDetail(details[0]) : undefined,
  };
}

function mapProduct(r: Record<string, unknown>): Product {
  return {
    id: r.id as number,
    name: r.name as string,
    category: r.category as Product["category"],
    unitPrice: r.unit_price as number,
    quantity: r.quantity as number,
    status: r.status as Product["status"],
  };
}

function mapClient(r: Record<string, unknown>): ClientInfo {
  const products = (r.products as Record<string, unknown>[] | null) ?? [];
  const history = (r.history_items as Record<string, unknown>[] | null) ?? [];
  return {
    id: r.id as string,
    companyName: r.company_name as string,
    companyNameEn: (r.company_name_en as string) ?? "",
    isVip: (r.is_vip as boolean) ?? false,
    contractStatus: r.contract_status as ClientInfo["contractStatus"],
    ceo: (r.ceo as string) ?? "",
    businessNumber: (r.business_number as string) ?? "",
    industry: (r.industry as string) ?? "",
    foundedAt: (r.founded_at as string) ?? "",
    scale: (r.scale as string) ?? "",
    manager: r.manager as string,
    phone: (r.phone as string) ?? "",
    email: (r.email as string) ?? "",
    address: (r.address as string) ?? "",
    registeredAt: (r.registered_at as string) ?? "",
    memo: (r.memo as string) ?? "",
    products: products
      .slice()
      .sort((a, b) => ((a.sort_order as number) ?? 0) - ((b.sort_order as number) ?? 0))
      .map(mapProduct),
    history: history
      .slice()
      .sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime())
      .map(mapHistoryItem),
  };
}

// ─── 조회 ──────────────────────────────────────────────────────────

export async function getClients(): Promise<ClientInfo[]> {
  if (!isSupabaseConfigured) return mockClients;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("clients")
      .select("*, products(*)")
      .order("created_at", { ascending: false });
    if (error) return mockClients;
    return (data ?? []).map((r) => mapClient(r as Record<string, unknown>));
  } catch {
    return mockClients;
  }
}

export async function getClient(id: string): Promise<ClientInfo | null> {
  if (!isSupabaseConfigured) {
    return mockClients.find((c) => c.id === id) ?? null;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("clients")
      .select(`
        *,
        products(*),
        history_items(
          *,
          history_details(
            *,
            check_items(*),
            attached_files(*)
          )
        )
      `)
      .eq("id", id)
      .single();
    if (error) return mockClients.find((c) => c.id === id) ?? null;
    return mapClient(data as Record<string, unknown>);
  } catch {
    return mockClients.find((c) => c.id === id) ?? null;
  }
}

// ─── 고객사 CRUD ───────────────────────────────────────────────────

type ClientFormData = Omit<ClientInfo, "id" | "registeredAt" | "products" | "history">;

export async function addClient(formData: ClientFormData): Promise<void> {
  const supabase = await createClient();
  const d = new Date();
  const registeredAt = `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;

  const { error } = await supabase.from("clients").insert({
    company_name: formData.companyName,
    company_name_en: formData.companyNameEn,
    is_vip: formData.isVip,
    contract_status: formData.contractStatus,
    ceo: formData.ceo,
    business_number: formData.businessNumber,
    industry: formData.industry,
    founded_at: formData.foundedAt,
    scale: formData.scale,
    manager: formData.manager,
    phone: formData.phone,
    email: formData.email,
    address: formData.address,
    registered_at: registeredAt,
    memo: formData.memo,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/clients");
}

export async function updateClient(id: string, formData: ClientFormData): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("clients").update({
    company_name: formData.companyName,
    company_name_en: formData.companyNameEn,
    is_vip: formData.isVip,
    contract_status: formData.contractStatus,
    ceo: formData.ceo,
    business_number: formData.businessNumber,
    industry: formData.industry,
    founded_at: formData.foundedAt,
    scale: formData.scale,
    manager: formData.manager,
    phone: formData.phone,
    email: formData.email,
    address: formData.address,
    memo: formData.memo,
  }).eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
}

export async function deleteClient(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/clients");
}

// ─── 히스토리 상세 편집 ────────────────────────────────────────────

export async function updateHistoryDetail(
  detailId: string,
  data: {
    summary: string;
    requestedAt: string;
    dueDate: string;
    members: string;
    budget: string;
    checkItems: { id: string; label: string; done: boolean }[];
  }
): Promise<void> {
  const supabase = await createClient();

  const { error: detailError } = await supabase
    .from("history_details")
    .update({
      summary: data.summary,
      requested_at: data.requestedAt,
      due_date: data.dueDate,
      members: data.members,
      budget: data.budget,
    })
    .eq("id", detailId);

  if (detailError) throw new Error(detailError.message);

  for (const item of data.checkItems) {
    await supabase
      .from("check_items")
      .update({ label: item.label, done: item.done })
      .eq("id", item.id);
  }

  revalidatePath("/clients", "layout");
}

// ─── 제품 CRUD ─────────────────────────────────────────────────────

type ProductFormData = Omit<Product, "id">;

export async function addProduct(clientId: string, data: ProductFormData): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").insert({
    client_id: clientId,
    name: data.name,
    category: data.category,
    unit_price: data.unitPrice,
    quantity: data.quantity,
    status: data.status,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/clients", "layout");
}

export async function updateProduct(id: number, data: ProductFormData): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({
    name: data.name,
    category: data.category,
    unit_price: data.unitPrice,
    quantity: data.quantity,
    status: data.status,
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/clients", "layout");
}

export async function deleteProduct(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/clients", "layout");
}

// ─── 히스토리 항목 CRUD ────────────────────────────────────────────

type HistoryItemFormData = Pick<HistoryItem, "date" | "name" | "assignee" | "status" | "note">;

export async function addHistoryItem(clientId: string, data: HistoryItemFormData): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("history_items").insert({
    client_id: clientId,
    date: data.date,
    name: data.name,
    assignee: data.assignee,
    status: data.status,
    note: data.note,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/clients", "layout");
}

export async function updateHistoryItem(id: string, data: HistoryItemFormData): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("history_items").update({
    date: data.date,
    name: data.name,
    assignee: data.assignee,
    status: data.status,
    note: data.note,
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/clients", "layout");
}

export async function deleteHistoryItem(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("history_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/clients", "layout");
}
