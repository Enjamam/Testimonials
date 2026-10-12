import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    Check,
    CheckCircle2,
    CreditCard,
    ExternalLink,
    HelpCircle,
    RefreshCw,
    RotateCcw,
    Shield,
    Sparkles,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { BreadcrumbItem } from '@/types';

interface PlanDetails {
    id: string;
    name: string;
    price: string;
    price_cents: number;
    interval: string;
    description: string;
    max_spaces: number;
    max_testimonials: number;
    features: string[];
    highlighted: boolean;
}

interface SpaceUsage {
    current: number;
    max: number;
    remaining: number;
    can_create: boolean;
    is_pro: boolean;
}

interface BillingSummary {
    is_pro: boolean;
    current_plan: string;
    on_grace_period: boolean;
    ends_at: string | null;
    stripe_status: string;
    pm_type: string | null;
    pm_last_four: string | null;
    space_usage: SpaceUsage;
}

interface Props {
    plans: {
        free: PlanDetails;
        pro: PlanDetails;
    };
    summary: BillingSummary;
    status?: string | null;
    statusType?: 'success' | 'notice' | 'info' | null;
    errorMessage?: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Billing & Plans',
        href: '/billing',
    },
];

export default function BillingIndex({ plans, summary, status, statusType, errorMessage }: Props) {
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isOpeningPortal, setIsOpeningPortal] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const [isResuming, setIsResuming] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const spacePercent = Math.min(
        100,
        Math.round((summary.space_usage.current / Math.max(1, summary.space_usage.max)) * 100),
    );

    const handleSync = () => {
        setIsSyncing(true);
        router.post(
            '/billing/sync',
            {},
            {
                onFinish: () => setIsSyncing(false),
            },
        );
    };

    const handleCheckout = () => {
        setIsCheckingOut(true);
        router.post(
            '/billing/checkout',
            {},
            {
                onFinish: () => setIsCheckingOut(false),
            },
        );
    };

    const handleOpenPortal = () => {
        setIsOpeningPortal(true);
        window.location.href = '/billing/portal';
    };

    const handleCancel = () => {
        if (!confirm('Are you sure you want to cancel your subscription? You will continue to have Pro features until the end of your current billing period.')) {
            return;
        }

        setIsCanceling(true);
        router.post(
            '/billing/cancel',
            {},
            {
                onFinish: () => setIsCanceling(false),
            },
        );
    };

    const handleResume = () => {
        setIsResuming(true);
        router.post(
            '/billing/resume',
            {},
            {
                onFinish: () => setIsResuming(false),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing & Plans" />

            <div className="flex h-full flex-1 flex-col gap-8 p-4 md:p-6 max-w-6xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            Plans & Subscription
                        </h1>
                        {summary.is_pro ? (
                            <Badge className="bg-purple-600 hover:bg-purple-700 text-white gap-1 text-xs">
                                <Sparkles className="h-3 w-3" /> Pro Active
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="text-xs">
                                Free Tier
                            </Badge>
                        )}
                    </div>
                    <p className="text-muted-foreground text-sm max-w-2xl">
                        Simple, transparent pricing. Scale your social proof with more spaces and higher testimonial capacity.
                    </p>
                </div>

                {/* Notifications & Flash Status */}
                {status && (
                    statusType === 'notice' || statusType === 'info' ? (
                        <Alert className="border-sky-200 bg-sky-50/70 text-sky-950 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
                            <AlertCircle className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                            <AlertTitle className="font-medium">Checkout Canceled</AlertTitle>
                            <AlertDescription className="text-xs sm:text-sm mt-0.5">
                                {status}
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert className="border-emerald-200 bg-emerald-50/70 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <AlertTitle className="font-medium">Success</AlertTitle>
                            <AlertDescription className="text-xs sm:text-sm mt-0.5">
                                {status}
                            </AlertDescription>
                        </Alert>
                    )
                )}

                {errorMessage && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Notice</AlertTitle>
                        <AlertDescription className="text-xs sm:text-sm mt-0.5">
                            {errorMessage}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Grace Period Warning */}
                {summary.on_grace_period && (
                    <Alert className="border-amber-200 bg-amber-50/80 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                            <div>
                                <AlertTitle className="font-semibold text-sm">
                                    Subscription Canceled (Grace Period Active)
                                </AlertTitle>
                                <AlertDescription className="text-xs mt-0.5">
                                    Your Pro plan is set to expire on <strong className="font-semibold">{summary.ends_at}</strong>. You maintain full access to 25 spaces and 1,000 reviews until then.
                                </AlertDescription>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-amber-300 bg-white hover:bg-amber-100 text-amber-900 dark:bg-zinc-900 dark:text-amber-200 shrink-0"
                                onClick={handleResume}
                                disabled={isResuming}
                            >
                                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                                {isResuming ? 'Resuming...' : 'Resume Subscription'}
                            </Button>
                        </div>
                    </Alert>
                )}

                {/* Current Subscription & Usage Summary Card */}
                <Card className="border-zinc-200 dark:border-zinc-800 bg-card/60 backdrop-blur-xs">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    Current Plan & Usage Overview
                                </CardTitle>
                                <CardDescription className="text-xs mt-0.5">
                                    Active allocations and automated limits enforced on your account.
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleSync}
                                    disabled={isSyncing}
                                    title="Synchronize subscription status directly from Stripe"
                                    className="text-xs"
                                >
                                    <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                                    {isSyncing ? 'Syncing...' : 'Sync Plan'}
                                </Button>
                                {summary.is_pro && !summary.on_grace_period && (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleOpenPortal}
                                            disabled={isOpeningPortal}
                                        >
                                            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                                            {isOpeningPortal ? 'Opening Portal...' : 'Manage via Stripe Portal'}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-muted-foreground hover:text-destructive text-xs"
                                            onClick={handleCancel}
                                            disabled={isCanceling}
                                        >
                                            {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
                                        </Button>
                                    </>
                                )}
                                {!summary.is_pro && (
                                    <Button
                                        size="sm"
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
                                        onClick={handleCheckout}
                                        disabled={isCheckingOut}
                                    >
                                        <Zap className="h-3.5 w-3.5 fill-white" />
                                        {isCheckingOut ? 'Redirecting to Stripe...' : 'Upgrade to Pro'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-0">
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Space Capacity */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground font-medium">Space Capacity</span>
                                    <span className="font-semibold">
                                        {summary.space_usage.current} of {summary.space_usage.max} spaces
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                    <div
                                        className="h-full bg-primary transition-all duration-300"
                                        style={{ width: `${spacePercent}%` }}
                                    />
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                    {summary.space_usage.remaining > 0
                                        ? `${summary.space_usage.remaining} space slots available`
                                        : 'Plan limit reached. Upgrade to add more.'}
                                </p>
                            </div>

                            {/* Testimonials Per Space */}
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground font-medium block">
                                    Capacity Per Space
                                </span>
                                <div className="text-lg font-bold">
                                    {summary.is_pro ? '1,000' : '100'} <span className="text-xs font-normal text-muted-foreground">testimonials/space</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                    Enforced server-side with spam protection.
                                </p>
                            </div>

                            {/* Payment Method / Cycle */}
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground font-medium block">
                                    Billing Cycle & Payment
                                </span>
                                <div className="text-sm font-semibold flex items-center gap-1.5">
                                    {summary.is_pro ? (
                                        <>
                                            <span className="capitalize">{summary.pm_type ?? 'Card'}</span>
                                            {summary.pm_last_four && (
                                                <span className="text-muted-foreground font-mono text-xs">
                                                    ending in •••• {summary.pm_last_four}
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-muted-foreground">No payment method required</span>
                                    )}
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                    {summary.is_pro
                                        ? summary.on_grace_period
                                            ? `Ends on ${summary.ends_at}`
                                            : 'Renews monthly at $9.99/mo'
                                        : 'Free tier with zero expiration'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Plan Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                    {/* Free Plan Card */}
                    <Card
                        className={`flex flex-col justify-between border-zinc-200 dark:border-zinc-800 ${
                            !summary.is_pro ? 'ring-2 ring-zinc-400 dark:ring-zinc-600' : ''
                        }`}
                    >
                        <CardHeader className="space-y-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-bold">{plans.free.name}</CardTitle>
                                {!summary.is_pro && (
                                    <Badge variant="outline" className="text-xs">
                                        Your Active Plan
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="text-xs leading-relaxed min-h-[36px]">
                                {plans.free.description}
                            </CardDescription>
                            <div className="pt-2">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-extrabold">{plans.free.price}</span>
                                    <span className="text-xs text-muted-foreground">/{plans.free.interval}</span>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-1">
                            <Separator />
                            <div className="space-y-2.5">
                                <div className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                                    Plan includes:
                                </div>
                                <ul className="space-y-2.5 text-xs text-foreground/90">
                                    {plans.free.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5">
                                            <div className="rounded-full bg-zinc-100 p-0.5 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 shrink-0 mt-0.5">
                                                <Check className="h-3 w-3" />
                                            </div>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>

                        <CardFooter className="pt-4">
                            <Button
                                variant="outline"
                                className="w-full text-xs"
                                disabled={!summary.is_pro}
                            >
                                {!summary.is_pro ? 'Active Tier' : 'Downgrade via Portal'}
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Pro Plan Card */}
                    <Card
                        className={`flex flex-col justify-between relative overflow-hidden border-indigo-200 dark:border-indigo-900 ${
                            summary.is_pro
                                ? 'ring-2 ring-purple-500 dark:ring-purple-600 shadow-md'
                                : 'ring-2 ring-indigo-500/80 shadow-lg'
                        }`}
                    >
                        {/* Gradient Header Banner */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                        <CardHeader className="space-y-2 pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-xl font-bold flex items-center gap-1.5 text-indigo-950 dark:text-indigo-100">
                                        <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                        {plans.pro.name}
                                    </CardTitle>
                                    <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] uppercase font-semibold tracking-wider">
                                        Recommended
                                    </Badge>
                                </div>
                                {summary.is_pro && (
                                    <Badge className="bg-emerald-600 text-white text-xs">
                                        Your Active Plan
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="text-xs leading-relaxed min-h-[36px]">
                                {plans.pro.description}
                            </CardDescription>
                            <div className="pt-2">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-extrabold text-foreground">{plans.pro.price}</span>
                                    <span className="text-xs text-muted-foreground">/{plans.pro.interval}</span>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-1">
                            <Separator />
                            <div className="space-y-2.5">
                                <div className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                                    Everything in Free, plus:
                                </div>
                                <ul className="space-y-2.5 text-xs text-foreground/90">
                                    {plans.pro.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5">
                                            <div className="rounded-full bg-primary/10 p-0.5 text-primary shrink-0 mt-0.5">
                                                <Check className="h-3 w-3 stroke-[2.5]" />
                                            </div>
                                            <span className="font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>

                        <CardFooter className="pt-4">
                            {summary.is_pro ? (
                                <Button
                                    variant="outline"
                                    className="w-full text-xs border-border hover:bg-muted/50"
                                    onClick={handleOpenPortal}
                                    disabled={isOpeningPortal}
                                >
                                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                                    {isOpeningPortal ? 'Opening Portal...' : 'Manage Billing in Stripe'}
                                </Button>
                            ) : (
                                <Button
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md text-xs font-semibold gap-1.5"
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                >
                                    <Zap className="h-3.5 w-3.5 fill-current" />
                                    {isCheckingOut ? 'Connecting to Stripe...' : 'Upgrade to Pro Now'}
                                    <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>

                {/* Trust & FAQ Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div className="flex items-start gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-muted/20">
                        <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <h4 className="text-xs font-semibold">Cancel Anytime</h4>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                No contracts or hidden fees. If you cancel, your Pro features remain active until your billing period ends.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-muted/20">
                        <CreditCard className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <h4 className="text-xs font-semibold">Bank-Grade Security</h4>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Billing is processed directly through Stripe with 256-bit SSL encryption. We never touch or store card numbers.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-muted/20">
                        <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <h4 className="text-xs font-semibold">Data Retention Guarantee</h4>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Changing plans never purges your testimonials or deletes existing spaces. Your social proof remains safe.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
