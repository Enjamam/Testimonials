import { Form } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useRef } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <Card className="border-red-500/20 bg-red-500/[0.02] shadow-xs">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <CardTitle className="text-base font-semibold text-destructive">
                        Danger Zone
                    </CardTitle>
                </div>
                <CardDescription>
                    Permanently delete your account and all associated spaces, testimonials, and billing records.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Once your account is deleted, all resources and respondent submissions are immediately purged. This operation is completely permanent and cannot be undone.
                </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t border-red-500/15 bg-red-500/[0.04] px-6 py-3.5">
                <span className="text-xs text-muted-foreground">
                    Irreversible account action
                </span>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="sm"
                            data-test="delete-user-button"
                        >
                            Delete Account
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>
                            Are you sure you want to delete your account?
                        </DialogTitle>
                        <DialogDescription>
                            Once your account is deleted, all of its resources
                            and data will also be permanently deleted. Please
                            enter your password to confirm you would like to
                            permanently delete your account.
                        </DialogDescription>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            Password
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Confirm your password"
                                            autoComplete="current-password"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={processing}
                                            asChild
                                        >
                                            <button
                                                type="submit"
                                                data-test="confirm-delete-user-button"
                                            >
                                                Permanently Delete
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}
