'use client';

import { useState, useEffect } from 'react';
import { getContent, updateContent } from '@/app/actions/content';
import { translateText } from '@/app/actions/translate';
import { Save, Loader2, Sparkles, Languages } from 'lucide-react';
import { toast } from 'sonner';

export default function CMSEditor() {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [translating, setTranslating] = useState<string | null>(null);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            const data = await getContent();
            setContent(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (section: string, key: string, value: string) => {
        setContent((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    const handleNestedChange = (section: string, subSection: string, key: string, value: string) => {
        setContent((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [subSection]: {
                    ...prev[section][subSection],
                    [key]: value
                }
            }
        }));
    }

    const handleTranslate = async (text: string, section: string, key: string, subSection?: string) => {
        const fieldId = subSection ? `${section}-${subSection}-${key}` : `${section}-${key}`;
        setTranslating(fieldId);

        try {
            const translated = await translateText(text);
            if (subSection) {
                handleNestedChange(section, subSection, key, translated);
            } else {
                handleChange(section, key, translated);
            }
            toast.success('Translated to English');
        } catch (e) {
            toast.error('Translation failed');
        } finally {
            setTranslating(null);
        }
    }

    const TranslationButton = ({ text, section, keyName, subSection }: { text: string, section: string, keyName: string, subSection?: string }) => {
        // Simple regex to check if text contains Persian characters
        const hasPersian = /[\u0600-\u06FF]/.test(text);
        const fieldId = subSection ? `${section}-${subSection}-${keyName}` : `${section}-${keyName}`;
        const isTranslating = translating === fieldId;

        if (!hasPersian) return null;

        return (
            <button
                onClick={() => handleTranslate(text, section, keyName, subSection)}
                className="absolute right-2 top-2 p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md text-white shadow-lg hover:from-indigo-400 hover:to-purple-500 transition-all group"
                title="Auto-Translate to English"
            >
                {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span className="sr-only">Translate</span>
            </button>
        );
    }

    const handleSave = async (section: string) => {
        setSaving(true);
        try {
            await updateContent(section, content[section]);
            toast.success('Content updated successfully');
        } catch (e) {
            toast.error('Failed to update content');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white">Loading Editor...</div>;

    return (
        <div className="space-y-12">
            {/* Home Page Editor */}
            <section className="space-y-6 border border-white/10 rounded-xl p-6 bg-white/5">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-cyan-400">Home Page Content</h2>
                    <button onClick={() => handleSave('home')} className="flex items-center gap-2 bg-cyan-600 px-4 py-2 rounded-lg hover:bg-cyan-500 transition">
                        {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <label className="block text-sm text-gray-400 mb-1">Hero Title</label>
                        <div className="relative">
                            <input
                                value={content.home.hero.title}
                                onChange={(e) => handleNestedChange('home', 'hero', 'title', e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 pr-12 focus:ring-1 focus:ring-cyan-500 outline-none"
                            />
                            <TranslationButton text={content.home.hero.title} section="home" subSection="hero" keyName="title" />
                        </div>
                    </div>
                    <div className="relative">
                        <label className="block text-sm text-gray-400 mb-1">Hero Subtitle</label>
                        <div className="relative">
                            <textarea
                                value={content.home.hero.subtitle}
                                onChange={(e) => handleNestedChange('home', 'hero', 'subtitle', e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 h-24 pr-12 focus:ring-1 focus:ring-cyan-500 outline-none"
                            />
                            <TranslationButton text={content.home.hero.subtitle} section="home" subSection="hero" keyName="subtitle" />
                        </div>
                    </div>
                </div>
            </section>

            {/* About Page Editor */}
            <section className="space-y-6 border border-white/10 rounded-xl p-6 bg-white/5">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-purple-400">About Page Content</h2>
                    <button onClick={() => handleSave('about')} className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500 transition">
                        {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <label className="block text-sm text-gray-400 mb-1">Our Story</label>
                        <div className="relative">
                            <textarea
                                value={content.about.story}
                                onChange={(e) => handleChange('about', 'story', e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 h-32 pr-12 focus:ring-1 focus:ring-purple-500 outline-none"
                            />
                            <TranslationButton text={content.about.story} section="about" keyName="story" />
                        </div>
                    </div>
                    <div className="relative">
                        <label className="block text-sm text-gray-400 mb-1">Our Craft</label>
                        <div className="relative">
                            <textarea
                                value={content.about.craft}
                                onChange={(e) => handleChange('about', 'craft', e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 h-32 pr-12 focus:ring-1 focus:ring-purple-500 outline-none"
                            />
                            <TranslationButton text={content.about.craft} section="about" keyName="craft" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery / Photos Editor is handled by UploadZone but we can add list management here later */}
        </div>
    );
}
