'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Product, CompanyInfo } from '@/lib/invoice-types';
import { Download, Printer, Save, Image, Type, Layout } from 'lucide-react';

export default function FlyerDesignerPage() {
  const t = useTranslations('invoice');
  const [products, setProducts] = useState<Product[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const flyerRef = useRef<HTMLDivElement>(null);

  // Flyer customization state
  const [flyerTitle, setFlyerTitle] = useState('Art, Tech & Creative Marketing Solutions');
  const [flyerSubtitle, setFlyerSubtitle] = useState('CUSTOM RESIN KEYCHAINS');
  const [showLogo, setShowLogo] = useState(true);
  const [colorScheme, setColorScheme] = useState<'blue-purple' | 'cyan-purple' | 'green-blue' | 'orange-red'>('blue-purple');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const gradients = {
    'blue-purple': 'from-blue-600 via-purple-600 to-purple-900',
    'cyan-purple': 'from-cyan-600 via-purple-600 to-purple-900',
    'green-blue': 'from-green-600 via-blue-600 to-blue-900',
    'orange-red': 'from-orange-600 via-red-600 to-red-900',
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, companyRes] = await Promise.all([
        fetch('/api/invoice/products'),
        fetch('/api/invoice/company-info')
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
        // Select all products by default
        setSelectedProducts(productsData.map((p: Product) => p.id));
      }

      if (companyRes.ok) {
        const companyData = await companyRes.json();
        setCompanyInfo(companyData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      // @ts-ignore
      const html2canvas = (await import('html2canvas')).default;
      // @ts-ignore
      const jsPDF = (await import('jspdf')).default;

      if (!flyerRef.current) return;

      const canvas = await html2canvas(flyerRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`flyer-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const displayedProducts = products.filter(p => selectedProducts.includes(p.id));

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
            Flyer Designer
          </h1>
          <p className="text-gray-400">Create professional product flyers</p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Customization Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Actions */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Layout className="w-5 h-5" />
                Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handlePrint}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Printer className="w-5 h-5" />
                  Print Flyer
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
            </div>

            {/* Text Settings */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Type className="w-5 h-5" />
                Text Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Title</label>
                  <input
                    type="text"
                    value={flyerTitle}
                    onChange={(e) => setFlyerTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={flyerSubtitle}
                    onChange={(e) => setFlyerSubtitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showLogo}
                      onChange={(e) => setShowLogo(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-300">Show Logo</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Color Scheme */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-4">Color Scheme</h3>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(gradients) as Array<keyof typeof gradients>).map((scheme) => (
                  <button
                    key={scheme}
                    onClick={() => setColorScheme(scheme)}
                    className={`h-12 rounded-lg bg-gradient-to-r ${gradients[scheme]} ${
                      colorScheme === scheme ? 'ring-2 ring-white' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Product Selection */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-4">Products</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {products.map((product) => (
                  <label key={product.id} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{product.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Flyer Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-3xl mx-auto">
                <div ref={flyerRef} className={`bg-gradient-to-br ${gradients[colorScheme]} p-8 md:p-12 text-white print:shadow-none`}>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    {showLogo && companyInfo?.logoUrl && (
                      <img
                        src={companyInfo.logoUrl}
                        alt={companyInfo.name}
                        className="h-20 object-contain"
                      />
                    )}
                    <div className={showLogo && companyInfo?.logoUrl ? 'text-right' : 'text-center flex-1'}>
                      <h1 className="text-3xl md:text-4xl font-bold mb-2">{flyerTitle}</h1>
                    </div>
                  </div>

                  {/* Products Section */}
                  {displayedProducts.length > 0 && (
                    <div className="space-y-8">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold mb-2">{flyerSubtitle}</h2>
                        <p className="text-sm opacity-90">THE PRICING IS STRUCTURED INTO THREE TIERS BASED ON PRODUCTION VOLUME.</p>
                      </div>

                      {/* Products Table */}
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold">PRODUCTS</h3>
                          <div className="flex gap-2">
                            <div className="w-8 h-1 bg-white/60 rounded"></div>
                            <div className="w-8 h-8 border-2 border-white/60 rounded-full"></div>
                            <div className="w-8 h-1 bg-white/60 rounded mt-3.5"></div>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-white/20">
                                <th className="text-left py-3 px-2 text-sm font-semibold">NO</th>
                                <th className="text-left py-3 px-2 text-sm font-semibold">PRODUCT LIST</th>
                                <th className="text-center py-3 px-2 text-sm font-semibold">RETAIL<br/>(1 PC)</th>
                                <th className="text-center py-3 px-2 text-sm font-semibold">BULK<br/>(50+)</th>
                                <th className="text-center py-3 px-2 text-sm font-semibold">BULK<br/>(500+)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {displayedProducts.map((product, index) => {
                                const tiers = product.pricingTiers.sort((a, b) => a.minQuantity - b.minQuantity);
                                return (
                                  <tr key={product.id} className="border-b border-white/10">
                                    <td className="py-4 px-2 font-semibold">{index + 1}.</td>
                                    <td className="py-4 px-2">
                                      <div className="font-semibold">{product.name}</div>
                                      {product.details && (
                                        <div className="text-xs opacity-80 mt-1">({product.details})</div>
                                      )}
                                    </td>
                                    <td className="py-4 px-2 text-center font-bold">
                                      {tiers[0] ? `$${tiers[0].price.toFixed(2)}` : '-'}
                                    </td>
                                    <td className="py-4 px-2 text-center font-bold">
                                      {tiers[1] ? `$${tiers[1].price.toFixed(2)}` : '-'}
                                    </td>
                                    <td className="py-4 px-2 text-center font-bold">
                                      {tiers[2] ? `$${tiers[2].price.toFixed(2)}` : '-'}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  {companyInfo && (
                    <div className="mt-8 pt-6 border-t border-white/20">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2">Handcrafted Excellence &</h3>
                          <h3 className="text-xl font-bold">Professional Design</h3>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold mb-1">Contact Information:</p>
                          <p className="text-sm">Founder: {companyInfo.name}</p>
                          {companyInfo.phone && <p className="text-sm">Phone: {companyInfo.phone}</p>}
                          {companyInfo.email && <p className="text-sm">Email: {companyInfo.email}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {displayedProducts.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                Please select at least one product to display on the flyer
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
