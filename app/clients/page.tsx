import { getClients } from "@/lib/actions/clients";
import ClientListView from "@/components/ClientListView";

export default async function ClientsPage() {
  const clients = await getClients();
  return <ClientListView clients={clients} />;
}
