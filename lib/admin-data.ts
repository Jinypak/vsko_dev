export type CustomerHistory = {
  dateTime: string;
  title: string;
  note?: string;
};

export type Customer = {
  id: string;
  name: string;
  hsmCount: number;
  model: string;
  serials: string[];
  engineer: string;
  contacts: {
    name: string;
    team: string;
    phone: string;
    email: string;
  }[];
  histories: CustomerHistory[];
};

export const customers: Customer[] = [];
