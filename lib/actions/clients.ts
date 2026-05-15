"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import {
  ClientInfo, Contact, Product, HistoryItem, HistoryDetail,
  MaintenanceStatus, ProductCategory, HistoryClassification, StatusType,
} from "@/types/client";

// ─── 타입 매핑 (snake_case → camelCase) ───────────────────────────

function mapContact(r: Record<string, unknown>): Contact {
  return {
    id: r.id as string,
    name: (r.name as string) ?? "",
    phone: (r.phone as string) ?? "",
    email: (r.email as string) ?? "",
    isPrimary: (r.is_primary as boolean) ?? false,
    sortOrder: (r.sort_order as number) ?? 0,
  };
}

function mapProduct(r: Record<string, unknown>): Product {
  return {
    id: r.id as number,
    sortOrder: (r.sort_order as number) ?? 0,
    name: (r.name as string) ?? "",
    category: (r.category as ProductCategory) ?? "Luna",
    model: (r.model as string) ?? "",
    purpose: (r.purpose as string) ?? "",
    serialNumber: (r.serial_number as string) ?? "",
    firmware: (r.firmware as string) ?? "",
    clientOs: (r.client_os as string) ?? "",
    clientCount: (r.client_count as string) ?? "",
    maintenanceStart: (r.maintenance_start as string) ?? "",
    maintenanceEnd: (r.maintenance_end as string) ?? "",
    maintenanceStatus: (r.maintenance_status as MaintenanceStatus) ?? "해당없음",
  };
}

function mapDetail(r: Record<string, unknown>): HistoryDetail {
  return {
    id: r.id as string,
    author: (r.author as string) ?? "",
    date: (r.date as string) ?? "",
    classification: (r.classification as HistoryClassification) ?? "점검",
    content: (r.content as string) ?? "",
  };
}

function mapHistoryItem(r: Record<string, unknown>): HistoryItem {
  const details = (r.history_details as Record<string, unknown>[] | null) ?? [];
  return {
    id: r.id as string,
    date: (r.date as string) ?? "",
    name: (r.name as string) ?? "",
    engineer: (r.engineer as string) ?? "",
    classification: (r.classification as HistoryClassification) ?? "점검",
    status: (r.status as StatusType) ?? "진행중",
    detail: details[0] ? mapDetail(details[0]) : undefined,
  };
}

