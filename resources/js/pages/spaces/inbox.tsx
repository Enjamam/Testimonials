import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Copy,
    Edit3,
    ExternalLink,
    Eye,
    EyeOff,
    Heart,
    Inbox as InboxIcon,
    Lock,
    MessageSquare,
    Search,
    ShieldAlert,
    ShieldCheck,
    Star,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface TestimonialItem {
    id: number;
    space_id: number;
    name: string;
    email: string;
    company_name: string | null;
    social_url: string | null;
    profile_photo_path: string | null;
    testimonial: string;
    rating: number | null;
    consent_given: boolean;
    is_favorite: boolean;
    is_wall_of_love: boolean;
    is_hidden: boolean;
    submitted_at: string | null;
    created_at: string;
}

interface PaginatedTestimonials {
    data: TestimonialItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface SpaceData {
    id: number;
    name: string;
    title: string;
    public_id: string;
    slug: string;
    theme: string;
    rating_enabled: boolean;
}

interface Props {
    space: SpaceData;
    testimonials: PaginatedTestimonials;
    filters: {
        filter: string;
        rating: string | null;
        search: string | null;
    };
    counts: {
        all: number;
        wall_of_love: number;
        favorites: number;
        hidden: number;
    };
    publicUrl: string;
}

export default function SpaceInbox({ space, testimonials, filters, counts, publicUrl }: Props) {
    const [copied, setCopied] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search ?? '');
    const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
    const [editText, setEditText] = useState('');
    const [editRating, setEditRating] = useState<number | null>(null);
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Spaces', href: '/spaces' },
        { title: space.name, href: `/spaces/${space.id}` },
        { title: 'Inbox', href: `/spaces/${space.id}/inbox` },
    ];

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(publicUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // fallback
        }
    };

    const handleFilterChange = (newFilter: string) => {
        router.get(
            `/spaces/${space.id}/inbox`,
            {
                filter: newFilter,
                rating: filters.rating,
                search: filters.search,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleRatingFilterChange = (newRating: string) => {
        router.get(
            `/spaces/${space.id}/inbox`,
            {
                filter: filters.filter,
                rating: newRating || undefined,
                search: filters.search,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            `/spaces/${space.id}/inbox`,
            {
                filter: filters.filter,
                rating: filters.rating,
                search: searchQuery || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const toggleFavorite = (item: TestimonialItem) => {
        router.patch(
            `/spaces/${space.id}/testimonials/${item.id}`,
            { is_favorite: !item.is_favorite },
            { preserveScroll: true }
        );
    };

    const toggleWallOfLove = (item: TestimonialItem) => {
        if (!item.consent_given && !item.is_wall_of_love) {
            alert('Cannot publish to Wall of Love: the respondent did not grant consent for public display.');
            return;
        }

        router.patch(
            `/spaces/${space.id}/testimonials/${item.id}`,
            { is_wall_of_love: !item.is_wall_of_love },
            { preserveScroll: true }
        );
    };

    const toggleHidden = (item: TestimonialItem) => {
        router.patch(
            `/spaces/${space.id}/testimonials/${item.id}`,
            { is_hidden: !item.is_hidden },
            { preserveScroll: true }
        );
    };

    const handleDelete = (item: TestimonialItem) => {
        if (confirm(`Are you sure you want to delete the testimonial from "${item.name}"?`)) {
            router.delete(`/spaces/${space.id}/testimonials/${item.id}`, {
                preserveScroll: true,
            });
        }
    };

    const openEditModal = (item: TestimonialItem) => {
        setEditingTestimonial(item);
        setEditText(item.testimonial);
        setEditRating(item.rating);
        setEditError(null);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTestimonial) return;

        if (editText.trim().length < 3) {
            setEditError('Testimonial must be at least 3 characters long.');
            return;
        }

        setIsSubmittingEdit(true);
        router.patch(
            `/spaces/${space.id}/testimonials/${editingTestimonial.id}`,
            {
                testimonial: editText,
                rating: editRating,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingTestimonial(null);
                    setIsSubmittingEdit(false);
                },
                onError: (err) => {
                    setIsSubmittingEdit(false);
                    setEditError(err.testimonial ?? 'Failed to update testimonial.');
                },
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Inbox — ${space.name}`} />

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
                                <h1 className="text-2xl font-bold tracking-tight">Testimonial Inbox</h1>
                                <Badge variant="secondary" className="text-xs">
                                    {counts.all} Total
                                </Badge>
                            </div>
                            <p className="text-muted-foreground mt-0.5 text-sm">
                                Review, moderate, and publish reviews for <span className="font-medium text-foreground">{space.name}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                            {copied ? (
                                <>
                                    <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
                                    Link Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                                    Copy Form Link
                                </>
                            )}
                        </Button>

                        <Button size="sm" asChild>
                            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                                Public Form
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-xs">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        {/* Status Filter Tabs */}
                        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
                            <Button
                                variant={filters.filter === 'all' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => handleFilterChange('all')}
                                className="text-xs"
                            >
                                All ({counts.all})
                            </Button>
                            <Button
                                variant={filters.filter === 'wall_of_love' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => handleFilterChange('wall_of_love')}
                                className="text-xs flex items-center gap-1.5"
                            >
                                <Heart className={`h-3.5 w-3.5 ${filters.filter === 'wall_of_love' ? 'fill-white' : 'text-rose-500'}`} />
                                Wall of Love ({counts.wall_of_love})
                            </Button>
                            <Button
                                variant={filters.filter === 'favorites' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => handleFilterChange('favorites')}
                                className="text-xs flex items-center gap-1.5"
                            >
                                <Star className={`h-3.5 w-3.5 ${filters.filter === 'favorites' ? 'fill-white' : 'text-amber-500'}`} />
                                Favorites ({counts.favorites})
                            </Button>
                            <Button
                                variant={filters.filter === 'hidden' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => handleFilterChange('hidden')}
                                className="text-xs flex items-center gap-1.5"
                            >
                                <EyeOff className="h-3.5 w-3.5" />
                                Hidden ({counts.hidden})
                            </Button>
                        </div>

                        {/* Search and Rating Filter */}
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                            {space.rating_enabled && (
                                <select
                                    value={filters.rating ?? ''}
                                    onChange={(e) => handleRatingFilterChange(e.target.value)}
                                    className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                                >
                                    <option value="">All Ratings</option>
                                    <option value="5">★★★★★ (5 Stars)</option>
                                    <option value="4">★★★★☆ (4 Stars)</option>
                                    <option value="3">★★★☆☆ (3 Stars)</option>
                                    <option value="2">★★☆☆☆ (2 Stars)</option>
                                    <option value="1">★☆☆☆☆ (1 Star)</option>
                                </select>
                            )}

                            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-60">
                                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search author, email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-9 pl-8 text-xs"
                                />
                            </form>
                        </div>
                    </div>
                </div>

                {/* Testimonial Cards List */}
                {testimonials.data.length === 0 ? (
                    <Card className="border-dashed p-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                            <InboxIcon className="h-7 w-7" />
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight">No testimonials found</h3>
                        <p className="text-muted-foreground mt-1 text-sm max-w-sm mx-auto">
                            {filters.search || filters.filter !== 'all' || filters.rating
                                ? 'No submissions match your active filter criteria. Try resetting filters.'
                                : 'Share your public space collection link with customers to begin collecting reviews!'}
                        </p>
                        <div className="mt-6 flex justify-center gap-3">
                            {filters.search || filters.filter !== 'all' || filters.rating ? (
                                <Button variant="outline" size="sm" onClick={() => handleFilterChange('all')}>
                                    Reset Filters
                                </Button>
                            ) : (
                                <Button size="sm" onClick={handleCopy}>
                                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                                    Copy Collection Link
                                </Button>
                            )}
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {testimonials.data.map((item) => (
                            <Card key={item.id} className={`transition-all ${item.is_hidden ? 'opacity-60 bg-muted/30' : ''}`}>
                                <CardContent className="p-5 sm:p-6">
                                    <div className="flex flex-col gap-4">
                                        {/* Card Top Row: Author details & Status Badges */}
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                            <div className="flex items-start gap-3.5">
                                                {/* Profile Photo or Initials */}
                                                {item.profile_photo_path ? (
                                                    <img
                                                        src={`/storage/${item.profile_photo_path}`}
                                                        alt={item.name}
                                                        className="h-11 w-11 rounded-full object-cover border shadow-2xs"
                                                    />
                                                ) : (
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm border">
                                                        {item.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}

                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-base text-foreground">
                                                            {item.name}
                                                        </span>
                                                        {item.company_name && (
                                                            <span className="text-muted-foreground text-xs">
                                                                · {item.company_name}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Lock className="h-3 w-3" />
                                                            {item.email}
                                                        </span>

                                                        {item.social_url && (
                                                            <>
                                                                <span>·</span>
                                                                <a
                                                                    href={item.social_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-primary hover:underline flex items-center gap-0.5 truncate max-w-[160px]"
                                                                >
                                                                    Profile <ExternalLink className="h-2.5 w-2.5" />
                                                                </a>
                                                            </>
                                                        )}

                                                        <span>·</span>
                                                        <span>
                                                            {new Date(item.submitted_at ?? item.created_at).toLocaleDateString(undefined, {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Badges */}
                                            <div className="flex flex-wrap items-center gap-1.5 self-start">
                                                {item.is_favorite && (
                                                    <Badge variant="outline" className="border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 text-xs gap-1">
                                                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                                        Favorite
                                                    </Badge>
                                                )}

                                                {item.is_wall_of_love ? (
                                                    <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1">
                                                        <Heart className="h-3 w-3 fill-white" />
                                                        Wall of Love
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-muted-foreground text-xs">
                                                        Unpublished
                                                    </Badge>
                                                )}

                                                {item.consent_given ? (
                                                    <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 text-xs gap-1">
                                                        <ShieldCheck className="h-3 w-3 text-blue-500" />
                                                        Consent
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs gap-1">
                                                        <ShieldAlert className="h-3 w-3 text-rose-500" />
                                                        No Consent
                                                    </Badge>
                                                )}

                                                {item.is_hidden && (
                                                    <Badge variant="secondary" className="text-xs gap-1">
                                                        <EyeOff className="h-3 w-3" />
                                                        Hidden
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Rating Stars (if enabled) */}
                                        {space.rating_enabled && item.rating && (
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`h-4 w-4 ${
                                                            star <= item.rating!
                                                                ? 'fill-amber-400 text-amber-400'
                                                                : 'text-slate-200 dark:text-zinc-700'
                                                        }`}
                                                    />
                                                ))}
                                                <span className="text-xs text-muted-foreground ml-1 font-medium">
                                                    ({item.rating} / 5)
                                                </span>
                                            </div>
                                        )}

                                        {/* Testimonial Text Body */}
                                        <div className="relative pl-3 border-l-2 border-primary/30">
                                            <p className="text-sm sm:text-base leading-relaxed text-foreground whitespace-pre-wrap">
                                                "{item.testimonial}"
                                            </p>
                                        </div>

                                        {/* Card Actions Toolbar */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-xs">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {/* Favorite Toggle */}
                                                <Button
                                                    variant={item.is_favorite ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => toggleFavorite(item)}
                                                    className="h-8 gap-1.5 text-xs"
                                                >
                                                    <Star className={`h-3.5 w-3.5 ${item.is_favorite ? 'fill-current' : 'text-amber-500'}`} />
                                                    {item.is_favorite ? 'Favorited' : 'Favorite'}
                                                </Button>

                                                {/* Wall of Love Toggle */}
                                                <Button
                                                    variant={item.is_wall_of_love ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => toggleWallOfLove(item)}
                                                    className={`h-8 gap-1.5 text-xs ${
                                                        item.is_wall_of_love ? 'bg-rose-600 hover:bg-rose-700 text-white' : ''
                                                    }`}
                                                    title={!item.consent_given ? 'Respondent did not grant public consent' : undefined}
                                                >
                                                    <Heart className={`h-3.5 w-3.5 ${item.is_wall_of_love ? 'fill-current' : 'text-rose-500'}`} />
                                                    {item.is_wall_of_love ? 'On Wall of Love' : 'Add to Wall of Love'}
                                                </Button>

                                                {/* Hide / Unhide Toggle */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => toggleHidden(item)}
                                                    className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                                                >
                                                    {item.is_hidden ? (
                                                        <>
                                                            <Eye className="h-3.5 w-3.5" /> Unhide
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="h-3.5 w-3.5" /> Hide
                                                        </>
                                                    )}
                                                </Button>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                {/* Edit Button */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditModal(item)}
                                                    className="h-8 gap-1 text-xs"
                                                >
                                                    <Edit3 className="h-3.5 w-3.5" /> Edit
                                                </Button>

                                                {/* Delete Button */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(item)}
                                                    className="h-8 gap-1 text-xs text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" /> Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Pagination */}
                        {testimonials.last_page > 1 && (
                            <div className="flex items-center justify-center gap-1 pt-4">
                                {testimonials.links.map((link, idx) => (
                                    <Button
                                        key={idx}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        asChild={Boolean(link.url)}
                                        className="h-8 px-3 text-xs"
                                    >
                                        {link.url ? (
                                            <Link href={link.url} preserveScroll dangerouslySetInnerHTML={{ __html: link.label }} />
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Testimonial Dialog */}
            <Dialog open={editingTestimonial !== null} onOpenChange={(open) => !open && setEditingTestimonial(null)}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={submitEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit Testimonial</DialogTitle>
                            <DialogDescription>
                                Edit the content or rating for {editingTestimonial?.name}.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {/* Star Rating Picker (if space has ratings) */}
                            {space.rating_enabled && (
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Rating (1 to 5 Stars)</Label>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setEditRating(star)}
                                                className="p-1 focus:outline-hidden"
                                            >
                                                <Star
                                                    className={`h-6 w-6 ${
                                                        (editRating ?? 0) >= star
                                                            ? 'fill-amber-400 text-amber-400'
                                                            : 'text-slate-300 dark:text-zinc-600'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Testimonial Textarea */}
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-testimonial" className="text-xs font-semibold">
                                    Testimonial Text
                                </Label>
                                <Textarea
                                    id="edit-testimonial"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    rows={5}
                                    maxLength={5000}
                                    required
                                    className="text-sm leading-relaxed"
                                />
                                {editError && <InputError message={editError} />}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingTestimonial(null)}
                                disabled={isSubmittingEdit}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmittingEdit}>
                                {isSubmittingEdit ? 'Saving Changes...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
