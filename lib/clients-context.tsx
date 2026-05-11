"use client";

import { createContext, useContext, useState } from "react";
import { ClientInfo } from "@/types/client";
import { mockClients } from "@/lib/mock-data";

interface ClientsContextType {
  clients: ClientInfo[];
  addClient: (client: ClientInfo) => void;
  updateClient: (id: string, data: Partial<ClientInfo>) => void;
  deleteClient: (id: string) => void;
}

const ClientsContext = createContext<ClientsContextType | null>(null);

export function ClientsProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<ClientInfo[]>(mockClients);

  const addClient = (client: ClientInfo) => {
    setClients((prev) => [client, ...prev]);
  };

  const updateClient = (id: string, data: Partial<ClientInfo>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <ClientsContext.Provider value={{ clients, addClient, updateClient, deleteClient }}>
      {children}
    </ClientsContext.Provider>
  );
}

export function useClients() {
  const ctx = useContext(ClientsContext);
  if (!ctx) throw new Error("useClients must be used within ClientsProvider");
  return ctx;
}
