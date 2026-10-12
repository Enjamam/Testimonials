import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, Palette } from 'lucide-react';
import React from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface FieldSetting {
    enabled: boolean;
    required: boolean;
}

interface FieldConfig {
    name: FieldSetting;
    email: FieldSetting;
    company_name: FieldSetting;
    social_url: FieldSetting;
    profile_photo: FieldSetting;
}

interface SpaceData {
    id: number;
    name: string;
    title: string;
    subtitle: string | null;
    ask: string | null;
    slug: string;
    public_id: string;
    theme: string;
    rating_enabled: boolean;
    field_configuration: FieldConfig | null;
}

interface Props {
    space: SpaceData;
    themes: string[];
    defaultFieldConfiguration: FieldConfig;
}

export default function SpaceEdit({ space, themes, defaultFieldConfiguration }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: space.name,
        title: space.title,
        subtitle: space.subtitle ?? '',
        ask: space.ask ?? '',
        slug: space.slug,
        theme: space.theme,
        rating_enabled: space.rating_enabled,
        field_configuration: space.field_configuration ?? defaultFieldConfiguration,
    });

    const handleFieldToggle = (fieldKey: keyof FieldConfig, property: 'enabled' | 'required', checked: boolean) => {
        setData((prev) => {
            const current = { ...prev.field_configuration };
            const field = { ...current[fieldKey] };

            if (property === 'enabled') {
                field.enabled = checked;
                if (!checked) {
                    field.required = false;
                }
            } else if (property === 'required') {
                field.required = checked;
                if (checked) {
                    field.enabled = true;
                }
            }

            current[fieldKey] = field;
            return { ...prev, field_configuration: current };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/spaces/${space.id}`);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Spaces',
            href: '/spaces',
        },
        {
            title: space.name,
            href: `/spaces/${space.id}`,
        },
        {
            title: 'Edit',
            href: `/spaces/${space.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${space.name}`} />

            <div className="flex w-full flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/spaces/${space.id}`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Space Settings</h1>
                        <p className="text-muted-foreground text-sm">
                            Update copy, theme styling, and submission fields for &quot;{space.name}&quot;.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Space Details</CardTitle>
                            <CardDescription>
                                Internal identification and custom URL slug.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Internal Space Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Space URL Slug *</Label>
                                <div className="flex items-center rounded-md border bg-muted/30 px-3">
                                    <span className="text-muted-foreground select-none text-xs sm:text-sm">
                                        /s/
                                    </span>
                                    <input
                                        id="slug"
                                        className="h-9 w-full bg-transparent px-1 text-sm outline-none font-mono"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value.toLowerCase().replace(/[^\w-]/g, ''))}
                                        required
                                    />
                                </div>
                                <InputError message={errors.slug} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Public Form Copy & Questions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Public Page Copy</CardTitle>
                            <CardDescription>
                                What respondents see when they arrive at your collection page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Public Page Header Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="subtitle">Subtitle / Motivation</Label>
                                <Input
                                    id="subtitle"
                                    value={data.subtitle}
                                    onChange={(e) => setData('subtitle', e.target.value)}
                                />
                                <InputError message={errors.subtitle} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="ask">Testimonial Prompt / Ask Question</Label>
                                <Textarea
                                    id="ask"
                                    value={data.ask}
                                    onChange={(e) => setData('ask', e.target.value)}
                                    rows={3}
                                />
                                <InputError message={errors.ask} />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <Checkbox
                                    id="rating_enabled"
                                    checked={data.rating_enabled}
                                    onCheckedChange={(checked) => setData('rating_enabled', Boolean(checked))}
                                />
                                <Label htmlFor="rating_enabled" className="cursor-pointer font-normal">
                                    <span className="font-medium text-foreground">Collect 1 to 5 Star Rating</span>
                                    <span className="text-muted-foreground block text-xs">
                                        Allows respondents to rate your product or service with stars.
                                    </span>
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Theme Selector */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Palette className="h-5 w-5" />
                                Form Theme
                            </CardTitle>
                            <CardDescription>
                                Select visual style for the collection form.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-3">
                                {[
                                    { id: 'minimal-light', label: 'Minimal Light', desc: 'Crisp, clean white theme', bg: 'bg-white border-zinc-200 text-zinc-900' },
                                    { id: 'minimal-dark', label: 'Minimal Dark', desc: 'Sleek dark obsidian styling', bg: 'bg-zinc-950 border-zinc-800 text-zinc-100' },
                                    { id: 'soft-color', label: 'Soft Color', desc: 'Warm gentle pastel tones', bg: 'bg-indigo-50/70 border-indigo-200 text-indigo-950' },
                                ].map((t) => (
                                    <div
                                        key={t.id}
                                        onClick={() => setData('theme', t.id)}
                                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                                            data.theme === t.id
                                                ? 'border-primary ring-2 ring-primary/20'
                                                : 'border-muted hover:border-zinc-300 dark:hover:border-zinc-700'
                                        }`}
                                    >
                                        <div className={`mb-3 flex h-16 w-full items-center justify-center rounded border ${t.bg}`}>
                                            <span className="text-xs font-medium">Preview</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="font-medium text-sm">{t.label}</div>
                                            {data.theme === t.id && (
                                                <Badge variant="default" className="h-5 px-1.5 text-[10px]">Active</Badge>
                                            )}
                                        </div>
                                        <div className="text-muted-foreground mt-1 text-xs">{t.desc}</div>
                                    </div>
                                ))}
                            </div>
                            <InputError message={errors.theme} />
                        </CardContent>
                    </Card>

                    {/* Respondent Fields Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Respondent Fields</CardTitle>
                            <CardDescription>
                                Toggle available respondent input fields.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y rounded-md border text-sm">
                                <div className="flex items-center justify-between p-3.5 bg-muted/10">
                                    <div>
                                        <div className="font-medium text-foreground">Respondent Name</div>
                                        <div className="text-muted-foreground text-xs">Required by system</div>
                                    </div>
                                    <Badge variant="secondary">Always Required</Badge>
                                </div>

                                <div className="flex items-center justify-between p-3.5 bg-muted/10">
                                    <div>
                                        <div className="font-medium text-foreground">Respondent Email</div>
                                        <div className="text-muted-foreground text-xs">Used for verification, never published publicly</div>
                                    </div>
                                    <Badge variant="secondary">Always Required</Badge>
                                </div>

                                <div className="flex flex-col gap-2 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="font-medium text-foreground">Company Name / Title</div>
                                        <div className="text-muted-foreground text-xs">e.g. &quot;CEO at Acme Inc&quot;</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer text-xs">
                                            <Checkbox
                                                checked={data.field_configuration.company_name?.enabled ?? false}
                                                onCheckedChange={(c) => handleFieldToggle('company_name', 'enabled', Boolean(c))}
                                            />
                                            Enabled
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer text-xs">
                                            <Checkbox
                                                disabled={!data.field_configuration.company_name?.enabled}
                                                checked={data.field_configuration.company_name?.required ?? false}
                                                onCheckedChange={(c) => handleFieldToggle('company_name', 'required', Boolean(c))}
                                            />
                                            Required
                                        </label>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="font-medium text-foreground">Social Profile URL</div>
                                        <div className="text-muted-foreground text-xs">e.g. LinkedIn or X profile link</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer text-xs">
                                            <Checkbox
                                                checked={data.field_configuration.social_url?.enabled ?? false}
                                                onCheckedChange={(c) => handleFieldToggle('social_url', 'enabled', Boolean(c))}
                                            />
                                            Enabled
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer text-xs">
                                            <Checkbox
                                                disabled={!data.field_configuration.social_url?.enabled}
                                                checked={data.field_configuration.social_url?.required ?? false}
                                                onCheckedChange={(c) => handleFieldToggle('social_url', 'required', Boolean(c))}
                                            />
                                            Required
                                        </label>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="font-medium text-foreground">Profile Photo Upload</div>
                                        <div className="text-muted-foreground text-xs">JPG, PNG, or WebP avatar image</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer text-xs">
                                            <Checkbox
                                                checked={data.field_configuration.profile_photo?.enabled ?? false}
                                                onCheckedChange={(c) => handleFieldToggle('profile_photo', 'enabled', Boolean(c))}
                                            />
                                            Enabled
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer text-xs">
                                            <Checkbox
                                                disabled={!data.field_configuration.profile_photo?.enabled}
                                                checked={data.field_configuration.profile_photo?.required ?? false}
                                                onCheckedChange={(c) => handleFieldToggle('profile_photo', 'required', Boolean(c))}
                                            />
                                            Required
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <InputError message={errors.field_configuration} />
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild>
                            <Link href={`/spaces/${space.id}`}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving Changes...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
