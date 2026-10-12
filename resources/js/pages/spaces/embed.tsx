import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Code2,
    Copy,
    ExternalLink,
    Eye,
    Grid2X2,
    LayoutList,
    Moon,
    Sliders,
    Sparkles,
    Sun,
} from 'lucide-react';
import React, { useState } from 'react';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import EmbedWall from '@/pages/embed/wall';
import type { BreadcrumbItem } from '@/types';

interface TestimonialData {
    id: number;
    name: string;
    company_name: string | null;
    social_url: string | null;
    profile_photo_path: string | null;
    testimonial: string;
    rating: number | null;
    created_at: string;
}

interface EmbedConfigData {
    id: number;
    space_id: number;
    layout: 'masonry' | 'carousel';
    dark_mode: boolean;
    animation_enabled: boolean;
    background_color: string | null;
    item_limit: number;
    display_options: {
        show_rating: boolean;
        show_profile_photo: boolean;
        show_company_name: boolean;
        min_rating?: number;
        card_radius?: string;
        card_shadow?: string;
    };
}

interface SpaceData {
    id: number;
    name: string;
    title: string;
    public_id: string;
    slug: string;
    rating_enabled: boolean;
}

interface Props {
    space: SpaceData;
    config: EmbedConfigData;
    testimonials: TestimonialData[];
    embedUrl: string;
    embedSnippet: string;
}

