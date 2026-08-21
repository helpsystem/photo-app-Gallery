"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FileText, Trash2, Download } from "lucide-react";
import { format } from "date-fns";
import { getInvoices, deleteInvoice, type Invoice } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Dashboard() {
  const { t, dir } = useLanguage();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInvoices(getInvoices().sort((a, b) => b.createdAt - a.createdAt));
  }, []);

  const handleDelete = (id: string) => {
    if (confirm(t("delete_confirm"))) {
      deleteInvoice(id);
      setInvoices(getInvoices().sort((a, b) => b.createdAt - a.createdAt));
    }
  };

  const exportCSV = () => {
    if (invoices.length === 0) return;
    
    const headers = ["ID", "To", "Name", "Date", "Total Amount", "Wallet Tether", "Created At"];
    const rows = invoices.map(inv => [
      inv.id,
      inv.to,
      inv.name,
      inv.date,
      inv.totalAmount,
      inv.walletTether,
      new Date(inv.createdAt).toISOString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "invoices.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("invoices")}</h1>
          <p className="text-slate-500">{t("manage_invoices")}</p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <LanguageSwitcher />
          <Button variant="outline" onClick={exportCSV}>
            <Download className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
            {t("export_csv")}
          </Button>
          <Link href="/create">
            <Button>
              <Plus className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
              {t("new_invoice")}
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("recent_invoices")}</CardTitle>
          <CardDescription>
            {t("recent_invoices_desc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p>{t("no_invoices")}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="ltr:text-left rtl:text-right">{t("date")}</TableHead>
                  <TableHead className="ltr:text-left rtl:text-right">{t("name")}</TableHead>
                  <TableHead className="ltr:text-left rtl:text-right">{t("total")}</TableHead>
                  <TableHead className="ltr:text-right rtl:text-left">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      {format(new Date(invoice.date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium">{invoice.name}</TableCell>
                    <TableCell>${invoice.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="ltr:text-right rtl:text-left">
                      <div className="flex justify-end gap-2" dir="ltr">
                        <Link href={`/invoice/${invoice.id}`}>
                          <Button variant="outline" size="sm">
                            {t("view")}
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(invoice.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