function mapClient(r: Record<string, unknown>): ClientInfo {
  const contacts = (r.contacts as Record<string, unknown>[] | null) ?? [];
  const products = (r.products as Record<string, unknown>[] | null) ?? [];
  const history = (r.history_items as Record<string, unknown>[] | null) ?? [];
  return {
    id: r.id as string,
    companyName: (r.company_name as string) ?? "",
    companyNameEn: (r.company_name_en as string) ?? "",
    isVip: (r.is_vip as boolean) ?? false,
    contractStatus: (r.contract_status as ClientInfo["contractStatus"]) ?? "계약중",
    department: (r.department as string) ?? "",
    engineer: (r.engineer as string) ?? "",
    purpose: (r.purpose as string) ?? "",
    maintenanceStatus: (r.maintenance_status as MaintenanceStatus) ?? "해당없음",
    notes: (r.notes as string) ?? "",
    registeredAt: (r.registered_at as string) ?? "",
    contacts: contacts
      .slice()
      .sort((a, b) => ((a.sort_order as number) ?? 0) - ((b.sort_order as number) ?? 0))
      .map(mapContact),
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
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("clients")
      .select("*, contacts(*), products(*)")
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []).map((r) => mapClient(r as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function getClient(id: string): Promise<ClientInfo | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("clients")
      .select(`
        *,
        contacts(*),
        products(*),
        history_items(
          *,
          history_details(*)
        )
      `)
      .eq("id", id)
      .single();
    if (error) return null;
    return mapClient(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

// ─── 고객사 CRUD ───────────────────────────────────────────────────

type ClientFormData = Omit<ClientInfo, "id" | "registeredAt" | "contacts" | "products" | "history">;

export async function addClient(formData: ClientFormData): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient();
    const d = new Date();
    const registeredAt = `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;

    const { error } = await supabase.from("clients").insert({
      company_name: formData.companyName,
      company_name_en: formData.companyNameEn,
      is_vip: formData.isVip,
      contract_status: formData.contractStatus,
      department: formData.department,
      engineer: formData.engineer,
      purpose: formData.purpose,
      maintenance_status: formData.maintenanceStatus,
      notes: formData.notes,
      registered_at: registeredAt,
    });

    if (error) {
      console.error("[addClient] Supabase error:", error.code, error.message, error.hint);
      return { error: `${error.message}${error.hint ? ` (${error.hint})` : ""}` };
    }
    revalidatePath("/clients");
    return { error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[addClient] unexpected:", msg);
    return { error: msg };
  }
}

export async function updateClient(id: string, formData: ClientFormData): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("clients").update({
    company_name: formData.companyName,
    company_name_en: formData.companyNameEn,
    is_vip: formData.isVip,
    contract_status: formData.contractStatus,
    department: formData.department,
    engineer: formData.engineer,
    purpose: formData.purpose,
    maintenance_status: formData.maintenanceStatus,
    notes: formData.notes,
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

// ─── 담당자 CRUD ───────────────────────────────────────────────────

type ContactFormData = Omit<Contact, "id" | "sortOrder">;

export async function addContact(clientId: string, data: ContactFormData): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("contacts").insert({
    client_id: clientId,
    name: data.name,
    phone: data.phone,
    email: data.email,
    is_primary: data.isPrimary,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/clients", "layout");
}

export async function updateContact(id: string, data: ContactFormData): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("contacts").update({
    name: data.name,
    phone: data.phone,
    email: data.email,
    is_primary: data.isPrimary,
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/clients", "layout");
}

export async function deleteContact(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/clients", "layout");
}

// ─── 제품 CRUD ─────────────────────────────────────────────────────

type ProductFormData = Omit<Product, "id">;

export async function addProduct(clientId: string, data: ProductFormData): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").insert({
    client_id: clientId,
    sort_order: data.sortOrder,
    name: data.name,
    category: data.category,
    model: data.model,
    purpose: data.purpose,
    serial_number: data.serialNumber,
    firmware: data.firmware,
    client_os: data.clientOs,
    client_count: data.clientCount,
    maintenance_start: data.maintenanceStart,
    maintenance_end: data.maintenanceEnd,
    maintenance_status: data.maintenanceStatus,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/clients", "layout");
}

export async function updateProduct(id: number, data: ProductFormData): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({
    sort_order: data.sortOrder,
    name: data.name,
    category: data.category,
    model: data.model,
    purpose: data.purpose,
    serial_number: data.serialNumber,
    firmware: data.firmware,
    client_os: data.clientOs,
    client_count: data.clientCount,
    maintenance_start: data.maintenanceStart,
    maintenance_end: data.maintenanceEnd,
    maintenance_status: data.maintenanceStatus,
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

type HistoryItemFormData = Pick<HistoryItem, "date" | "name" | "engineer" | "classification" | "status">;

export async function addHistoryItem(clientId: string, data: HistoryItemFormData): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("history_items").insert({
    client_id: clientId,
    date: data.date,
    name: data.name,
    engineer: data.engineer,
    classification: data.classification,
    status: data.status,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/clients", "layout");
}

export async function updateHistoryItem(id: string, data: HistoryItemFormData): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("history_items").update({
    date: data.date,
    name: data.name,
    engineer: data.engineer,
    classification: data.classification,
    status: data.status,
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

// ─── 히스토리 상세 CRUD ────────────────────────────────────────────

type HistoryDetailFormData = Omit<HistoryDetail, "id">;

export async function upsertHistoryDetail(historyItemId: string, data: HistoryDetailFormData): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("history_details").upsert({
    history_item_id: historyItemId,
    author: data.author,
    date: data.date,
    classification: data.classification,
    content: data.content,
  }, { onConflict: "history_item_id" });
  if (error) throw new Error(error.message);
  revalidatePath("/clients", "layout");
}

export async function deleteHistoryDetail(historyItemId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("history_details")
    .delete()
    .eq("history_item_id", historyItemId);
  if (error) throw new Error(error.message);
  revalidatePath("/clients", "layout");
}
