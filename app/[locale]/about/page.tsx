'use client';

import { motion } from 'framer-motion';
import { getContent } from '@/app/actions/content';
import { useState, useEffect } from 'react';

export default function AboutPage() {
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getContent();
            setContent(data);
        }
        fetchData();
    }, []);

    if (!content) return <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">Loading Story...</div>;

    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-32">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-bold tracking-tighter mb-6"
                    >
                        RAM <span className="text-stroke text-transparent">FAMILY</span>
                    </motion.h1>
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl md:text-3xl text-cyan-400 font-light"
                    >
                        Guardians of Persian Art
                    </motion.h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mt-8"
                    ></motion.div>
                </div>

                {/* Story Section */}
                <div className="space-y-32">
                    {/* Section 1: Introduction */}
                    <section className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">
                                Iranian Roots, Global Vision
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                {content.about.story}
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-2xl transform rotate-3 blur-sm opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                            <img
                                src={content.about.images?.[0] || "/assets/about/fam1.jpg"}
                                alt="The Artists"
                                className="relative w-full h-auto max-h-[600px] object-contain rounded-2xl border border-white/10 shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700 mx-auto"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-black/80 backdrop-blur border border-white/10 p-4 rounded-xl hidden md:block">
                                <p className="text-sm font-mono text-cyan-400">EST. TEHRAN</p>
                            </div>
                        </motion.div>
                    </section>

                    {/* Section 2: The Craft */}
                    <section className="grid md:grid-cols-2 gap-16 items-center md:flex-row-reverse">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative order-2 md:order-1 grid grid-cols-2 gap-4 items-center"
                        >
                            <img
                                src={content.about.images?.[1] || "/assets/about/fam2.jpg"}
                                alt="Craftsmanship"
                                className="w-full h-auto max-h-80 object-contain rounded-xl border border-white/10 shadow-lg transform translate-y-8"
                            />
                            <img
                                src={content.about.images?.[2] || "/assets/about/fam3.png"}
                                alt="Detail"
                                className="w-full h-auto max-h-80 object-contain rounded-xl border border-white/10 shadow-lg"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 md:order-2 space-y-6"
                        >
                            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                                The Art of Creation
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                {content.about.craft}
                            </p>
                            <ul className="space-y-4 pt-4">
                                {['Persian Calligraphy (Nastaliq)', 'Traditional Tazhib Illumination', 'Modern Architectural Modeling', 'Leather & Wood Fusion'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-lg text-gray-200">
                                        <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </section>

                    {/* Full Width Impact Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative w-full h-auto min-h-[400px] rounded-3xl overflow-hidden bg-white/5"
                    >
                        <img
                            src={content.about.images?.[3] || "/assets/about/fam5.jpg"}
                            alt="Studio Life"
                            className="w-full h-full object-contain md:object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                        <div className="absolute bottom-12 left-12 max-w-xl">
                            <h3 className="text-3xl font-bold mb-4">"Art is not just what we make, it's who we are."</h3>
                            <p className="text-cyan-400 font-mono">RAM FAMILY STUDIO</p>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-32 text-center p-12 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold mb-4">Passionate about Persian Art?</h3>
                    <p className="text-gray-400 mb-8">Commission a unique piece that tells your story.</p>
                    <a href="/contact" className="inline-block px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                        Start a Commission
                    </a>
                </div>
            </div>
        </main>
    );
}
