import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    ChevronRight,
    ExternalLink,
    FolderPlus,
    Heart,
    Inbox,
    MessageSquare,
    Plus,
    Sparkles,
    TrendingUp,
    Users,
    X,
    Zap,
} from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface SpaceItem {
    id: number;
    name: string;
    title: string;
    slug: string;
    public_id: string;
    theme: string;
    rating_enabled: boolean;
    testimonials_count: number;
    wall_of_love_count: number;
    created_at: string;
}

interface TimelinePoint {
    date: string;
    label: string;
    count: number;
}

interface UsageData {
    current: number;
    max: number;
    remaining: number;
    can_create: boolean;
    is_pro: boolean;
}

interface DashboardProps {
    metrics: {
        total_spaces: number;
        total_testimonials: number;
        unique_respondents: number;
        wall_of_love_count: number;
        period_testimonials: number;
    };
    period: number;
    timeline: TimelinePoint[];
    usage: UsageData;
    spaces: SpaceItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ metrics, period, timeline, usage, spaces }: DashboardProps) {
    const [isUpgradeBannerDismissed, setIsUpgradeBannerDismissed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('dismissed_upgrade_banner') === 'true';
        }
        return false;
    });

    const [hoveredPoint, setHoveredPoint] = useState<TimelinePoint | null>(null);

    const handleDismissBanner = () => {
        setIsUpgradeBannerDismissed(true);
        localStorage.setItem('dismissed_upgrade_banner', 'true');
    };

    const handlePeriodChange = (newPeriod: number) => {
        router.get(
            '/dashboard',
            { period: newPeriod },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const maxCount = Math.max(1, ...timeline.map((t) => t.count));
    const usagePercentage = Math.min(100, Math.round((usage.current / usage.max) * 100));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">Analytics & Overview</h1>
                            {usage.is_pro ? (
                                <Badge className="bg-purple-600 hover:bg-purple-700 text-white gap-1 text-xs">
                                    <Sparkles className="h-3 w-3" /> Pro Plan
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="text-xs">
                                    Free Plan
                                </Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground mt-0.5 text-sm">
                            Real-time metrics, collection velocity, and space performance.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button size="sm" asChild>
                            <Link href="/spaces/create">
                                <Plus className="mr-1.5 h-4 w-4" />
                                Create Space
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Free Plan Upgrade Banner (Dismissible) */}
                {!usage.is_pro && !isUpgradeBannerDismissed && (
                    <Card className="relative overflow-hidden border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-pink-50/80 dark:border-indigo-900/60 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-zinc-900">
                        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3.5 pr-8">
                                <div className="rounded-lg bg-indigo-600 p-2 text-white shrink-0 mt-0.5">
                                    <Zap className="h-4 w-4 fill-white" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-semibold text-foreground">
                                            Supercharge your social proof with Pro
                                        </h3>
                                        <Badge variant="outline" className="border-indigo-300 bg-indigo-100/60 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-[10px]">
                                            $9.99 / mo
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Expand from 3 to <strong className="text-foreground">25 spaces</strong> and from 100 to <strong className="text-foreground">1,000 testimonials</strong> per space.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs" asChild>
                                    <Link href="/billing">
                                        Upgrade Now
                                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>

                        <button
                            type="button"
                            onClick={handleDismissBanner}
                            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-1 rounded-md"
                            aria-label="Dismiss upgrade banner"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </Card>
                )}

                {/* Key Metrics Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Spaces Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Spaces Created</CardTitle>
                            <FolderPlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.total_spaces}</div>
                            <p className="text-muted-foreground text-xs mt-1">
                                {usage.current} of {usage.max} allowed spaces used
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Testimonials */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Testimonials</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.total_testimonials}</div>
                            <p className="text-muted-foreground text-xs mt-1">
                                Across all active spaces
                            </p>
                        </CardContent>
                    </Card>

                    {/* Unique Respondents */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Unique Respondents</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.unique_respondents}</div>
                            <p className="text-muted-foreground text-xs mt-1">
                                Verified individual contributors
                            </p>
                        </CardContent>
                    </Card>

                    {/* Wall of Love Published */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Wall of Love</CardTitle>
                            <Heart className="h-4 w-4 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.wall_of_love_count}</div>
                            <p className="text-muted-foreground text-xs mt-1">
                                Consented public reviews published
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Submissions Velocity Timeline Chart Card */}
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-base font-semibold">Testimonial Collection Timeline</CardTitle>
                                <Badge variant="secondary" className="text-xs gap-1">
                                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                                    {metrics.period_testimonials} collected in period
                                </Badge>
                            </div>
                            <CardDescription>
                                Daily customer submission volume across all active spaces.
                            </CardDescription>
                        </div>

                        {/* Period Filter Buttons */}
                        <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1 self-start sm:self-auto">
                            {[7, 30, 90].map((days) => (
                                <Button
                                    key={days}
                                    variant={period === days ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => handlePeriodChange(days)}
                                    className="h-7 px-2.5 text-xs font-medium"
                                >
                                    {days}d
                                </Button>
                            ))}
                        </div>
                    </CardHeader>

                    <CardContent className="pt-2 pb-6">
                        {/* Hover Tooltip Info */}
                        <div className="h-6 mb-2 flex items-center text-xs">
                            {hoveredPoint ? (
                                <span className="font-medium text-foreground flex items-center gap-1.5 animate-in fade-in duration-150">
                                    <Calendar className="h-3.5 w-3.5 text-primary" />
                                    {hoveredPoint.label}: <strong className="text-primary">{hoveredPoint.count}</strong> {hoveredPoint.count === 1 ? 'testimonial' : 'testimonials'}
                                </span>
                            ) : (
                                <span className="text-muted-foreground">
                                    Hover over any date to inspect daily collection volume.
                                </span>
                            )}
                        </div>

                        {/* Interactive Responsive SVG / HTML Bar Chart */}
                        <div className="h-44 w-full flex items-end gap-1 sm:gap-1.5 pt-4 border-b border-border/80">
                            {timeline.map((item, idx) => {
                                const heightPercent = Math.max(8, Math.round((item.count / maxCount) * 100));
                                const isHovered = hoveredPoint?.date === item.date;

                                return (
                                    <div
                                        key={item.date}
                                        className="relative flex-1 h-full flex items-end justify-center group cursor-pointer"
                                        onMouseEnter={() => setHoveredPoint(item)}
                                        onMouseLeave={() => setHoveredPoint(null)}
                                    >
                                        <div
                                            style={{ height: `${heightPercent}%` }}
                                            className={`w-full max-w-[24px] rounded-t-sm transition-all duration-200 ${
                                                item.count > 0
                                                    ? isHovered
                                                        ? 'bg-indigo-600 dark:bg-indigo-400 scale-y-105'
                                                        : 'bg-primary/80 group-hover:bg-primary'
                                                    : 'bg-muted/50 group-hover:bg-muted'
                                            }`}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Timeline Date Labels */}
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-2 px-1">
                            <span>{timeline[0]?.label}</span>
                            {timeline.length > 14 && (
                                <span>{timeline[Math.floor(timeline.length / 2)]?.label}</span>
                            )}
                            <span>{timeline[timeline.length - 1]?.label}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Spaces List & Capacity Section */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Spaces Directory */}
                    <div className="lg:col-span-2 space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold">Your Spaces</h2>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/spaces" className="text-xs">
                                    View All Spaces <ChevronRight className="ml-1 h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </div>

                        {spaces.length === 0 ? (
                            <Card className="border-dashed p-8 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                                    <FolderPlus className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-base">No spaces yet</h3>
                                <p className="text-muted-foreground text-xs mt-1 mb-4">
                                    Create your first Space to start gathering customer testimonials.
                                </p>
                                <Button size="sm" asChild>
                                    <Link href="/spaces/create">
                                        <Plus className="mr-1.5 h-4 w-4" />
                                        Create First Space
                                    </Link>
                                </Button>
                            </Card>
                        ) : (
                            <div className="space-y-2.5">
                                {spaces.map((space) => (
                                    <Card key={space.id} className="hover:border-primary/40 transition-colors">
                                        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/spaces/${space.id}`}
                                                        className="font-semibold text-sm hover:underline"
                                                    >
                                                        {space.name}
                                                    </Link>
                                                    <Badge variant="outline" className="text-[10px] capitalize">
                                                        {space.theme.replace('-', ' ')}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                    {space.title}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3 self-end sm:self-auto">
                                                <div className="text-right text-xs">
                                                    <span className="font-bold text-foreground">
                                                        {space.testimonials_count}
                                                    </span>{' '}
                                                    <span className="text-muted-foreground">reviews</span>
                                                    {space.wall_of_love_count > 0 && (
                                                        <span className="text-rose-500 font-medium ml-1.5">
                                                            · {space.wall_of_love_count} public
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    <Button variant="outline" size="sm" asChild className="h-8 text-xs">
                                                        <Link href={`/spaces/${space.id}/inbox`}>
                                                            <Inbox className="mr-1 h-3.5 w-3.5" />
                                                            Inbox
                                                        </Link>
                                                    </Button>

                                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8" title="Public Page">
                                                        <a href={`/s/${space.public_id}`} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="h-3.5 w-3.5" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Plan & Usage Summary Card */}
                    <div className="space-y-3">
                        <h2 className="text-base font-semibold">Plan & Capacity</h2>
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">Space Allocation</CardTitle>
                                    <Badge variant={usage.can_create ? 'secondary' : 'destructive'} className="text-[10px]">
                                        {usage.can_create ? 'Capacity Available' : 'Limit Reached'}
                                    </Badge>
                                </div>
                                <CardDescription className="text-xs">
                                    Current usage on the {usage.is_pro ? 'Pro Tier' : 'Free Tier'}.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Spaces Used</span>
                                        <span className="font-bold text-foreground">
                                            {usage.current} / {usage.max}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                                        <div
                                            style={{ width: `${usagePercentage}%` }}
                                            className={`h-full transition-all duration-300 ${
                                                usagePercentage >= 100
                                                    ? 'bg-rose-500'
                                                    : usagePercentage >= 66
                                                    ? 'bg-amber-500'
                                                    : 'bg-primary'
                                            }`}
                                        />
                                    </div>
                                </div>

                                <div className="rounded-lg border bg-muted/30 p-3 space-y-2 text-xs">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Max Testimonials / Space</span>
                                        <span className="font-semibold text-foreground">
                                            {usage.is_pro ? '1,000' : '100'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Wall of Love Embeds</span>
                                        <span className="font-semibold text-foreground">Unlimited</span>
                                    </div>
                                </div>

                                {!usage.is_pro && (
                                    <Button variant="outline" className="w-full text-xs" asChild>
                                        <Link href="/spaces">
                                            <Zap className="mr-1.5 h-3.5 w-3.5 text-indigo-500" />
                                            Upgrade to Pro ($9.99/mo)
                                        </Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
