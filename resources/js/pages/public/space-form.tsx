import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Camera,
    Check,
    CheckCircle2,
    Copy,
    Heart,
    Lock,
    PartyPopper,
    Sparkles,
    Star,
    UploadCloud,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FieldConfig {
    enabled: boolean;
    required: boolean;
}

interface SpaceData {
    public_id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    ask: string | null;
    theme: 'minimal-light' | 'minimal-dark' | 'soft-color';
    rating_enabled: boolean;
    field_configuration: {
        name: FieldConfig;
        email: FieldConfig;
        company_name?: FieldConfig;
        social_url?: FieldConfig;
        profile_photo?: FieldConfig;
    };
}

interface PageProps {
    space: SpaceData;
    can_accept_testimonials: boolean;
    flash?: {
        success?: string;
        error?: string;
    };
}

const RATING_DESCRIPTIONS: Record<number, string> = {
    1: 'Needs improvement',
    2: 'Fair experience',
    3: 'Good & helpful',
    4: 'Great experience!',
    5: 'Exceptional — loved it!',
};

export default function SpaceForm({ space, can_accept_testimonials }: PageProps) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
    const [showCelebrationModal, setShowCelebrationModal] = useState<boolean>(false);
    const [photoError, setPhotoError] = useState<string | null>(null);
    const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false);
    const [submittedSummary, setSubmittedSummary] = useState<{
        name: string;
        company_name?: string;
        rating: number | null;
        testimonial: string;
        previewUrl?: string | null;
    } | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<{
        name: string;
        email: string;
        company_name: string;
        social_url: string;
        profile_photo: File | null;
        rating: number | null;
        testimonial: string;
        consent_given: boolean;
        website_hp: string;
    }>({
        name: '',
        email: '',
        company_name: '',
        social_url: '',
        profile_photo: null,
        rating: space.rating_enabled ? 5 : null,
        testimonial: '',
        consent_given: false,
        website_hp: '',
    });

    const isCompanyEnabled = space.field_configuration.company_name?.enabled ?? false;
    const isCompanyRequired = space.field_configuration.company_name?.required ?? false;

    const isSocialEnabled = space.field_configuration.social_url?.enabled ?? false;
    const isSocialRequired = space.field_configuration.social_url?.required ?? false;

    const isPhotoEnabled = space.field_configuration.profile_photo?.enabled ?? false;
    const isPhotoRequired = space.field_configuration.profile_photo?.required ?? false;

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setPhotoError(`The selected file is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). The profile photo must be less than 2MB.`);
                e.target.value = '';
                setData('profile_photo', null);
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                }
                return;
            }
            setPhotoError(null);
            setData('profile_photo', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemovePhoto = () => {
        setData('profile_photo', null);
        setPhotoError(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const handleResetForAnother = () => {
        setShowCelebrationModal(false);
        setHasSubmitted(false);
        setSubmittedSummary(null);
        setPhotoError(null);
        clearErrors();
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        reset();
    };

    const handleCopyShareLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopiedShareLink(true);
            setTimeout(() => setCopiedShareLink(false), 2500);
        } catch {
            // fallback
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.consent_given) {
            return;
        }

        const summary = {
            name: data.name,
            company_name: data.company_name,
            rating: data.rating,
            testimonial: data.testimonial,
            previewUrl: previewUrl,
        };

        post(`/s/${space.public_id}/testimonials`, {
            forceFormData: true,
            onSuccess: () => {
                setSubmittedSummary(summary);
                setShowCelebrationModal(true);
                setHasSubmitted(true);
                reset();
                setPhotoError(null);
            },
        });
    };

    // Synchronize HTML dark mode class with space theme so external dark-mode styles don't conflict
    React.useEffect(() => {
        const root = document.documentElement;
        const initialDark = root.classList.contains('dark');

        if (space.theme === 'minimal-dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        return () => {
            // Restore appearance mode on unmount
            const stored = localStorage.getItem('appearance');
            if (stored === 'dark' || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) || (!stored && initialDark)) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };
    }, [space.theme]);

    // Theme classes configuration with explicit high-contrast styles
    const themeStyles = {
        'minimal-light': {
            wrapper: 'bg-slate-50 text-slate-900',
            card: 'bg-white border-slate-200/90 shadow-sm text-slate-900',
            heading: 'text-slate-900',
            label: 'text-slate-900 font-semibold',
            input: 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-600 focus-visible:ring-indigo-500/20 shadow-xs',
            accent: 'text-indigo-600',
            button: 'bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm active:scale-[0.99]',
            askBanner: 'bg-indigo-50/80 border-indigo-100 text-indigo-950',
            askBannerTitle: 'text-indigo-900',
            muted: 'text-slate-600',
            consentBox: 'bg-slate-50 border-slate-200 text-slate-900',
            consentLabel: 'text-slate-900 font-medium',
            consentDesc: 'text-slate-600',
            checkbox: 'border-slate-400 data-[state=checked]:bg-slate-900 data-[state=checked]:text-white data-[state=checked]:border-slate-900',
            starActive: 'fill-amber-400 text-amber-400',
            starInactive: 'text-slate-300 hover:text-amber-300',
            ratingDesc: 'text-slate-700 font-medium',
            photoCard: 'border-slate-300 hover:border-slate-400 bg-slate-50/60 text-slate-700',
        },
        'minimal-dark': {
            wrapper: 'bg-zinc-950 text-zinc-100',
            card: 'bg-zinc-900 border-zinc-800 shadow-xl text-zinc-100',
            heading: 'text-zinc-50',
            label: 'text-zinc-200 font-semibold',
            input: 'bg-zinc-800/90 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-indigo-400 focus-visible:ring-indigo-400/20 shadow-xs',
            accent: 'text-indigo-400',
            button: 'bg-white hover:bg-zinc-200 text-zinc-950 font-semibold shadow-sm active:scale-[0.99]',
            askBanner: 'bg-zinc-800/80 border-zinc-700 text-zinc-200',
            askBannerTitle: 'text-indigo-400',
            muted: 'text-zinc-400',
            consentBox: 'bg-zinc-800/60 border-zinc-700 text-zinc-200',
            consentLabel: 'text-zinc-100 font-medium',
            consentDesc: 'text-zinc-400',
            checkbox: 'border-zinc-500 data-[state=checked]:bg-white data-[state=checked]:text-zinc-950 data-[state=checked]:border-white',
            starActive: 'fill-amber-400 text-amber-400',
            starInactive: 'text-zinc-700 hover:text-amber-400',
            ratingDesc: 'text-zinc-300 font-medium',
            photoCard: 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/40 text-zinc-300',
        },
        'soft-color': {
            wrapper: 'bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-pink-50/60 text-slate-900',
            card: 'bg-white/95 backdrop-blur-md border-indigo-100/90 shadow-xl shadow-indigo-100/30 text-slate-900',
            heading: 'text-slate-900',
            label: 'text-slate-900 font-semibold',
            input: 'bg-white border-indigo-200 text-slate-900 placeholder:text-slate-400 focus-visible:border-purple-600 focus-visible:ring-purple-500/20 shadow-xs',
            accent: 'text-purple-600',
            button: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-md shadow-indigo-200 active:scale-[0.99]',
            askBanner: 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100 text-indigo-950',
            askBannerTitle: 'text-purple-900',
            muted: 'text-slate-600',
            consentBox: 'bg-indigo-50/50 border-indigo-100 text-slate-900',
            consentLabel: 'text-slate-900 font-medium',
            consentDesc: 'text-slate-600',
            checkbox: 'border-indigo-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white data-[state=checked]:border-indigo-600',
            starActive: 'fill-amber-400 text-amber-400',
            starInactive: 'text-slate-300 hover:text-amber-300',
            ratingDesc: 'text-slate-700 font-medium',
            photoCard: 'border-indigo-200 hover:border-indigo-300 bg-indigo-50/30 text-slate-700',
        },
    }[space.theme];

    // Celebratory Card subcomponent for both popup and standalone view
    const renderCelebrationView = (isModal: boolean) => (
        <div className={`relative overflow-hidden text-center ${isModal ? 'p-6 sm:p-8' : 'p-8 sm:p-12'}`}>
            {/* Confetti Particles Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <span className="absolute top-3 left-8 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping opacity-75" />
                <span className="absolute top-10 right-10 w-2 h-2 rounded-sm bg-indigo-500 animate-pulse opacity-80" />
                <span className="absolute top-16 left-1/4 w-3 h-1.5 rounded-full bg-rose-400 rotate-45 animate-bounce opacity-70" />
                <span className="absolute top-14 right-1/4 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-60" />
                <span className="absolute top-5 right-1/3 w-3 h-3 rounded-full bg-purple-400 opacity-60 animate-pulse" />
                <span className="absolute top-20 right-8 w-2 h-3 rounded-sm bg-sky-400 rotate-12 opacity-75" />
                <span className="absolute top-24 left-10 w-2 h-2 rounded-full bg-amber-300 opacity-70 animate-bounce" />
            </div>

            {/* Glowing Celebration Party Badge */}
            <div className="relative mx-auto w-20 h-20 mb-5 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 dark:bg-emerald-500/25 animate-ping" />
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-in zoom-in-75 duration-300">
                    <PartyPopper className="w-8 h-8 animate-bounce" />
                </div>
            </div>

            <Badge
                variant="outline"
                className="mb-3.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-xs px-3 py-1 font-semibold"
            >
                🎉 Submission Received
            </Badge>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Thank You{submittedSummary?.name ? `, ${submittedSummary.name}` : ''}!
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mt-2 leading-relaxed">
                {flash?.success ?? "Your kind words have officially made our day. Your testimonial has been submitted successfully!"}
            </p>

            {/* Submitted Testimonial Live Preview Card */}
            {submittedSummary && submittedSummary.testimonial && (
                <div className="mt-6 p-4 sm:p-5 rounded-2xl border bg-muted/40 text-left space-y-3 shadow-xs animate-in fade-in-50 duration-300">
                    <div className="flex items-center justify-between">
                        {submittedSummary.rating ? (
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-4 h-4 ${
                                            star <= (submittedSummary.rating ?? 5)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-muted-foreground/30'
                                        }`}
                                    />
                                ))}
                                <span className="text-xs font-semibold text-muted-foreground ml-1.5">
                                    {submittedSummary.rating}.0
                                </span>
                            </div>
                        ) : (
                            <span className="text-xs font-semibold text-muted-foreground">Testimonial</span>
                        )}
                        <Badge variant="secondary" className="text-[10px] font-medium">
                            Live Preview
                        </Badge>
                    </div>

                    <p className="text-sm italic leading-relaxed text-foreground/90">
                        "{submittedSummary.testimonial}"
                    </p>

                    <div className="flex items-center gap-2.5 pt-2 border-t border-border/60">
                        {submittedSummary.previewUrl ? (
                            <img
                                src={submittedSummary.previewUrl}
                                alt={submittedSummary.name}
                                className="w-8 h-8 rounded-full object-cover border"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                                {(submittedSummary.name || 'A').charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="min-w-0">
                            <div className="text-xs font-semibold text-foreground truncate">
                                {submittedSummary.name || 'Verified Contributor'}
                            </div>
                            {submittedSummary.company_name && (
                                <div className="text-[11px] text-muted-foreground truncate">
                                    {submittedSummary.company_name}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Interactive Actions */}
            <div className="mt-6 pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <Button
                    onClick={handleResetForAnother}
                    className="w-full sm:w-auto font-medium"
                >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Submit another testimonial
                </Button>

                <Button
                    variant="outline"
                    onClick={handleCopyShareLink}
                    className="w-full sm:w-auto"
                >
                    {copiedShareLink ? (
                        <>
                            <Check className="w-4 h-4 mr-2 text-emerald-500" />
                            Link Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4 mr-2" />
                            Share Space Link
                        </>
                    )}
                </Button>
            </div>
        </div>
    );

    // Standalone Thank You celebratory screen fallback (if direct navigation or page refresh)
    if ((hasSubmitted && !showCelebrationModal) || flash?.success) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors duration-200 ${themeStyles.wrapper}`}>
                <Head title={`Thank You — ${space.title}`} />
                <Card className={`max-w-xl w-full border ${themeStyles.card} shadow-xl`}>
                    {renderCelebrationView(false)}
                </Card>
            </div>
        );
    }

    // Capacity limit reached banner
    if (!can_accept_testimonials) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors duration-200 ${themeStyles.wrapper}`}>
                <Head title={space.title} />
                <Card className={`max-w-md w-full text-center p-8 ${themeStyles.card}`}>
                    <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold mb-2">{space.title}</h1>
                    <p className={`text-sm mb-4 ${themeStyles.muted}`}>
                        This space has reached its maximum testimonial collection limit and is currently not accepting new submissions.
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className={`min-h-screen py-10 sm:py-16 px-4 sm:px-6 transition-colors duration-200 ${themeStyles.wrapper}`}>
            <Head title={space.title} />

            <div className="max-w-2xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-10">
                    <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 ${themeStyles.heading}`}>
                        {space.title}
                    </h1>
                    {space.subtitle && (
                        <p className={`text-base sm:text-lg leading-relaxed max-w-xl mx-auto ${themeStyles.muted}`}>
                            {space.subtitle}
                        </p>
                    )}
                </div>

                {/* Optional Ask / Prompt Banner */}
                {space.ask && (
                    <div className={`mb-8 p-4 sm:p-5 rounded-xl border flex items-start gap-3.5 ${themeStyles.askBanner}`}>
                        <Sparkles className={`w-5 h-5 shrink-0 mt-0.5 ${themeStyles.accent}`} />
                        <div>
                            <span className={`text-xs font-semibold uppercase tracking-wider block mb-1 opacity-80 ${themeStyles.askBannerTitle}`}>
                                What we would love to know:
                            </span>
                            <p className="text-sm sm:text-base font-medium leading-relaxed">
                                {space.ask}
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Submission Form */}
                <Card className={`overflow-hidden border ${themeStyles.card}`}>
                    <CardContent className="p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Spam Honeypot (must stay empty) */}
                            <input
                                type="text"
                                name="website_hp"
                                value={data.website_hp}
                                onChange={(e) => setData('website_hp', e.target.value)}
                                style={{ display: 'none' }}
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                            />

                            {/* 1-5 Star Rating */}
                            {space.rating_enabled && (
                                <div className="space-y-2">
                                    <Label className={`text-sm font-semibold ${themeStyles.label}`}>
                                        Your Rating <span className="text-rose-500">*</span>
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const isActive = (hoverRating ?? data.rating ?? 0) >= star;
                                            return (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setData('rating', star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(null)}
                                                    className="p-1 rounded transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                                    aria-label={`Rate ${star} out of 5 stars`}
                                                >
                                                    <Star
                                                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                                                            isActive ? themeStyles.starActive : themeStyles.starInactive
                                                        }`}
                                                    />
                                                </button>
                                            );
                                        })}
                                        {(hoverRating ?? data.rating) && (
                                            <span className={`text-xs sm:text-sm font-medium ml-2 ${themeStyles.ratingDesc}`}>
                                                {RATING_DESCRIPTIONS[hoverRating ?? data.rating ?? 5]}
                                            </span>
                                        )}
                                    </div>
                                    <InputError message={errors.rating} />
                                </div>
                            )}

                            {/* Testimonial Textarea */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="testimonial" className={`text-sm font-semibold ${themeStyles.label}`}>
                                        Your Testimonial <span className="text-rose-500">*</span>
                                    </Label>
                                    <span className={`text-xs ${themeStyles.muted}`}>
                                        {data.testimonial.length} / 5000
                                    </span>
                                </div>
                                <Textarea
                                    id="testimonial"
                                    value={data.testimonial}
                                    onChange={(e) => setData('testimonial', e.target.value)}
                                    placeholder="Write your review here. What problems did this solve for you? What was your overall experience?"
                                    className={`min-h-[140px] text-base leading-relaxed ${themeStyles.input}`}
                                    maxLength={5000}
                                    required
                                />
                                <InputError message={errors.testimonial} />
                            </div>

                            {/* Respondent Profile Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Name */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className={`text-sm font-semibold ${themeStyles.label}`}>
                                        Your Name <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Jane Doe"
                                        className={themeStyles.input}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* Email */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="email" className={`text-sm font-semibold ${themeStyles.label}`}>
                                            Your Email <span className="text-rose-500">*</span>
                                        </Label>
                                        <span className={`text-[11px] flex items-center gap-1 ${themeStyles.muted}`}>
                                            <Lock className="w-3 h-3" /> Private
                                        </span>
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="jane@example.com"
                                        className={themeStyles.input}
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* Optional Company Name */}
                                {isCompanyEnabled && (
                                    <div className="space-y-1.5">
                                        <Label htmlFor="company_name" className={`text-sm font-semibold ${themeStyles.label}`}>
                                            Company / Title {isCompanyRequired && <span className="text-rose-500">*</span>}
                                        </Label>
                                        <Input
                                            id="company_name"
                                            type="text"
                                            value={data.company_name}
                                            onChange={(e) => setData('company_name', e.target.value)}
                                            placeholder="Acme Inc. / Founder"
                                            className={themeStyles.input}
                                            required={isCompanyRequired}
                                        />
                                        <InputError message={errors.company_name} />
                                    </div>
                                )}

                                {/* Optional Social URL */}
                                {isSocialEnabled && (
                                    <div className="space-y-1.5">
                                        <Label htmlFor="social_url" className={`text-sm font-semibold ${themeStyles.label}`}>
                                            Social Profile URL {isSocialRequired && <span className="text-rose-500">*</span>}
                                        </Label>
                                        <Input
                                            id="social_url"
                                            type="url"
                                            value={data.social_url}
                                            onChange={(e) => setData('social_url', e.target.value)}
                                            placeholder="https://x.com/janedoe or LinkedIn"
                                            className={themeStyles.input}
                                            required={isSocialRequired}
                                        />
                                        <InputError message={errors.social_url} />
                                    </div>
                                )}
                            </div>

                            {/* Optional Profile Photo */}
                            {isPhotoEnabled && (
                                <div className="space-y-2 pt-1">
                                    <Label className={`text-sm font-semibold ${themeStyles.label}`}>
                                        Profile Photo {isPhotoRequired && <span className="text-rose-500">*</span>}
                                    </Label>

                                    {previewUrl ? (
                                        <div className="flex items-center gap-4 p-3 rounded-lg border bg-slate-50 dark:bg-zinc-800/50">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-14 h-14 rounded-full object-cover border shadow-sm"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium truncate">
                                                    {data.profile_photo?.name ?? 'Photo selected'}
                                                </p>
                                                <p className={`text-[11px] ${themeStyles.muted}`}>
                                                    JPG, PNG, or WebP (max 2MB)
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleRemovePhoto}
                                                className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                            >
                                                <X className="w-4 h-4 mr-1" /> Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <label className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors ${themeStyles.photoCard}`}>
                                            <Camera className="w-8 h-8 text-slate-400 mb-2" />
                                            <span className="text-xs sm:text-sm font-medium">
                                                Upload your photo
                                            </span>
                                            <span className={`text-[11px] mt-0.5 ${themeStyles.muted}`}>
                                                JPG, PNG or WebP up to 2MB
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/png,image/jpeg,image/webp"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                                required={isPhotoRequired}
                                            />
                                        </label>
                                    )}
                                    <InputError message={photoError || errors.profile_photo} />
                                </div>
                            )}

                            {/* Mandatory Consent Checkbox */}
                            <div className="pt-2">
                                <div className={`flex items-start space-x-3 p-3.5 rounded-lg border ${themeStyles.consentBox}`}>
                                    <Checkbox
                                        id="consent"
                                        checked={data.consent_given}
                                        onCheckedChange={(checked) => setData('consent_given', checked === true)}
                                        className={`mt-0.5 ${themeStyles.checkbox}`}
                                        required
                                    />
                                    <div className="space-y-0.5">
                                        <Label htmlFor="consent" className={`text-xs sm:text-sm font-medium leading-snug cursor-pointer ${themeStyles.consentLabel}`}>
                                            I grant permission for this testimonial to be displayed publicly. <span className="text-rose-500">*</span>
                                        </Label>
                                        <p className={`text-[11px] leading-relaxed ${themeStyles.consentDesc}`}>
                                            Your testimonial may appear on public websites and marketing materials. Your email address will never be shared.
                                        </p>
                                    </div>
                                </div>
                                <InputError message={errors.consent_given} />
                            </div>

                            {/* Submit Button (disabled until consent given) */}
                            <div className="space-y-2">
                                <Button
                                    type="submit"
                                    disabled={processing || !data.consent_given}
                                    className={`w-full py-5 text-base rounded-xl transition-all font-semibold ${
                                        !data.consent_given || processing
                                            ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-500 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-500 border border-dashed border-slate-300 dark:border-zinc-700 shadow-none'
                                            : `${themeStyles.button} cursor-pointer`
                                    }`}
                                >
                                    {processing ? (
                                        'Submitting your testimonial...'
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Send Testimonial
                                        </>
                                    )}
                                </Button>
                                {!data.consent_given && (
                                    <p className={`text-center text-xs pt-0.5 ${themeStyles.muted}`}>
                                        Please grant permission above to submit your testimonial.
                                    </p>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer Brand watermark */}
                <div className="text-center mt-8">
                    <p className={`text-xs flex items-center justify-center gap-1.5 ${themeStyles.muted}`}>
                        Powered by <span className="font-semibold text-slate-700 dark:text-zinc-300">Testimonials SaaS</span>
                    </p>
                </div>

                {/* Success Celebratory Modal Dialog Popup */}
                <Dialog open={showCelebrationModal} onOpenChange={setShowCelebrationModal}>
                    <DialogContent className="sm:max-w-xl p-0 overflow-hidden border bg-background/95 backdrop-blur-md shadow-2xl">
                        {renderCelebrationView(true)}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