export default function SpaceEmbedBuilder({ space, config, testimonials, embedUrl, embedSnippet }: Props) {
    const [copied, setCopied] = useState(false);
    const [embedType, setEmbedType] = useState<'iframe' | 'script'>('iframe');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Spaces', href: '/spaces' },
        { title: space.name, href: `/spaces/${space.id}` },
        { title: 'Embed Builder', href: `/spaces/${space.id}/embed` },
    ];

    const { resolvedAppearance } = useAppearance();
    const isInterfaceDark = resolvedAppearance === 'dark';

    // Default to transparent so the embed blends with the host/interface background
    const defaultBgColor = (!config.background_color || config.background_color === '#ffffff') && isInterfaceDark
        ? 'transparent'
        : (config.background_color ?? 'transparent');

    const defaultDarkMode = config.dark_mode !== undefined ? config.dark_mode : isInterfaceDark;

    const { data, setData, put, processing, errors } = useForm({
        layout: config.layout ?? 'masonry',
        dark_mode: defaultDarkMode,
        animation_enabled: config.animation_enabled ?? true,
        background_color: defaultBgColor,
        item_limit: config.item_limit ?? 20,
        display_options: {
            show_rating: config.display_options?.show_rating ?? true,
            show_profile_photo: config.display_options?.show_profile_photo ?? true,
            show_company_name: config.display_options?.show_company_name ?? true,
            min_rating: config.display_options?.min_rating ?? 0,
            card_radius: config.display_options?.card_radius ?? 'rounded-2xl',
            card_shadow: config.display_options?.card_shadow ?? 'shadow-xs',
        },
    });

    const scriptSnippet = `<div id="testimonials-wall" data-space="${space.public_id}"></div>\n<script src="${window.location?.origin || ''}/embed.js" async></script>`;
    const currentCode = embedType === 'iframe' ? embedSnippet : scriptSnippet;

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(currentCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // fallback
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/spaces/${space.id}/embed`, {
            preserveScroll: true,
        });
    };

    const filteredPreviewTestimonials = testimonials
        .filter((t) => {
            const min = data.display_options.min_rating ?? 0;
            if (min <= 0) return true;
            return (t.rating ?? 0) >= min;
        })
        .slice(0, data.item_limit);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Embed Builder — ${space.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/spaces/${space.id}`}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight">Wall of Love Embed Builder</h1>
                                <Badge variant="secondary" className="text-xs">
                                    Live Studio
                                </Badge>
                            </div>
                            <p className="text-muted-foreground mt-0.5 text-sm">
                                Customize and embed testimonials from <span className="font-medium text-foreground">{space.name}</span> on any website.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <a href={embedUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                                Open Standalone Wall
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Controls Sidebar (Left 4 cols) */}
                    <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                        <Card>
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2">
                                    <Sliders className="h-4 w-4 text-primary" />
                                    <CardTitle className="text-base">Widget Configuration</CardTitle>
                                </div>
                                <CardDescription className="text-xs">
                                    Real-time customization options. Save to apply changes to external embeds.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Layout Presets */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold">Layout Format</Label>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            <button
                                                type="button"
                                                onClick={() => setData('layout', 'masonry')}
                                                className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all ${
                                                    data.layout === 'masonry'
                                                        ? 'border-primary bg-primary/5 text-primary font-semibold ring-2 ring-primary/20'
                                                        : 'border-border hover:bg-muted/50 text-muted-foreground'
                                                }`}
                                            >
                                                <Grid2X2 className="h-5 w-5" />
                                                <span className="text-xs">Responsive Grid</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setData('layout', 'carousel')}
                                                className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all ${
                                                    data.layout === 'carousel'
                                                        ? 'border-primary bg-primary/5 text-primary font-semibold ring-2 ring-primary/20'
                                                        : 'border-border hover:bg-muted/50 text-muted-foreground'
                                                }`}
                                            >
                                                <LayoutList className="h-5 w-5" />
                                                <span className="text-xs">Carousel Slider</span>
                                            </button>
                                        </div>
                                        <InputError message={errors.layout} />
                                    </div>

                                    {/* Theme Mode Toggle */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold">Theme Mode</Label>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData((prev) => ({
                                                        ...prev,
                                                        dark_mode: false,
                                                        background_color:
                                                            prev.background_color === '#09090b'
                                                                ? 'transparent'
                                                                : prev.background_color,
                                                    }))
                                                }
                                                className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs transition-all ${
                                                    !data.dark_mode
                                                        ? 'border-primary bg-primary/5 text-primary font-semibold'
                                                        : 'border-border hover:bg-muted/50 text-muted-foreground'
                                                }`}
                                            >
                                                <Sun className="h-4 w-4" /> Light Mode
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData((prev) => ({
                                                        ...prev,
                                                        dark_mode: true,
                                                        background_color:
                                                            prev.background_color === '#ffffff'
                                                                ? 'transparent'
                                                                : prev.background_color,
                                                    }))
                                                }
                                                className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs transition-all ${
                                                    data.dark_mode
                                                        ? 'border-primary bg-primary/5 text-primary font-semibold'
                                                        : 'border-border hover:bg-muted/50 text-muted-foreground'
                                                }`}
                                            >
                                                <Moon className="h-4 w-4" /> Dark Mode
                                            </button>
                                        </div>
                                    </div>

                                    {/* Background Color Hex */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="background_color" className="text-xs font-semibold">
                                                Background Color
                                            </Label>
                                            <span className="text-[10px] text-muted-foreground">Hex or transparent</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-8 w-8 rounded-lg border shrink-0 shadow-2xs"
                                                style={{ backgroundColor: data.background_color || 'transparent' }}
                                            />
                                            <Input
                                                id="background_color"
                                                type="text"
                                                value={data.background_color}
                                                onChange={(e) => setData('background_color', e.target.value)}
                                                placeholder="transparent or #09090b"
                                                className="h-9 text-xs font-mono"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {[
                                                { label: 'Interface Default', value: 'transparent' },
                                                { label: 'Dark (#09090b)', value: '#09090b' },
                                                { label: 'Light (#ffffff)', value: '#ffffff' },
                                                { label: 'Slate (#f8fafc)', value: '#f8fafc' },
                                            ].map((preset) => (
                                                <button
                                                    key={preset.value}
                                                    type="button"
                                                    onClick={() => setData('background_color', preset.value)}
                                                    className={cn(
                                                        'text-[10px] px-2.5 py-1 rounded-md border transition-colors',
                                                        data.background_color === preset.value
                                                            ? 'border-primary bg-primary/10 text-primary font-medium'
                                                            : 'border-border/70 hover:bg-muted/60 text-muted-foreground',
                                                    )}
                                                >
                                                    {preset.label}
                                                </button>
                                            ))}
                                        </div>
                                        <InputError message={errors.background_color} />
                                    </div>

                                    {/* Item Limit Slider / Number */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <Label htmlFor="item_limit" className="font-semibold">
                                                Display Limit
                                            </Label>
                                            <span className="font-mono text-primary font-bold">
                                                {data.item_limit} items
                                            </span>
                                        </div>
                                        <input
                                            id="item_limit"
                                            type="range"
                                            min="1"
                                            max="50"
                                            value={data.item_limit}
                                            onChange={(e) => setData('item_limit', parseInt(e.target.value, 10))}
                                            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                        <InputError message={errors.item_limit} />
                                    </div>

                                    {/* Display Toggles */}
                                    <div className="space-y-2.5 pt-1 border-t border-border/60">
                                        <Label className="text-xs font-semibold block pt-2">Display Elements</Label>

                                        {space.rating_enabled && (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="show_rating"
                                                    checked={data.display_options.show_rating}
                                                    onCheckedChange={(checked) =>
                                                        setData('display_options', {
                                                            ...data.display_options,
                                                            show_rating: checked === true,
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="show_rating" className="text-xs cursor-pointer">
                                                    Show star rating
                                                </Label>
                                            </div>
                                        )}

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="show_profile_photo"
                                                checked={data.display_options.show_profile_photo}
                                                onCheckedChange={(checked) =>
                                                    setData('display_options', {
                                                        ...data.display_options,
                                                        show_profile_photo: checked === true,
                                                    })
                                                }
                                            />
                                            <Label htmlFor="show_profile_photo" className="text-xs cursor-pointer">
                                                Show avatar / profile photo
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="show_company_name"
                                                checked={data.display_options.show_company_name}
                                                onCheckedChange={(checked) =>
                                                    setData('display_options', {
                                                        ...data.display_options,
                                                        show_company_name: checked === true,
                                                    })
                                                }
                                            />
                                            <Label htmlFor="show_company_name" className="text-xs cursor-pointer">
                                                Show company name / title
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="animation_enabled"
                                                checked={data.animation_enabled}
                                                onCheckedChange={(checked) => setData('animation_enabled', checked === true)}
                                            />
                                            <Label htmlFor="animation_enabled" className="text-xs cursor-pointer">
                                                Enable hover animations
                                            </Label>
                                        </div>
                                    </div>

                                    {/* Minimum Star Rating Filter */}
                                    {space.rating_enabled && (
                                        <div className="space-y-2 pt-2 border-t border-border/60">
                                            <div className="flex justify-between items-center text-xs">
                                                <Label className="font-semibold">Minimum Star Rating</Label>
                                                <span className="text-[11px] text-muted-foreground">Filter low reviews</span>
                                            </div>
                                            <div className="grid grid-cols-4 gap-1.5">
                                                {[
                                                    { label: 'All Reviews', value: 0 },
                                                    { label: '3+ ★', value: 3 },
                                                    { label: '4+ ★', value: 4 },
                                                    { label: '5 ★ Only', value: 5 },
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() =>
                                                            setData('display_options', {
                                                                ...data.display_options,
                                                                min_rating: opt.value,
                                                            })
                                                        }
                                                        className={cn(
                                                            'text-[11px] py-1.5 px-1.5 rounded-lg border font-medium transition-all text-center',
                                                            (data.display_options.min_rating ?? 0) === opt.value
                                                                ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                                                                : 'border-border/70 hover:bg-muted/50 text-muted-foreground'
                                                        )}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Card Corner Radius */}
                                    <div className="space-y-2 pt-2 border-t border-border/60">
                                        <div className="flex justify-between items-center text-xs">
                                            <Label className="font-semibold">Card Corner Radius</Label>
                                            <span className="text-[11px] text-muted-foreground">Border style</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-1.5">
                                            {[
                                                { label: 'Sharp', value: 'rounded-none' },
                                                { label: 'Classic', value: 'rounded-lg' },
                                                { label: 'Smooth', value: 'rounded-2xl' },
                                                { label: 'Pill', value: 'rounded-3xl' },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() =>
                                                        setData('display_options', {
                                                            ...data.display_options,
                                                            card_radius: opt.value,
                                                        })
                                                    }
                                                    className={cn(
                                                        'text-[11px] py-1.5 px-1.5 rounded-lg border font-medium transition-all text-center',
                                                        (data.display_options.card_radius ?? 'rounded-2xl') === opt.value
                                                            ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                                                            : 'border-border/70 hover:bg-muted/50 text-muted-foreground'
                                                    )}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Card Shadow Elevation */}
                                    <div className="space-y-2 pt-2 border-t border-border/60">
                                        <div className="flex justify-between items-center text-xs">
                                            <Label className="font-semibold">Elevation & Shadow</Label>
                                            <span className="text-[11px] text-muted-foreground">Depth style</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-1.5">
                                            {[
                                                { label: 'Flat', value: 'shadow-none' },
                                                { label: 'Subtle', value: 'shadow-xs' },
                                                { label: 'Elevated', value: 'shadow-md' },
                                                { label: 'Floating', value: 'shadow-xl' },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() =>
                                                        setData('display_options', {
                                                            ...data.display_options,
                                                            card_shadow: opt.value,
                                                        })
                                                    }
                                                    className={cn(
                                                        'text-[11px] py-1.5 px-1.5 rounded-lg border font-medium transition-all text-center',
                                                        (data.display_options.card_shadow ?? 'shadow-xs') === opt.value
                                                            ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                                                            : 'border-border/70 hover:bg-muted/50 text-muted-foreground'
                                                    )}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <Button type="submit" disabled={processing} className="w-full">
                                        {processing ? 'Saving...' : 'Save Embed Configuration'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Copy Code Snippet Box */}
                        <Card className="border-primary/20 bg-primary/5">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Code2 className="h-4 w-4 text-primary" />
                                        <CardTitle className="text-sm">Get Embed Code</CardTitle>
                                    </div>
                                    <div className="flex items-center gap-1 text-[11px]">
                                        <button
                                            type="button"
                                            onClick={() => setEmbedType('iframe')}
                                            className={`px-2 py-0.5 rounded font-medium ${
                                                embedType === 'iframe' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                                            }`}
                                        >
                                            iframe
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEmbedType('script')}
                                            className={`px-2 py-0.5 rounded font-medium ${
                                                embedType === 'script' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                                            }`}
                                        >
                                            Script
                                        </button>
                                    </div>
                                </div>
                                <CardDescription className="text-xs">
                                    Copy and paste this snippet into your HTML, WordPress, Webflow, or Shopify site.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="relative rounded-lg bg-zinc-950 p-3 font-mono text-[11px] text-zinc-200 overflow-x-auto border border-zinc-800">
                                    <code>{currentCode}</code>
                                </div>

                                <Button
                                    size="sm"
                                    variant={copied ? 'default' : 'secondary'}
                                    className="w-full text-xs"
                                    onClick={handleCopyCode}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
                                            Code Copied to Clipboard!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-1.5 h-3.5 w-3.5" />
                                            Copy Embed Snippet
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Live Preview Sandbox (Right 8 cols) */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4 text-primary" />
                                <h2 className="text-base font-semibold">Live Interactive Preview</h2>
                                <Badge variant="outline" className="text-xs">
                                    {data.layout === 'masonry' ? 'Grid' : 'Carousel'} · {data.dark_mode ? 'Dark' : 'Light'}
                                </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {filteredPreviewTestimonials.length} matching {filteredPreviewTestimonials.length === 1 ? 'testimonial' : 'testimonials'}
                            </span>
                        </div>

                        {/* Interactive Sandbox Container */}
                        <div className="rounded-2xl border bg-card/60 dark:bg-zinc-950/80 p-2 sm:p-4 min-h-[500px] overflow-hidden shadow-inner">
                            <EmbedWall
                                space={{
                                    public_id: space.public_id,
                                    title: space.title,
                                    rating_enabled: space.rating_enabled,
                                }}
                                config={{
                                    layout: data.layout as 'masonry' | 'carousel',
                                    dark_mode: data.dark_mode,
                                    animation_enabled: data.animation_enabled,
                                    background_color: data.background_color,
                                    item_limit: data.item_limit,
                                    display_options: data.display_options,
                                }}
                                testimonials={filteredPreviewTestimonials}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
