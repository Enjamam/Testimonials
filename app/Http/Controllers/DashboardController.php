<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\PlanLimitService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the analytics and overview dashboard for the authenticated user.
     */
    public function __invoke(Request $request, PlanLimitService $planLimits): Response
    {
        /** @var User $user */
        $user = $request->user();

        // 1. Period filter: 7, 30, or 90 days (default: 30)
        $allowedPeriods = [7, 30, 90];
        $days = (int) $request->query('period', 30);
        if (! in_array($days, $allowedPeriods, true)) {
            $days = 30;
        }

        $startDate = now()->subDays($days - 1)->startOfDay();

        // 2. Metrics Calculations
        $totalSpaces = $user->spaces()->count();
        $totalTestimonials = $user->testimonials()->count();
        $uniqueRespondents = $user->testimonials()->distinct('email')->count('email');
        $wallOfLoveCount = $user->testimonials()
            ->where('is_wall_of_love', true)
            ->where('is_hidden', false)
            ->where('consent_given', true)
            ->count();

        $periodTestimonials = $user->testimonials()
            ->where('testimonials.submitted_at', '>=', $startDate)
            ->count();

        // 3. Daily Submissions Timeline (continuous with zero-filled gaps)
        $submissionsByDate = $user->testimonials()
            ->where('testimonials.submitted_at', '>=', $startDate)
            ->selectRaw('DATE(testimonials.submitted_at) as date, count(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date')
            ->all();

        $timeline = [];
        for ($offset = $days - 1; $offset >= 0; $offset--) {
            $dateInstance = now()->subDays($offset);
            $dateString = $dateInstance->format('Y-m-d');
            $timeline[] = [
                'date' => $dateString,
                'label' => $dateInstance->format('M j'),
                'count' => (int) ($submissionsByDate[$dateString] ?? 0),
            ];
        }

        // 4. User's Spaces with activity counts
        $spaces = $user->spaces()
            ->withCount([
                'testimonials',
                'testimonials as wall_of_love_count' => fn ($q) => $q->where('is_wall_of_love', true)->where('is_hidden', false)->where('consent_given', true),
            ])
            ->latest()
            ->get();

        // 5. Usage & Plan limits
        $usage = $planLimits->getSpaceUsage($user);

        return Inertia::render('dashboard', [
            'metrics' => [
                'total_spaces' => $totalSpaces,
                'total_testimonials' => $totalTestimonials,
                'unique_respondents' => $uniqueRespondents,
                'wall_of_love_count' => $wallOfLoveCount,
                'period_testimonials' => $periodTestimonials,
            ],
            'period' => $days,
            'timeline' => $timeline,
            'usage' => $usage,
            'spaces' => $spaces,
        ]);
    }
}
