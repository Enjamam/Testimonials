import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Code2,
    Copy,
    ExternalLink,
    Heart,
    Inbox,
    Layers,
    Lock,
    MessageSquare,
    QrCode,
    Shield,
    Sparkles,
    Star,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';
import React, { useState } from 'react';

import AppLogoIcon from '@/components/app-logo-icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';

interface SampleTestimonial {
    id: number;
    name: string;
    role: string;
    company: string;
    rating: number;
    text: string;
    initials: string;
    avatarBg: string;
    tag: string;
}

const SAMPLE_TESTIMONIALS: SampleTestimonial[] = [
    {
        id: 1,
        name: 'Sarah Jenkins',
        role: 'VP of Growth',
        company: 'CloudScale DevOps',
        rating: 5,
        text: 'Testimonials transformed our landing page conversions within 48 hours. The Wall of Love embed looks like it took two weeks of custom engineering to build.',
        initials: 'SJ',
        avatarBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        tag: '34% Conversion Lift',
    },
    {
        id: 2,
        name: 'Alex Rivera',
        role: 'Founder & CEO',
        company: 'HyperFlow Media',
        rating: 5,
        text: 'The branded collection links and instant QR code for our physical event made gathering 60+ verified reviews totally effortless. Incredible product.',
        initials: 'AR',
        avatarBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
        tag: 'Verified Contributor',
    },
    {
        id: 3,
        name: 'Elena Rostova',
        role: 'Head of Product Marketing',
        company: 'SaaSMetrics',
        rating: 5,
        text: 'The zero-dependency embed script loaded in under 15ms on our Shopify store. Zero performance hit, maximum buyer trust.',
        initials: 'ER',
        avatarBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        tag: 'Instant CDN Delivery',
    },
];

