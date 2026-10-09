import { Head } from '@inertiajs/react';
import {
    Check,
    CheckCircle2,
    Eye,
    Laptop,
    Moon,
    Palette,
    RefreshCw,
    Sliders,
    Sparkles,
    Star,
    Sun,
    ThumbsUp,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type {
    AccentColor,
    Appearance as AppearanceMode,
    RadiusPreset,
} from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';

interface AccentOption {
    id: AccentColor;
    name: string;
    description: string;
    hex: string;
    bgClass: string;
    borderClass: string;
    ringClass: string;
    glowClass: string;
}

const ACCENT_OPTIONS: AccentOption[] = [
    {
        id: 'indigo',
        name: 'Royal Indigo',
        description: 'Modern SaaS & Enterprise',
        hex: '#6366F1',
        bgClass: 'bg-indigo-500',
        borderClass: 'border-indigo-500',
        ringClass: 'ring-indigo-500/30',
        glowClass: 'shadow-indigo-500/20',
    },
    {
        id: 'emerald',
        name: 'Fresh Emerald',
        description: 'High Growth & Mint Fresh',
        hex: '#10B981',
        bgClass: 'bg-emerald-500',
        borderClass: 'border-emerald-500',
        ringClass: 'ring-emerald-500/30',
        glowClass: 'shadow-emerald-500/20',
    },
    {
        id: 'violet',
        name: 'Vibrant Violet',
        description: 'Creative & Electric Purple',
        hex: '#8B5CF6',
        bgClass: 'bg-violet-500',
        borderClass: 'border-violet-500',
        ringClass: 'ring-violet-500/30',
        glowClass: 'shadow-violet-500/20',
    },
    {
        id: 'rose',
        name: 'Sunset Rose',
        description: 'Warm Coral & Passion',
        hex: '#F43F5E',
        bgClass: 'bg-rose-500',
        borderClass: 'border-rose-500',
        ringClass: 'ring-rose-500/30',
        glowClass: 'shadow-rose-500/20',
    },
    {
        id: 'amber',
        name: 'Golden Amber',
        description: 'Warmth, Stars & Honey',
        hex: '#F59E0B',
        bgClass: 'bg-amber-500',
        borderClass: 'border-amber-500',
        ringClass: 'ring-amber-500/30',
        glowClass: 'shadow-amber-500/20',
    },
    {
        id: 'cyan',
        name: 'Ocean Cyan',
        description: 'Crisp Azure & Oceanic',
        hex: '#06B6D4',
        bgClass: 'bg-cyan-500',
        borderClass: 'border-cyan-500',
        ringClass: 'ring-cyan-500/30',
        glowClass: 'shadow-cyan-500/20',
    },
    {
        id: 'neutral',
        name: 'Monochrome',
        description: 'Minimalist Zinc & Slate',
        hex: '#71717A',
        bgClass: 'bg-zinc-500',
        borderClass: 'border-zinc-500',
        ringClass: 'ring-zinc-500/30',
        glowClass: 'shadow-zinc-500/20',
    },
];

const RADIUS_OPTIONS: { id: RadiusPreset; label: string; px: string; desc: string }[] = [
    { id: 'sm', label: 'Compact', px: '6px', desc: 'Sharp, technical edges' },
    { id: 'md', label: 'Balanced', px: '10px', desc: 'Default modern rounded' },
    { id: 'lg', label: 'Smooth', px: '14px', desc: 'Soft friendly curvature' },
    { id: 'full', label: 'Pill / Soft', px: '20px', desc: 'Curved organic style' },
];

export default function Appearance() {
    const {
        appearance,
        resolvedAppearance,
        updateAppearance,
        accent,
        updateAccent,
        radius,
        updateRadius,
    } = useAppearance();

    const [copiedFeedback, setCopiedFeedback] = useState(false);

    const activeAccent = ACCENT_OPTIONS.find((a) => a.id === accent) || ACCENT_OPTIONS[0];

    const handleResetDefaults = () => {
        updateAppearance('system');
        updateAccent('indigo');
        updateRadius('md');
    };

    return (
        <>
            <Head title="Appearance & Themes" />

            <div className="space-y-8">
                {/* Header & Subtitle */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                <Palette className="w-5 h-5 text-primary" />
                                Appearance & UI Theme
                            </h2>
                            <Badge
                                variant="outline"
                                className="capitalize font-semibold border-primary/40 text-primary bg-primary/5"
                            >
                                <Sparkles className="w-3 h-3 mr-1 fill-current" />
                                {activeAccent.name}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Customize color palettes, interface radiance, and component curvature with live real-time previews.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetDefaults}
                        className="self-start sm:self-auto text-xs gap-1.5"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reset Defaults
                    </Button>
                </div>

                {/* 1. Theme Mode Selection (Light / Dark / System) with rich preview mockups */}
                <Card className="border-border/70 shadow-xs">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Sun className="w-4 h-4 text-amber-500 dark:hidden" />
                            <Moon className="w-4 h-4 text-indigo-400 hidden dark:inline-block" />
                            Interface Theme
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Select how the application is rendered across day and night environments.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                            {/* Light Mode Card */}
                            <button
                                type="button"
                                onClick={() => updateAppearance('light')}
                                className={cn(
                                    'group relative flex flex-col items-start p-3.5 rounded-xl border text-left transition-all',
                                    appearance === 'light'
                                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
                                        : 'border-border/80 hover:border-border hover:bg-muted/40',
                                )}
                            >
                                <div className="w-full h-20 rounded-lg bg-white border border-zinc-200 p-2.5 flex flex-col justify-between shadow-xs mb-3 overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-2 rounded-full bg-zinc-300" />
                                        <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="w-full h-2 rounded bg-zinc-100" />
                                        <div className="w-3/4 h-2 rounded bg-zinc-200" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <div className="font-semibold text-sm flex items-center gap-1.5 text-foreground">
                                        <Sun className="w-4 h-4 text-amber-500" />
                                        Light
                                    </div>
                                    {appearance === 'light' && (
                                        <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" />
                                    )}
                                </div>
                                <span className="text-[11px] text-muted-foreground mt-1">
                                    Crisp, high-contrast daylight mode
                                </span>
                            </button>

                            {/* Dark Mode Card */}
                            <button
                                type="button"
                                onClick={() => updateAppearance('dark')}
                                className={cn(
                                    'group relative flex flex-col items-start p-3.5 rounded-xl border text-left transition-all',
                                    appearance === 'dark'
                                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
                                        : 'border-border/80 hover:border-border hover:bg-muted/40',
                                )}
                            >
                                <div className="w-full h-20 rounded-lg bg-zinc-950 border border-zinc-800 p-2.5 flex flex-col justify-between shadow-xs mb-3 overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-2 rounded-full bg-zinc-800" />
                                        <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="w-full h-2 rounded bg-zinc-900" />
                                        <div className="w-3/4 h-2 rounded bg-zinc-800" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <div className="font-semibold text-sm flex items-center gap-1.5 text-foreground">
                                        <Moon className="w-4 h-4 text-indigo-400" />
                                        Dark
                                    </div>
                                    {appearance === 'dark' && (
                                        <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" />
                                    )}
                                </div>
                                <span className="text-[11px] text-muted-foreground mt-1">
                                    Sleek obsidian theme, easy on the eyes
                                </span>
                            </button>

                            {/* System Mode Card */}
                            <button
                                type="button"
                                onClick={() => updateAppearance('system')}
                                className={cn(
                                    'group relative flex flex-col items-start p-3.5 rounded-xl border text-left transition-all',
                                    appearance === 'system'
                                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
                                        : 'border-border/80 hover:border-border hover:bg-muted/40',
                                )}
                            >
                                <div className="w-full h-20 rounded-lg border border-zinc-300 dark:border-zinc-800 p-2.5 flex flex-col justify-between shadow-xs mb-3 overflow-hidden relative bg-gradient-to-tr from-zinc-950 via-zinc-800 to-zinc-100">
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-2 rounded-full bg-white/40" />
                                        <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="w-full h-2 rounded bg-white/30" />
                                        <div className="w-3/4 h-2 rounded bg-white/20" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <div className="font-semibold text-sm flex items-center gap-1.5 text-foreground">
                                        <Laptop className="w-4 h-4 text-zinc-500" />
                                        System
                                    </div>
                                    {appearance === 'system' && (
                                        <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" />
                                    )}
                                </div>
                                <span className="text-[11px] text-muted-foreground mt-1">
                                    Automatically matches OS appearance ({resolvedAppearance})
                                </span>
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Radiant Accent Palette Selector */}
                <Card className="border-border/70 shadow-xs">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            Brand Accent Palette
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Choose an accent color to style primary buttons, active states, focus rings, and widget highlights.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                            {ACCENT_OPTIONS.map((opt) => {
                                const isSelected = accent === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => updateAccent(opt.id)}
                                        className={cn(
                                            'group relative flex flex-col items-center p-3 rounded-xl border text-center transition-all',
                                            isSelected
                                                ? 'border-primary ring-2 ring-primary/25 bg-muted/60 shadow-sm scale-102'
                                                : 'border-border/80 hover:border-border hover:bg-muted/40 hover:scale-101',
                                        )}
                                    >
                                        {/* Color Swatch Circle */}
                                        <div
                                            className={cn(
                                                'w-9 h-9 rounded-full flex items-center justify-center transition-transform shadow-sm mb-2',
                                                opt.bgClass,
                                            )}
                                            style={{ backgroundColor: opt.hex }}
                                        >
                                            {isSelected && (
                                                <Check className="w-5 h-5 text-white drop-shadow-sm animate-in zoom-in-75 duration-150" />
                                            )}
                                        </div>

                                        <span className="text-xs font-semibold text-foreground tracking-tight">
                                            {opt.name.split(' ')[1] || opt.name}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                                            {opt.id}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Corner Radius / Component Curvature Preset */}
                <Card className="border-border/70 shadow-xs">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Sliders className="w-4 h-4 text-primary" />
                            Interface Corner Curvature
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Control border curvature across cards, buttons, dialogs, and inputs.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {RADIUS_OPTIONS.map((item) => {
                                const isSelected = radius === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => updateRadius(item.id)}
                                        className={cn(
                                            'flex flex-col items-start p-3 rounded-xl border text-left transition-all',
                                            isSelected
                                                ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
                                                : 'border-border/80 hover:border-border hover:bg-muted/40',
                                        )}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className="font-semibold text-xs text-foreground">
                                                {item.label}
                                            </span>
                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                {item.px}
                                            </Badge>
                                        </div>
                                        <span className="text-[11px] text-muted-foreground mt-1">
                                            {item.desc}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Live Interactive Component Playground Card */}
                <Card className="border-primary/30 shadow-md bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden">
                    <CardHeader className="pb-3 border-b border-border/50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-primary" />
                                    Live Theme Preview
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Real-time showcase of how buttons, badges, star ratings, and testimonial cards render with your active settings.
                                </CardDescription>
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge className="bg-primary text-primary-foreground font-medium text-xs">
                                    Theme: {activeAccent.name}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    {resolvedAppearance.toUpperCase()}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6 space-y-6">
                        {/* Sample UI Controls Row */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Button className="font-medium shadow-xs">
                                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                                Primary Action
                            </Button>

                            <Button variant="outline" className="font-medium">
                                Secondary Button
                            </Button>

                            <Button variant="secondary" className="font-medium">
                                Ghost / Neutral
                            </Button>

                            <Badge className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Verified Badge
                            </Badge>

                            <Badge variant="outline" className="border-border">
                                Standard Badge
                            </Badge>
                        </div>

                        {/* Sample Testimonial Card Preview */}
                        <div className="p-4 sm:p-5 rounded-xl border border-border/70 bg-card/80 backdrop-blur-xs shadow-xs space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className="w-4 h-4 fill-amber-400 text-amber-400"
                                        />
                                    ))}
                                    <span className="text-xs font-semibold ml-1.5 text-foreground">
                                        5.0
                                    </span>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="text-[10px] font-semibold text-primary bg-primary/10"
                                >
                                    Featured on Wall of Love
                                </Badge>
                            </div>

                            <p className="text-sm italic text-foreground/90 leading-relaxed">
                                "The testimonial collection flow revolutionized how we capture authentic feedback. Our social proof conversions increased by 42% within the first two weeks!"
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-border/60">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className={cn(
                                            'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-xs',
                                            activeAccent.bgClass,
                                        )}
                                        style={{ backgroundColor: activeAccent.hex }}
                                    >
                                        SL
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-foreground">
                                            Sarah Lin
                                        </div>
                                        <div className="text-[11px] text-muted-foreground">
                                            VP of Engineering at TechVanguard
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                                    <ThumbsUp className="w-3 h-3 text-primary" />
                                    Verified Contributor
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Appearance & Themes',
            href: editAppearance(),
        },
    ],
};
