<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSpaceRequest;
use App\Http\Requests\UpdateSpaceRequest;
use App\Models\Space;
use App\Services\PlanLimitService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SpaceController extends Controller
{
    /**
     * Display a listing of the user's spaces.
     */
    public function index(Request $request, PlanLimitService $limitService): Response
    {
        $user = $request->user();

        $spaces = $user->spaces()
            ->withCount('testimonials')
            ->latest()
            ->get();

        return Inertia::render('spaces/index', [
            'spaces' => $spaces,
            'usage' => $limitService->getSpaceUsage($user),
        ]);
    }

    /**
     * Show the form for creating a new space.
     */
    public function create(Request $request, PlanLimitService $limitService): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $limitService->canCreateSpace($user)) {
            return redirect()->route('spaces.index')->with(
                'error',
                'You have reached the maximum number of spaces allowed on your current plan. Please upgrade to Pro to create more spaces.'
            );
        }

        return Inertia::render('spaces/create', [
            'themes' => Space::THEMES,
            'defaultFieldConfiguration' => Space::DEFAULT_FIELD_CONFIGURATION,
            'usage' => $limitService->getSpaceUsage($user),
        ]);
    }

    /**
     * Store a newly created space in storage.
     */
    public function store(StoreSpaceRequest $request): RedirectResponse
    {
        $space = DB::transaction(function () use ($request): Space {
            /** @var Space $createdSpace */
            $createdSpace = $request->user()->spaces()->create($request->validated());

            $createdSpace->embedConfiguration()->create([]);

            return $createdSpace;
        });

        return redirect()->route('spaces.success', $space)->with('success', 'Space created successfully!');
    }

    /**
     * Display the space creation success screen with public collection URL.
     */
    public function success(Request $request, Space $space): Response
    {
        Gate::authorize('view', $space);

        return Inertia::render('spaces/success', [
            'space' => $space,
            'publicUrl' => route('public.spaces.show', $space->slug ?: $space->public_id),
        ]);
    }

    /**
     * Display the specified space overview.
     */
    public function show(Request $request, Space $space): Response
    {
        Gate::authorize('view', $space);

        $space->loadCount([
            'testimonials',
            'testimonials as wall_of_love_count' => fn ($q) => $q->where('is_wall_of_love', true)->where('is_hidden', false)->where('consent_given', true),
        ]);

        return Inertia::render('spaces/show', [
            'space' => $space,
            'publicUrl' => route('public.spaces.show', $space->slug ?: $space->public_id),
        ]);
    }

    /**
     * Show the form for editing the specified space.
     */
    public function edit(Request $request, Space $space): Response
    {
        Gate::authorize('update', $space);

        return Inertia::render('spaces/edit', [
            'space' => $space,
            'themes' => Space::THEMES,
            'defaultFieldConfiguration' => Space::DEFAULT_FIELD_CONFIGURATION,
        ]);
    }

    /**
     * Update the specified space in storage.
     */
    public function update(UpdateSpaceRequest $request, Space $space): RedirectResponse
    {
        $space->update($request->validated());

        return redirect()->route('spaces.show', $space)->with('success', 'Space updated successfully!');
    }

    /**
     * Remove the specified space from storage.
     */
    public function destroy(Request $request, Space $space): RedirectResponse
    {
        Gate::authorize('delete', $space);

        $space->delete();

        return redirect()->route('spaces.index')->with('success', 'Space deleted successfully.');
    }
}
