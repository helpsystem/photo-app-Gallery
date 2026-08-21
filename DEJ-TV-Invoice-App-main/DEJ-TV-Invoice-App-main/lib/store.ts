export type InvoiceItem = {
  id: string;
  description: string;
  total: number;
};

export type Invoice = {
  id: string;
  to: string;
  name: string;
  date: string;
  items: InvoiceItem[];
  totalAmount: number;
  walletTether: string;
  createdAt: number;
};

const STORAGE_KEY = "dej_tv_invoices";

export const getInvoices = (): Invoice[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getInvoice = (id: string): Invoice | undefined => {
  const invoices = getInvoices();
  return invoices.find((inv) => inv.id === id);
};

export const saveInvoice = (invoice: Invoice) => {
  const invoices = getInvoices();
  invoices.push(invoice);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
};

export const deleteInvoice = (id: string) => {
  const invoices = getInvoices();
  const filtered = invoices.filter((inv) => inv.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
