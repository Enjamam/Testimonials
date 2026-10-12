import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Camera, Check, Sparkles, Trash2, User as UserIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInitials } from '@/hooks/use-initials';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
    mustVerifyEmail: boolean;
    status?: string;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const getInitials = useInitials();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [clientError, setClientError] = useState<string | null>(null);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm<{
        _method: string;
        name: string;
        email: string;
        avatar: File | null;
        remove_avatar: boolean;
    }>({
        _method: 'patch',
        name: auth.user.name,
        email: auth.user.email,
        avatar: null,
        remove_avatar: false,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setClientError('The avatar must not be greater than 2MB.');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }
            const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setClientError('The avatar must be a valid image file (JPG, PNG, or WebP).');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }
            setClientError(null);
            setData((prev) => ({
                ...prev,
                avatar: file,
                remove_avatar: false,
            }));
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
        }
    };

    const handleRemoveAvatar = () => {
        setClientError(null);
        setData((prev) => ({
            ...prev,
            avatar: null,
            remove_avatar: true,
        }));
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings/profile', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setAvatarPreview(null);
            },
        });
    };

    const displayAvatar = avatarPreview
        ? avatarPreview
        : data.remove_avatar
          ? undefined
          : auth.user.avatar;

    return (
        <div className="space-y-8">
            <Head title="Profile settings" />

            <form onSubmit={handleSubmit}>
                <Card className="border-border/60 shadow-xs">
                    <CardHeader className="pb-5">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-semibold tracking-tight">
                                    Personal Details
                                </CardTitle>
                                <CardDescription>
                                    Manage your public avatar, name, and account login address
                                </CardDescription>
                            </div>
                            <Badge
                                variant="outline"
                                className="bg-primary/5 text-primary border-primary/20 gap-1 px-2.5 py-0.5 text-xs font-medium"
                            >
                                <Sparkles className="h-3 w-3" />
                                Account Owner
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Avatar Upload Section */}
                        <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                            <Label className="text-sm font-semibold mb-3 block">
                                Profile Picture
                            </Label>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="relative group shrink-0">
                                    <Avatar className="h-20 w-20 rounded-full border-2 border-border shadow-xs overflow-hidden ring-2 ring-primary/20">
                                        <AvatarImage
                                            src={displayAvatar}
                                            alt={data.name || auth.user.name}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="text-lg font-bold bg-muted text-foreground">
                                            {getInitials(data.name || auth.user.name) || (
                                                <UserIcon className="h-8 w-8 text-muted-foreground" />
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        title="Change photo"
                                    >
                                        <Camera className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="space-y-2 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/png,image/jpeg,image/jpg,image/webp"
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="gap-2 cursor-pointer font-medium"
                                        >
                                            <Camera className="h-4 w-4" />
                                            Upload new photo
                                        </Button>

                                        {(auth.user.avatar || avatarPreview) && !data.remove_avatar && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleRemoveAvatar}
                                                className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Remove photo
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-normal">
                                        Recommended: JPG, PNG, or WebP. Max 2MB. Square aspect ratio looks best.
                                    </p>
                                    <InputError message={clientError || errors.avatar} />
                                </div>
                            </div>
                        </div>

                        {/* Name Input */}
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="e.g. Alex Morgan"
                                className="h-10"
                            />
                            <InputError message={errors.name} />
                        </div>

                        {/* Email Input */}
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email Address
                                </Label>
                                {auth.user.email_verified_at ? (
                                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <Check className="h-3 w-3" />
                                        Verified
                                    </span>
                                ) : (
                                    <span className="text-[11px] font-medium text-amber-500">
                                        Unverified
                                    </span>
                                )}
                            </div>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="you@company.com"
                                className="h-10"
                            />
                            <InputError message={errors.email} />

                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-600 dark:text-amber-400 space-y-1 mt-1">
                                    <p>
                                        Your email address is unverified.{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="font-semibold underline underline-offset-2 hover:opacity-80"
                                        >
                                            Click here to resend verification email.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <p className="font-semibold text-emerald-600">
                                            A new verification link has been sent to your email address.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between border-t border-border/50 bg-muted/15 px-6 py-4">
                        <span className="text-xs text-muted-foreground">
                            Profile updates are visible across your testimonial spaces.
                        </span>
                        <div className="flex items-center gap-3">
                            {recentlySuccessful && (
                                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                                    <Check className="h-3.5 w-3.5" />
                                    Changes saved
                                </span>
                            )}
                            <Button
                                type="submit"
                                disabled={processing}
                                data-test="update-profile-button"
                                className="min-w-24 shadow-xs"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>

            <DeleteUser />
        </div>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Account Settings',
            href: edit(),
        },
        {
            title: 'Profile',
            href: edit(),
        },
    ],
};
