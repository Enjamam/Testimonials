import { Head } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ExternalLink, Heart, Star } from 'lucide-react';
import React, { useRef } from 'react';

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

interface EmbedConfig {
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

interface Props {
    space: {
        public_id: string;
        title: string;
        rating_enabled: boolean;
    };
    config: EmbedConfig;
    testimonials: TestimonialData[];
}

export default function EmbedWall({ space, config, testimonials }: Props) {
    const carouselRef = useRef<HTMLDivElement>(null);

    const scrollCarousel = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const scrollAmount = direction === 'left' ? -340 : 340;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const isDark = config.dark_mode;
    const cardRadius = config.display_options?.card_radius || 'rounded-2xl';
    const cardShadow = config.display_options?.card_shadow || (isDark ? 'shadow-md' : 'shadow-xs');
    const cardBg = isDark
        ? `bg-zinc-900/90 border-zinc-800 text-zinc-100 ${cardShadow}`
        : `bg-white border-slate-200 text-slate-900 ${cardShadow}`;
    const mutedText = isDark ? 'text-zinc-400' : 'text-slate-500';

    return (
        <div
            className={`min-h-screen w-full p-4 sm:p-6 transition-colors duration-200 ${
                isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-transparent text-slate-900'
            }`}
            style={{
                backgroundColor: config.background_color && config.background_color !== 'transparent'
                    ? config.background_color
                    : undefined,
            }}
        >
            <Head title={`${space.title} — Wall of Love`} />

            {testimonials.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-500 mb-3">
                        <Heart className="h-6 w-6" />
                    </div>
                    <p className={`text-sm font-medium ${mutedText}`}>
                        No testimonials published on the Wall of Love yet.
                    </p>
                </div>
            ) : config.layout === 'carousel' ? (
                /* Carousel Layout */
                <div className="relative group max-w-7xl mx-auto py-2">
                    {/* Carousel Nav Arrows */}
                    <button
                        type="button"
                        onClick={() => scrollCarousel('left')}
                        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-zinc-800 border shadow-md text-foreground opacity-80 hover:opacity-100 transition-opacity"
                        aria-label="Previous testimonials"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => scrollCarousel('right')}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-zinc-800 border shadow-md text-foreground opacity-80 hover:opacity-100 transition-opacity"
                        aria-label="Next testimonials"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    <div
                        ref={carouselRef}
                        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-none px-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {testimonials.map((item) => (
                            <div
                                key={item.id}
                                className={`w-[300px] sm:w-[340px] shrink-0 snap-start ${cardRadius} border p-5 flex flex-col justify-between ${cardBg} ${
                                    config.animation_enabled ? 'transition-transform duration-200 hover:-translate-y-1' : ''
                                }`}
                            >
                                <div className="space-y-3">
                                    {/* Star Rating */}
                                    {config.display_options.show_rating && item.rating && (
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-4 w-4 ${
                                                        star <= item.rating!
                                                            ? 'fill-amber-400 text-amber-400'
                                                            : 'text-slate-300 dark:text-zinc-700'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Testimonial Quote */}
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                        "{item.testimonial}"
                                    </p>
                                </div>

                                {/* Author Profile Footer */}
                                <div className="flex items-center gap-3 pt-4 mt-2 border-t border-border/50">
                                    {config.display_options.show_profile_photo && (
                                        item.profile_photo_path ? (
                                            <img
                                                src={`/storage/${item.profile_photo_path}`}
                                                alt={item.name}
                                                className="h-10 w-10 rounded-full object-cover border"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs border">
                                                {item.name.charAt(0).toUpperCase()}
                                            </div>
                                        )
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-semibold text-sm truncate">{item.name}</span>
                                            {item.social_url && (
                                                <a
                                                    href={item.social_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:opacity-80"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            )}
                                        </div>
                                        {config.display_options.show_company_name && item.company_name && (
                                            <p className={`text-xs truncate ${mutedText}`}>{item.company_name}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* Uniform Responsive Grid Layout (Equal Card Heights) */
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                    {testimonials.map((item) => (
                        <div
                            key={item.id}
                            className={`${cardRadius} border p-5 flex flex-col justify-between h-full min-h-[200px] ${cardBg} ${
                                config.animation_enabled ? 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5' : ''
                            }`}
                        >
                            <div className="space-y-3 flex-1 flex flex-col">
                                {/* Rating */}
                                {config.display_options.show_rating && item.rating && (
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-4 w-4 ${
                                                    star <= item.rating!
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'text-slate-300 dark:text-zinc-700'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Testimonial Text */}
                                <p className="text-sm leading-relaxed whitespace-pre-wrap flex-1">
                                    "{item.testimonial}"
                                </p>
                            </div>

                            {/* Author Profile Footer */}
                            <div className="flex items-center gap-3 pt-4 mt-4 border-t border-border/50">
                                {config.display_options.show_profile_photo && (
                                    item.profile_photo_path ? (
                                        <img
                                            src={`/storage/${item.profile_photo_path}`}
                                            alt={item.name}
                                            className="h-10 w-10 rounded-full object-cover border"
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs border">
                                            {item.name.charAt(0).toUpperCase()}
                                        </div>
                                    )
                                )}

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-semibold text-sm truncate">{item.name}</span>
                                        {item.social_url && (
                                            <a
                                                href={item.social_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:opacity-80"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        )}
                                    </div>
                                    {config.display_options.show_company_name && item.company_name && (
                                        <p className={`text-xs truncate ${mutedText}`}>{item.company_name}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Powered by Watermark */}
            <div className="text-center pt-8 pb-4">
                <p className={`text-[11px] font-medium opacity-70 flex items-center justify-center gap-1 ${mutedText}`}>
                    Powered by <span className="font-semibold text-foreground">Testimonials SaaS</span>
                </p>
            </div>
        </div>
    );
}
