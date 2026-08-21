"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Printer, Download } from "lucide-react";
import { getInvoice, type Invoice } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ViewInvoice() {
  const params = useParams();
  const router = useRouter();
  const { t, dir } = useLanguage();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (params.id && typeof params.id === "string") {
      const inv = getInvoice(params.id);
      if (inv) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInvoice(inv);
      } else {
        router.push("/");
      }
    }
  }, [params.id, router]);

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-6 flex justify-between items-center print:hidden">
        <Link href="/">
          <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-slate-600">
            <ArrowLeft className="ltr:mr-2 rtl:ml-2 rtl:rotate-180 h-4 w-4" />
            {t("back_to_dashboard")}
          </Button>
        </Link>
        <div className="flex gap-4 items-center">
          <LanguageSwitcher />
          <Button onClick={handlePrint} variant="outline">
            <Printer className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
            {t("print_save")}
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none print:border-0 print:m-0">
        <CardHeader className="border-b pb-8">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-4xl font-bold tracking-tight text-slate-900">
                {t("invoice")}
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1" dir="ltr">
                Invoice #{invoice.id.split("-")[0].toUpperCase()}
              </p>
            </div>
            <div className="ltr:text-right rtl:text-left">
              <h2 className="text-2xl font-bold text-slate-900">DEJ TV</h2>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{t("bill_to")}</p>
              <p className="font-semibold text-lg">{invoice.to}</p>
            </div>
            <div className="ltr:text-right rtl:text-left">
              <div className="grid grid-cols-2 gap-2 text-sm ltr:justify-end rtl:justify-start">
                <p className="font-medium text-slate-500">{t("date")}:</p>
                <p className="font-semibold">{format(new Date(invoice.date), "MMM dd, yyyy")}</p>
                <p className="font-medium text-slate-500">{t("name")}:</p>
                <p className="font-semibold">{invoice.name}</p>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="py-3 ltr:text-left rtl:text-right font-semibold text-slate-900 w-16">{t("no")}</th>
                  <th className="py-3 ltr:text-left rtl:text-right font-semibold text-slate-900">{t("description")}</th>
                  <th className="py-3 ltr:text-right rtl:text-left font-semibold text-slate-900">{t("total")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="py-4 text-slate-500">{index + 1}</td>
                    <td className="py-4 font-medium text-slate-900">{item.description}</td>
                    <td className="py-4 ltr:text-right rtl:text-left text-slate-900" dir="ltr">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200">
                  <td colSpan={2} className="py-4 ltr:text-right rtl:text-left font-bold text-slate-900 text-lg">
                    {t("total")}
                  </td>
                  <td className="py-4 ltr:text-right rtl:text-left font-bold text-slate-900 text-lg" dir="ltr">
                    ${invoice.totalAmount.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {invoice.walletTether && (
            <div className="pt-8 border-t">
              <p className="text-sm font-medium text-slate-500 mb-1">{t("wallet_tether")}:</p>
              <p className="font-mono text-sm break-all bg-slate-50 p-3 rounded-md border" dir="ltr">
                {invoice.walletTether}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
