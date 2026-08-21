'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Product, Invoice } from '@/lib/invoice-types';

export default function InvoiceDashboardPage() {
  const t = useTranslations('invoice');
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'invoices'>('products');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, invoicesRes] = await Promise.all([
        fetch('/api/invoice/products'),
        fetch('/api/invoice/invoices')
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }

      if (invoicesRes.ok) {
        const invoicesData = await invoicesRes.json();
        setInvoices(invoicesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-gray-400">{t('subtitle')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="text-gray-400 text-sm mb-2">{t('products')}</div>
            <div className="text-3xl font-bold">{products.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="text-gray-400 text-sm mb-2">{t('invoices')}</div>
            <div className="text-3xl font-bold">{invoices.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="text-gray-400 text-sm mb-2">{t('total')}</div>
            <div className="text-3xl font-bold">
              ${invoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-white/10">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'products'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('products')} ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'invoices'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('invoices')} ({invoices.length})
          </button>
          <a
            href="/invoice/flyer"
            className="px-6 py-3 font-semibold text-purple-400 hover:text-purple-300 transition-colors ml-auto flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {t('flyer')}
          </a>
        </div>

        {/* Content */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/10">
                <p className="text-gray-400 mb-4">{t('noProducts')}</p>
                <button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                  {t('createProduct')}
                </button>
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-cyan-400/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                      <p className="text-gray-400 text-sm">{product.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-cyan-400 hover:text-cyan-300 px-3 py-1 rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 transition-colors">
                        {t('editProduct')}
                      </button>
                      <button className="text-red-400 hover:text-red-300 px-3 py-1 rounded-lg border border-red-400/30 hover:border-red-400/50 transition-colors">
                        {t('delete')}
                      </button>
                    </div>
                  </div>
                  {product.details && (
                    <p className="text-gray-400 text-sm mb-4">{product.details}</p>
                  )}
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-300">{t('pricingTiers')}</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {product.pricingTiers.map((tier, idx) => (
                        <div
                          key={idx}
                          className="bg-white/5 rounded-lg p-3 border border-white/5"
                        >
                          <div className="text-sm text-gray-400">{tier.tierName}</div>
                          <div className="text-lg font-bold text-cyan-400">
                            ${tier.price.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Min: {tier.minQuantity} units
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-4">
            {invoices.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/10">
                <p className="text-gray-400 mb-4">{t('noInvoices')}</p>
                <button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                  {t('createInvoice')}
                </button>
              </div>
            ) : (
              invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-cyan-400/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{invoice.invoice_number}</h3>
                      <p className="text-gray-400 text-sm">{invoice.customer_name}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-400">
                        ${invoice.total.toFixed(2)}
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                          invoice.status === 'paid'
                            ? 'bg-green-500/20 text-green-400'
                            : invoice.status === 'sent'
                            ? 'bg-blue-500/20 text-blue-400'
                            : invoice.status === 'draft'
                            ? 'bg-gray-500/20 text-gray-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {t(invoice.status)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-cyan-400 hover:text-cyan-300 px-3 py-1 rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 transition-colors text-sm">
                      View
                    </button>
                    <button className="text-purple-400 hover:text-purple-300 px-3 py-1 rounded-lg border border-purple-400/30 hover:border-purple-400/50 transition-colors text-sm">
                      {t('print')}
                    </button>
                    <button className="text-gray-400 hover:text-gray-300 px-3 py-1 rounded-lg border border-gray-400/30 hover:border-gray-400/50 transition-colors text-sm">
                      {t('downloadPDF')}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
