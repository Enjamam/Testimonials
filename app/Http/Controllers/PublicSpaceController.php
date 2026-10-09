<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTestimonialRequest;
use App\Jobs\SendNewTestimonialNotificationJob;
use App\Models\Space;
use App\Models\Testimonial;
use App\Services\PlanLimitService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PublicSpaceController extends Controller
{
    /**
     * Display the public testimonial collection page for a Space.
     */
    public function show(Space $space, PlanLimitService $planLimits): Response
    {
        return Inertia::render('public/space-form', [
            'space' => [
                'public_id' => $space->public_id,
                'slug' => $space->slug,
                'title' => $space->title,
                'subtitle' => $space->subtitle,
                'ask' => $space->ask,
                'theme' => $space->theme,
                'rating_enabled' => (bool) $space->rating_enabled,
                'field_configuration' => $space->field_configuration ?? Space::DEFAULT_FIELD_CONFIGURATION,
            ],
            'can_accept_testimonials' => $planLimits->canAcceptTestimonial($space),
        ]);
    }

    /**
     * Store a newly submitted testimonial from the public form.
     */
    public function store(StoreTestimonialRequest $request, Space $space, PlanLimitService $planLimits): RedirectResponse
    {
        // 1. Enforce server-side plan limit
        if (! $planLimits->canAcceptTestimonial($space)) {
            throw ValidationException::withMessages([
                'testimonial' => 'This space has reached its maximum testimonial limit.',
            ]);
        }

        // 2. Spam mitigation: honeypot check
        if ($request->filled('website_hp')) {
            // Silently complete to foil automated spam bots
            return back()->with('success', "Your kind words have officially made someone's day.");
        }

        // 3. Process optional photo upload safely
        $photoPath = null;
        if ($request->hasFile('profile_photo')) {
            $photoPath = $request->file('profile_photo')->store('testimonials/photos', 'public');
        }

        // 4. Sanitize user-generated content against XSS
        $sanitizedName = trim(strip_tags((string) $request->input('name')));
        $sanitizedEmail = trim((string) $request->input('email'));
        $sanitizedCompany = $request->filled('company_name') ? trim(strip_tags((string) $request->input('company_name'))) : null;
        $sanitizedSocial = $request->filled('social_url') ? trim((string) $request->input('social_url')) : null;
        $rawTestimonial = (string) $request->input('testimonial');
        $sanitizedTestimonial = trim(strip_tags($rawTestimonial));

        // 5. Atomic persistence with lock to prevent concurrency race conditions on plan limits
        $testimonial = DB::transaction(function () use ($space, $planLimits, $request, $photoPath, $sanitizedName, $sanitizedEmail, $sanitizedCompany, $sanitizedSocial, $sanitizedTestimonial): Testimonial {
            /** @var Space $lockedSpace */
            $lockedSpace = Space::whereKey($space->id)->lockForUpdate()->firstOrFail();

            if (! $planLimits->canAcceptTestimonial($lockedSpace)) {
                throw ValidationException::withMessages([
                    'testimonial' => 'This space has reached its maximum testimonial limit.',
                ]);
            }

            return $lockedSpace->testimonials()->create([
                'name' => $sanitizedName,
                'email' => $sanitizedEmail,
                'company_name' => $sanitizedCompany,
                'social_url' => $sanitizedSocial,
                'profile_photo_path' => $photoPath,
                'rating' => $lockedSpace->rating_enabled && $request->filled('rating') ? (int) $request->input('rating') : null,
                'testimonial' => $sanitizedTestimonial,
                'consent_given' => true,
                'submitted_at' => now(),
                'is_wall_of_love' => false,
                'is_favorite' => false,
                'is_hidden' => false,
            ]);
        });

        // 6. Queue notification to Space owner
        SendNewTestimonialNotificationJob::dispatch($testimonial);

        return back()->with('success', "Your kind words have officially made someone's day.");
    }
}