export default function Welcome() {
    const { auth } = usePage<{ auth: { user?: { name: string; email: string } | null } }>().props;
    const [previewTheme, setPreviewTheme] = useState<'dark' | 'light' | 'lavender'>('dark');
    const [previewLayout, setPreviewLayout] = useState<'grid' | 'carousel'>('grid');
    const [activeSlide, setActiveSlide] = useState(0);
    const [copiedSnippet, setCopiedSnippet] = useState(false);

    const handleCopySnippet = async () => {
        try {
            await navigator.clipboard.writeText(
                '<script src="https://testimonials.app/embed.js" async></script>\n<div id="testimonials-wall" data-space="spc_demo"></div>'
            );
            setCopiedSnippet(true);
            setTimeout(() => setCopiedSnippet(false), 2500);
        } catch {
            // fallback
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans antialiased overflow-x-hidden">
            <Head>
                <title>Testimonials — Social Proof &amp; Wall of Love Platform</title>
                <meta
                    name="description"
                    content="Collect authentic customer testimonials with branded forms and instant QR codes. Embed stunning, responsive Wall of Love widgets on any website in minutes."
                />
            </Head>

            {/* Ambient Background Glow Mesh */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-tr from-emerald-600/20 via-teal-500/15 to-indigo-600/15 blur-[120px] rounded-full opacity-70" />
                <div className="absolute top-[35%] -left-48 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full" />
                <div className="absolute top-[50%] -right-48 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full" />
            </div>

            {/* Sticky Navigation Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="relative flex aspect-square size-9 shrink-0 items-center justify-center rounded-xl shadow-md shadow-emerald-500/20 ring-1 ring-white/10 overflow-hidden transition-transform group-hover:scale-105">
                            <AppLogoIcon className="size-9" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                                Testimonials
                            </span>
                            <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400">
                                Social Proof Platform
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                        <a href="#features" className="hover:text-white transition-colors">
                            Features
                        </a>
                        <a href="#how-it-works" className="hover:text-white transition-colors">
                            How It Works
                        </a>
                        <a href="#preview" className="hover:text-white transition-colors">
                            Wall of Love
                        </a>
                        <a href="#pricing" className="hover:text-white transition-colors">
                            Pricing
                        </a>
                        <a
                            href="/embed-demo.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                            <span>Live Embed Demo</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </nav>

                    {/* Auth CTA Controls */}
                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Button asChild className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/25">
                                <Link href={dashboard()}>
                                    Go to Dashboard
                                    <ArrowRight className="ml-1.5 w-4 h-4" />
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" asChild className="text-slate-300 hover:text-white hover:bg-slate-800/60">
                                    <Link href={login()}>Log in</Link>
                                </Button>
                                <Button asChild className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/25">
                                    <Link href={register()}>
                                        Get Started Free
                                        <ArrowRight className="ml-1.5 w-4 h-4" />
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center space-y-6">
                    {/* Announcement Pill */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-xs font-semibold text-emerald-300 shadow-inner shadow-emerald-500/10 backdrop-blur-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Production-Grade Social Proof SaaS</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-300">Zero Dependencies</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                        Turn Customer Praise Into Your{' '}
                        <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                            #1 Conversion Engine
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 leading-relaxed">
                        Collect authentic testimonials with frictionless branded forms and instant QR codes. Moderate with 1 click and embed glowing, responsive Wall of Love widgets on any site in under 2 minutes.
                    </p>

                    {/* Primary CTAs */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                        <Button
                            asChild
                            size="lg"
                            className="w-full sm:w-auto px-8 py-6 text-base font-bold bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 rounded-xl shadow-xl shadow-emerald-500/25 active:scale-95 transition-all"
                        >
                            <Link href={auth?.user ? dashboard() : register()}>
                                Start Collecting Free
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto px-6 py-6 text-base font-semibold border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 rounded-xl hover:text-white"
                        >
                            <a href="/embed-demo.html" target="_blank" rel="noopener noreferrer">
                                <Code2 className="mr-2 w-5 h-5 text-emerald-400" />
                                View Live Embed Demo
                            </a>
                        </Button>
                    </div>

                    {/* Trust Proof Micro-items */}
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-emerald-400" /> Free 15 testimonials
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-emerald-400" /> No credit card needed
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-emerald-400" /> 2-minute instant setup
                        </span>
                    </div>

                    {/* Customer Rating Proof Badge */}
                    <div className="pt-4 flex items-center justify-center gap-2">
                        <div className="flex -space-x-2">
                            {['SJ', 'AR', 'ER', 'MD'].map((initials, i) => (
                                <div
                                    key={initials}
                                    className={`w-7 h-7 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold ${
                                        i === 0
                                            ? 'bg-emerald-600 text-white'
                                            : i === 1
                                              ? 'bg-indigo-600 text-white'
                                              : i === 2
                                                ? 'bg-amber-600 text-white'
                                                : 'bg-rose-600 text-white'
                                    }`}
                                >
                                    {initials}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 ml-1.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <span className="text-xs font-semibold text-slate-300">
                            4.9/5 from 850+ growing businesses
                        </span>
                    </div>
                </div>
            </section>

            {/* Interactive Wall of Love Sandbox Preview */}
            <section id="preview" className="relative py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Sandbox Control Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md mb-6 shadow-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Live Wall of Love Sandbox</h3>
                                <p className="text-xs text-slate-400">
                                    Simulating dynamic embed styles in real-time
                                </p>
                            </div>
                        </div>

                        {/* Interactive Preset Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                                <button
                                    onClick={() => setPreviewTheme('dark')}
                                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                                        previewTheme === 'dark'
                                            ? 'bg-emerald-500 text-slate-950 font-bold'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    Obsidian Dark
                                </button>
                                <button
                                    onClick={() => setPreviewTheme('light')}
                                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                                        previewTheme === 'light'
                                            ? 'bg-emerald-500 text-slate-950 font-bold'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    Minimal Light
                                </button>
                                <button
                                    onClick={() => setPreviewTheme('lavender')}
                                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                                        previewTheme === 'lavender'
                                            ? 'bg-emerald-500 text-slate-950 font-bold'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    Soft Lavender
                                </button>
                            </div>

                            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                                <button
                                    onClick={() => setPreviewLayout('grid')}
                                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                                        previewLayout === 'grid'
                                            ? 'bg-slate-800 text-white font-bold'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    Grid
                                </button>
                                <button
                                    onClick={() => setPreviewLayout('carousel')}
                                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                                        previewLayout === 'carousel'
                                            ? 'bg-slate-800 text-white font-bold'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    Carousel
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sandbox Preview Container */}
                    <div
                        className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 shadow-2xl ${
                            previewTheme === 'dark'
                                ? 'bg-slate-950 border-slate-800'
                                : previewTheme === 'light'
                                  ? 'bg-slate-100 border-slate-200'
                                  : 'bg-gradient-to-br from-indigo-100/90 via-purple-50/90 to-pink-100/90 border-indigo-200'
                        }`}
                    >
                        {previewLayout === 'grid' ? (
                            /* Responsive Equal-Height Grid */
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                                {SAMPLE_TESTIMONIALS.map((t) => (
                                    <Card
                                        key={t.id}
                                        className={`h-full flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 ${
                                            previewTheme === 'dark'
                                                ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-lg'
                                                : previewTheme === 'light'
                                                  ? 'bg-white border-slate-200 text-slate-900 shadow-md'
                                                  : 'bg-white/95 border-indigo-100 text-slate-900 shadow-lg'
                                        }`}
                                    >
                                        <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                                            <div className="space-y-3">
                                                {/* Top Rating Row & Badge */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1 text-amber-400">
                                                        {[...Array(t.rating)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className="w-4 h-4 fill-amber-400 text-amber-400"
                                                            />
                                                        ))}
                                                    </div>
                                                    <Badge
                                                        variant="secondary"
                                                        className={`text-[10px] font-semibold ${
                                                            previewTheme === 'dark'
                                                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                                                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        }`}
                                                    >
                                                        {t.tag}
                                                    </Badge>
                                                </div>

                                                {/* Testimonial Quote */}
                                                <p
                                                    className={`text-sm leading-relaxed italic ${
                                                        previewTheme === 'dark'
                                                            ? 'text-slate-200'
                                                            : 'text-slate-700'
                                                    }`}
                                                >
                                                    "{t.text}"
                                                </p>
                                            </div>

                                            {/* Author Bottom Anchor */}
                                            <div
                                                className={`pt-4 border-t flex items-center gap-3 ${
                                                    previewTheme === 'dark'
                                                        ? 'border-slate-800'
                                                        : 'border-slate-100'
                                                }`}
                                            >
                                                <div
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${t.avatarBg}`}
                                                >
                                                    {t.initials}
                                                </div>
                                                <div className="min-w-0">
                                                    <p
                                                        className={`text-xs font-bold truncate ${
                                                            previewTheme === 'dark'
                                                                ? 'text-white'
                                                                : 'text-slate-900'
                                                        }`}
                                                    >
                                                        {t.name}
                                                    </p>
                                                    <p
                                                        className={`text-[11px] truncate ${
                                                            previewTheme === 'dark'
                                                                ? 'text-slate-400'
                                                                : 'text-slate-500'
                                                        }`}
                                                    >
                                                        {t.role} · {t.company}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            /* Interactive Carousel Slider */
                            <div className="space-y-5">
                                <div className="relative flex items-center justify-center">
                                    {/* Previous Slide Button */}
                                    <button
                                        type="button"
                                        onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : SAMPLE_TESTIMONIALS.length - 1))}
                                        aria-label="Previous testimonial"
                                        className={`absolute left-0 sm:-left-3 z-10 p-2.5 rounded-full border shadow-xl transition-all duration-200 active:scale-95 ${
                                            previewTheme === 'dark'
                                                ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800 hover:border-emerald-500'
                                                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-emerald-500'
                                        }`}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {/* Active Slide Card */}
                                    <div className="w-full max-w-2xl px-8 sm:px-14">
                                        <Card
                                            className={`transition-all duration-300 shadow-2xl ${
                                                previewTheme === 'dark'
                                                    ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-emerald-950/20'
                                                    : previewTheme === 'light'
                                                      ? 'bg-white border-slate-200 text-slate-900'
                                                      : 'bg-white/95 border-indigo-100 text-slate-900'
                                            }`}
                                        >
                                            <CardContent className="p-8 sm:p-10 space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 text-amber-400">
                                                        {[...Array(SAMPLE_TESTIMONIALS[activeSlide].rating)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className="w-5 h-5 fill-amber-400 text-amber-400"
                                                            />
                                                        ))}
                                                    </div>
                                                    <Badge
                                                        variant="secondary"
                                                        className={`text-xs font-semibold px-2.5 py-1 ${
                                                            previewTheme === 'dark'
                                                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                                                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        }`}
                                                    >
                                                        {SAMPLE_TESTIMONIALS[activeSlide].tag}
                                                    </Badge>
                                                </div>

                                                <blockquote
                                                    className={`text-base sm:text-lg leading-relaxed italic ${
                                                        previewTheme === 'dark'
                                                            ? 'text-slate-100'
                                                            : 'text-slate-800'
                                                    }`}
                                                >
                                                    "{SAMPLE_TESTIMONIALS[activeSlide].text}"
                                                </blockquote>

                                                <div
                                                    className={`pt-6 border-t flex items-center justify-between ${
                                                        previewTheme === 'dark'
                                                            ? 'border-slate-800'
                                                            : 'border-slate-100'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3.5">
                                                        <div
                                                            className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm border ${SAMPLE_TESTIMONIALS[activeSlide].avatarBg}`}
                                                        >
                                                            {SAMPLE_TESTIMONIALS[activeSlide].initials}
                                                        </div>
                                                        <div>
                                                            <p
                                                                className={`text-sm font-bold ${
                                                                    previewTheme === 'dark'
                                                                        ? 'text-white'
                                                                        : 'text-slate-900'
                                                                }`}
                                                            >
                                                                {SAMPLE_TESTIMONIALS[activeSlide].name}
                                                            </p>
                                                            <p
                                                                className={`text-xs ${
                                                                    previewTheme === 'dark'
                                                                        ? 'text-slate-400'
                                                                        : 'text-slate-500'
                                                                }`}
                                                            >
                                                                {SAMPLE_TESTIMONIALS[activeSlide].role} · {SAMPLE_TESTIMONIALS[activeSlide].company}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
                                                        Slide {activeSlide + 1} of {SAMPLE_TESTIMONIALS.length}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Next Slide Button */}
                                    <button
                                        type="button"
                                        onClick={() => setActiveSlide((prev) => (prev < SAMPLE_TESTIMONIALS.length - 1 ? prev + 1 : 0))}
                                        aria-label="Next testimonial"
                                        className={`absolute right-0 sm:-right-3 z-10 p-2.5 rounded-full border shadow-xl transition-all duration-200 active:scale-95 ${
                                            previewTheme === 'dark'
                                                ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800 hover:border-emerald-500'
                                                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-emerald-500'
                                        }`}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Pagination Dots */}
                                <div className="flex items-center justify-center gap-2 pt-1">
                                    {SAMPLE_TESTIMONIALS.map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setActiveSlide(idx)}
                                            aria-label={`Go to slide ${idx + 1}`}
                                            className={`transition-all duration-200 rounded-full ${
                                                activeSlide === idx
                                                    ? 'w-7 h-2.5 bg-emerald-500'
                                                    : 'w-2.5 h-2.5 bg-slate-600 hover:bg-slate-400'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Live Snippet Box */}
                        <div
                            className={`mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono transition-colors ${
                                previewTheme === 'dark'
                                    ? 'border-slate-800 text-slate-400'
                                    : previewTheme === 'light'
                                      ? 'border-slate-300 text-slate-600'
                                      : 'border-indigo-200 text-slate-700'
                            }`}
                        >
                            <div className="flex items-center gap-2 truncate max-w-xl">
                                <Code2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span className="truncate">
                                    &lt;script src="https://testimonials.app/embed.js" async&gt;&lt;/script&gt;
                                </span>
                            </div>

                            {/* Prominent High-Contrast Copy Button with Crisp White Hover Contrast */}
                            <button
                                type="button"
                                onClick={handleCopySnippet}
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-lg shadow-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            >
                                {copiedSnippet ? (
                                    <>
                                        <Check className="w-4 h-4 text-white" />
                                        <span>Copied to Clipboard!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 text-emerald-100" />
                                        <span>Copy 1-Line Embed Code</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact / Proof Metrics Strip */}
            <section className="py-12 border-y border-slate-900 bg-slate-950/40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div>
                            <p className="text-3xl sm:text-4xl font-extrabold text-white">34%</p>
                            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Average Conversion Lift</p>
                        </div>
                        <div>
                            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">2.5M+</p>
                            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Social Proof Impressions</p>
                        </div>
                        <div>
                            <p className="text-3xl sm:text-4xl font-extrabold text-white">&lt; 2 min</p>
                            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Setup Time to First Review</p>
                        </div>
                        <div>
                            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">100%</p>
                            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Zero-Dependency Embeds</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Pillars Grid */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-950/40 px-3 py-1 font-semibold text-xs">
                        Production Architecture
                    </Badge>
                    <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                        Engineered for Highest Conversion.
                    </h2>
                    <p className="text-slate-400 text-base sm:text-lg">
                        Everything you need to gather authentic customer praise, curate high-impact reviews, and display social proof anywhere.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Pillar 1: Effortless Collection */}
                    <Card className="bg-slate-900/60 border-slate-800 text-slate-100 hover:border-slate-700 transition-colors shadow-xl">
                        <CardContent className="p-8 space-y-5">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                                <QrCode className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Frictionless Collection</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Share branded human-friendly URLs formatted as <code className="text-emerald-400 font-mono text-xs">/s/{'{slug}'}</code> or download high-contrast scannable QR codes for physical desks, receipts, and invoices.
                            </p>
                            <ul className="space-y-2.5 text-xs text-slate-300">
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Instant QR Code PNG generator</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Configurable photos, companies, and social links</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Silent honeypot spam and abuse protection</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Pillar 2: Moderation & Curation */}
                    <Card className="bg-slate-900/60 border-slate-800 text-slate-100 hover:border-slate-700 transition-colors shadow-xl">
                        <CardContent className="p-8 space-y-5">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-inner">
                                <Inbox className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Curated Moderation Inbox</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Moderate incoming feedback with 1 click. Tag standout reviews into your public Wall of Love, search by customer keyword, and filter by star rating.
                            </p>
                            <ul className="space-y-2.5 text-xs text-slate-300">
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>1-Click Wall of Love inclusion toggles</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>1-Click UTF-8 CSV exports for marketing</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Protected respondent email privacy</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Pillar 3: Fast Zero-Dependency Embeds */}
                    <Card className="bg-slate-900/60 border-slate-800 text-slate-100 hover:border-slate-700 transition-colors shadow-xl">
                        <CardContent className="p-8 space-y-5">
                            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shadow-inner">
                                <Layers className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Lightweight Embed Studio</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Embed dynamic walls of love anywhere. Works with Webflow, Shopify, WordPress, Framer, React, Next.js, or plain HTML with zero configuration.
                            </p>
                            <ul className="space-y-2.5 text-xs text-slate-300">
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Uniform equal-height CSS Grid and Carousels</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Theme-adaptive transparent background</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Minimum star rating filter (4★ &amp; 5★ only)</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 border-t border-slate-900 bg-slate-950/60 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-950/40 px-3 py-1 font-semibold text-xs">
                            Simple 3-Step Setup
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                            From Zero to Social Proof in Minutes
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="relative p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center border border-emerald-500/40">
                                1
                            </div>
                            <h4 className="text-lg font-bold text-white">Create Your Space</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Customize your header, questions, star rating, and brand theme. Choose between 6 curated palettes.
                            </p>
                        </div>

                        <div className="relative p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center border border-emerald-500/40">
                                2
                            </div>
                            <h4 className="text-lg font-bold text-white">Collect Reviews</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Share your custom <code className="text-emerald-400">/s/your-brand</code> link or print your instant QR code on customer materials.
                            </p>
                        </div>

                        <div className="relative p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center border border-emerald-500/40">
                                3
                            </div>
                            <h4 className="text-lg font-bold text-white">Embed Wall of Love</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Curate glowing feedback into your Wall of Love and paste one line of HTML to showcase reviews anywhere.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Plans Section */}
            <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-950/40 px-3 py-1 font-semibold text-xs">
                        Simple Pricing
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                        Start Free, Upgrade as You Grow
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base">
                        Transparent plans with zero hidden fees. Powered by Stripe.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Starter Tier */}
                    <Card className="bg-slate-900/60 border-slate-800 text-slate-100 flex flex-col justify-between shadow-xl">
                        <CardContent className="p-8 space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white">Free Starter</h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Perfect for launching your first product or side-project.
                                </p>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-white">$0</span>
                                <span className="text-sm text-slate-400 font-medium">/ month forever</span>
                            </div>

                            <ul className="space-y-3 text-xs text-slate-300">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span><strong>Up to 3 Active Spaces</strong></span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span><strong>100 Testimonials per Space</strong></span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Short &amp; branded URL (<code className="text-emerald-400 font-mono">/s/{'{slug}'}</code>)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Instant high-contrast QR code generator</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Wall of Love curation &amp; moderation</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Honeypot spam &amp; bot protection</span>
                                </li>
                            </ul>

                            <Button
                                asChild
                                variant="outline"
                                className="w-full py-5 border-slate-700 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl"
                            >
                                <Link href={register()}>Start Free</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Pro Growth Tier */}
                    <Card className="relative bg-gradient-to-b from-slate-900 via-emerald-950/20 to-slate-900 border-emerald-500/60 text-slate-100 flex flex-col justify-between shadow-2xl shadow-emerald-950/50">
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                            <span className="px-3.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md">
                                MOST POPULAR
                            </span>
                        </div>
                        <CardContent className="p-8 space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    Pro Growth
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    For high-converting businesses scaling social proof.
                                </p>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-white">$9.99</span>
                                <span className="text-sm text-slate-400 font-medium">/ month</span>
                            </div>

                            <ul className="space-y-3 text-xs text-slate-300">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span><strong>Up to 25 Active Spaces</strong></span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span><strong>1,000 Testimonials per Space</strong></span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Full 6-Theme Palette Customization</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Equal-height Grid &amp; Carousel embed layouts</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Min-Star rating filter (4★ &amp; 5★ reviews only)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>1-Click UTF-8 CSV exports for marketing reports</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Direct Stripe Customer Portal Access</span>
                                </li>
                            </ul>

                            <Button
                                asChild
                                className="w-full py-5 font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
                            >
                                <Link href={register()}>Upgrade to Pro</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Bottom Call to Action Banner */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <div className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 p-8 sm:p-14 text-center space-y-6 shadow-2xl">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />
                    <div className="relative z-10 space-y-4">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                            Ready to collect and showcase glowing testimonials?
                        </h2>
                        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
                            Join hundreds of businesses converting website visitors into loyal customers with authentic social proof.
                        </p>
                        <div className="pt-2">
                            <Button
                                asChild
                                size="lg"
                                className="px-8 py-6 text-base font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-xl shadow-emerald-500/30"
                            >
                                <Link href={auth?.user ? dashboard() : register()}>
                                    Start Collecting Today Free
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-900 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2.5">
                        <AppLogoIcon className="size-6" />
                        <span className="font-bold text-white text-sm">Testimonials</span>
                        <span className="text-slate-600">|</span>
                        <span>Social Proof Platform</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="/embed-demo.html" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            Embed Demo
                        </a>
                        <a href="#features" className="hover:text-white transition-colors">
                            Features
                        </a>
                        <a href="#pricing" className="hover:text-white transition-colors">
                            Pricing
                        </a>
                        <Link href={login()} className="hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link href={register()} className="hover:text-white transition-colors">
                            Create Account
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 text-slate-500">
                        <span className="flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5 text-emerald-500" /> 256-bit SSL
                        </span>
                        <span>•</span>
                        <span>Stripe Verified</span>
                        <span>•</span>
                        <span>GDPR Consent Gated</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
