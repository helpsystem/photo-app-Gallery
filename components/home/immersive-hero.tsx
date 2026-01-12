'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { DigitalBlueprintCanvas } from './digital-blueprint-canvas';
import { ArrowRight } from 'lucide-react';

export function ImmersiveHero({ content }: { content: any }) {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    // Scroll Animations
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

    return (
        <section ref={targetRef} className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center selection:bg-cyan-500/30">

            {/* 1. Cinematic Background Video (Behind everything, visible through text) */}
            <div className="absolute inset-0 z-0">
                {/* This video acts as the glowing texture. Using a high-quality abstract loop. */}
                {/* Since we can't reliably load a local video file without uploading, we use a CSS fallback or remote URL if safe. */}
                {/* For this demo, we use a robust CSS complex gradient that ANIMATES to simulate moving liquid light. */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 animate-pulse opacity-50"></div>
                <div className="absolute inset-0 bg-[url('https://cdn.pixabay.com/video/2019/02/25/21650-319409899_tiny.mp4')] bg-cover opacity-60 hidden md:block">
                    {/* Note: In a real Next.js app, we'd use a <video> tag properly. Simple img placeholder for the concept if video fails. */}
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60">
                        <source src="https://cdn.pixabay.com/video/2021/04/11/70796-538662995_tiny.mp4" type="video/mp4" />
                    </video>
                </div>
            </div>

            {/* 2. Interactive Digital Layer */}
            <DigitalBlueprintCanvas />

            {/* 3. The Masking Layer (Crucial for the "Text holds the light" effect) */}
            {/* The background is black. The TEXT uses 'mix-blend-mode: screen' or we simply overlay black with cutouts. 
                Easier Approach: The main text has the video as background-clip. */}

            <motion.div
                style={{ opacity, scale, y }}
                className="relative z-20 text-center flex flex-col items-center max-w-7xl mx-auto px-4"
            >
                {/* Stage 1: Lines (Handled by Canvas on load) */}

                {/* Stage 2: Main Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                    className="text-[12vw] leading-none font-black tracking-tighter mix-blend-screen text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500"
                    // Note: True 'Video in Text' requires 'background-clip: text' on a container with the video as background.
                    // Here we approximate with a high-contrast gradient + blend mode for high performance.
                    style={{
                        backgroundImage: 'url(https://media.giphy.com/media/26FPJGjhefSJuaRhu/giphy.gif)', // Abstract flowing texture
                        backgroundSize: 'cover',
                        WebkitBackgroundClip: 'text',
                        color: 'rgba(255,255,255,0.1)', // Slight fill
                        WebkitTextStroke: '1px rgba(255,255,255,0.2)'
                    }}
                >
                    RAM ARCHIVE
                </motion.h1>

                {/* Stage 3: Subtitle & CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="mt-8 space-y-8"
                >
                    <p className="text-lg md:text-2xl font-light text-cyan-100/80 tracking-widest uppercase">
                        Where sketches breathe and materials speak
                    </p>

                    <div className="flex justify-center">
                        <Link href="/archive">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-full border border-white/20 transition-all hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.3)]"
                            >
                                <div className="absolute inset-0 bg-cyan-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <span className="relative flex items-center gap-3 text-white font-medium tracking-wide">
                                    EXPLORE COLLECTION
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </motion.div>

            {/* Gradient Vignette to ensure edges are dark */}
            <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent to-black/90"></div>
        </section>
    );
}
