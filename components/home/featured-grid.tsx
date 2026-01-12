'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function FeaturedGrid({ content }: { content: any }) {
    const items = [
        content.item1,
        content.item2,
        content.item3
    ];

    return (
        <section className="py-32 bg-black relative">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 flex justify-between items-end"
                >
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Curated Collections</h2>
                        <p className="text-gray-400 max-w-md">Discover our signature styles, from traditional Persian architecture to modern laser-cut fabrications.</p>
                    </div>
                    <Link href="/archive" className="hidden md:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group">
                        View All <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 h-[600px]">
                    {/* Main Featured Item */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 0.98 }}
                        className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer border border-white/10"
                    >
                        <img src={content.item4.image} alt={content.item4.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8">
                            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2 block">Featured</span>
                            <h3 className="text-3xl font-bold text-white mb-2">{content.item4.title}</h3>
                            <p className="text-gray-300 max-w-sm">{content.item4.desc}</p>
                        </div>
                    </motion.div>

                    {/* Side Items */}
                    <div className="flex flex-col gap-6 h-full">
                        {items.slice(0, 2).map((item: any, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex-1 relative rounded-3xl overflow-hidden group cursor-pointer border border-white/10"
                            >
                                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-6">
                                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                                    <p className="text-gray-400 text-sm">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
