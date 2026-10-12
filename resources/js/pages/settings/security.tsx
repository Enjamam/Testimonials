import { Form, Head } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import type { Props as ManagePasskeysProps } from '@/components/manage-passkeys';
import ManagePasskeys from '@/components/manage-passkeys';
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import ManageTwoFactor from '@/components/manage-two-factor';
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
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/security';

type Props = {
    passwordRules: string;
} & ManagePasskeysProps &
    ManageTwoFactorProps;

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-8">
            <Head title="Security settings" />

            <Card className="border-border/60 shadow-xs">
                <CardHeader className="pb-5">
                    <div className="flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-semibold tracking-tight">
                            Update Password
                        </CardTitle>
                    </div>
                    <CardDescription>
                        Ensure your account is using a long, random password to stay secure
                    </CardDescription>
                </CardHeader>

                <Form
                    {...SecurityController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    resetOnError={[
                        'password',
                        'password_confirmation',
                        'current_password',
                    ]}
                    resetOnSuccess
                    onError={(errors) => {
                        if (errors.password) {
                            passwordInput.current?.focus();
                        }

                        if (errors.current_password) {
                            currentPasswordInput.current?.focus();
                        }
                    }}
                >
                    {({ errors, processing }) => (
                        <>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="current_password">
                                        Current password
                                    </Label>
                                    <PasswordInput
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        autoComplete="current-password"
                                        placeholder="Enter current password"
                                        className="h-10"
                                    />
                                    <InputError message={errors.current_password} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">New password</Label>
                                        <PasswordInput
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            autoComplete="new-password"
                                            placeholder="Enter new password"
                                            passwordrules={props.passwordRules}
                                            className="h-10"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">
                                            Confirm password
                                        </Label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            autoComplete="new-password"
                                            placeholder="Confirm new password"
                                            passwordrules={props.passwordRules}
                                            className="h-10"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="flex items-center justify-between border-t border-border/50 bg-muted/15 px-6 py-4">
                                <span className="text-xs text-muted-foreground">
                                    Requires your current password to confirm changes.
                                </span>
                                <Button
                                    disabled={processing}
                                    data-test="update-password-button"
                                    className="min-w-24 shadow-xs"
                                >
                                    {processing ? 'Saving...' : 'Save Password'}
                                </Button>
                            </CardFooter>
                        </>
                    )}
                </Form>
            </Card>

            <ManageTwoFactor
                canManageTwoFactor={props.canManageTwoFactor}
                requiresConfirmation={props.requiresConfirmation}
                twoFactorEnabled={props.twoFactorEnabled}
            />

            <ManagePasskeys
                canManagePasskeys={props.canManagePasskeys}
                passkeys={props.passkeys}
            />
        </div>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Account Settings',
            href: edit(),
        },
        {
            title: 'Security',
            href: edit(),
        },
    ],
};
