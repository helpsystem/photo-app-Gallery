'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram } from 'lucide-react';

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-32">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-900/20 to-black pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-cyan-500/10 blur-[120px] rounded-full point-events-none"></div>

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                <div className="grid md:grid-cols-2 gap-16 items-start">

                    {/* Info Section */}
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-bold mb-8"
                        >
                            Let's Create <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Something Unique</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 text-lg mb-12 max-w-lg"
                        >
                            Whether you're looking for custom architectural models, personalized leather goods, or unique woodwork, we're here to bring your vision to life.
                        </motion.p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-white/5 border border-white/10">
                                    <Phone className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Call Us</h3>
                                    <p className="text-gray-400">+1 (555) 123-4567</p>
                                    <p className="text-sm text-gray-500">Mon-Fri, 9am - 6pm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-white/5 border border-white/10">
                                    <Mail className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Email Us</h3>
                                    <p className="text-gray-400">ramfamilydesigns@gmail.com</p>
                                    <p className="text-sm text-gray-500">For orders & inquiries</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-white/5 border border-white/10">
                                    <Instagram className="w-6 h-6 text-pink-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Follow Us</h3>
                                    <p className="text-gray-400">@RamFamilyDesigns</p>
                                    <Link href="https://instagram.com" className="text-sm text-cyan-400 hover:text-cyan-300">View Gallery</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12"
                    >
                        <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Name</label>
                                    <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Email</label>
                                    <input type="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors" placeholder="john@example.com" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Interest</label>
                                <select className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors text-gray-300">
                                    <option>Custom Woodwork</option>
                                    <option>Leather Goods</option>
                                    <option>Architectural Model</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Message</label>
                                <textarea rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Tell us about your project..."></textarea>
                            </div>

                            <button className="w-full py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2">
                                <Send className="w-5 h-5" />
                                Send Request
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

import Link from 'next/link';
