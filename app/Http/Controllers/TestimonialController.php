<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateTestimonialRequest;
use App\Models\Space;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    /**
     * Display a listing of testimonials for the given space (Inbox).
     */
    public function index(Request $request, Space $space): Response
    {
        Gate::authorize('view', $space);

        $filter = $request->query('filter', 'all');
        $rating = $request->query('rating');
        $search = $request->query('search');

        $query = $space->testimonials();

        // 1. Status Filter
        match ($filter) {
            'wall_of_love' => $query->where('is_wall_of_love', true),
            'favorites' => $query->where('is_favorite', true),
            'hidden' => $query->where('is_hidden', true),
            default => null,
        };

        // 2. Rating Filter
        if ($rating !== null && is_numeric($rating)) {
            $query->where('rating', (int) $rating);
        }

        // 3. Keyword Search
        if (! empty($search) && is_string($search)) {
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('testimonial', 'like', "%{$search}%");
            });
        }

        // 4. Default ordering: Favorites first, then newest
        $testimonials = $query
            ->orderByDesc('is_favorite')
            ->orderByDesc('submitted_at')
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        // 5. Aggregate tab counts
        $counts = [
            'all' => $space->testimonials()->count(),
            'wall_of_love' => $space->testimonials()->where('is_wall_of_love', true)->count(),
            'favorites' => $space->testimonials()->where('is_favorite', true)->count(),
            'hidden' => $space->testimonials()->where('is_hidden', true)->count(),
        ];

        return Inertia::render('spaces/inbox', [
            'space' => $space,
            'testimonials' => $testimonials,
            'filters' => [
                'filter' => $filter,
                'rating' => $rating,
                'search' => $search,
            ],
            'counts' => $counts,
            'publicUrl' => url('/s/'.$space->public_id),
        ]);
    }

    /**
     * Update the specified testimonial (status flags or text edit).
     */
    public function update(UpdateTestimonialRequest $request, Space $space, Testimonial $testimonial): RedirectResponse
    {
        abort_if($testimonial->space_id !== $space->id, 404);

        $data = [];

        if ($request->has('is_favorite')) {
            $data['is_favorite'] = $request->boolean('is_favorite');
        }

        if ($request->has('is_wall_of_love')) {
            $data['is_wall_of_love'] = $request->boolean('is_wall_of_love');
        }

        if ($request->has('is_hidden')) {
            $data['is_hidden'] = $request->boolean('is_hidden');
        }

        if ($request->has('rating')) {
            $data['rating'] = $request->filled('rating') ? (int) $request->input('rating') : null;
        }

        if ($request->has('testimonial')) {
            $data['testimonial'] = trim(strip_tags((string) $request->input('testimonial')));
        }

        $testimonial->update($data);

        return back()->with('success', 'Testimonial updated successfully.');
    }

    /**
     * Soft delete the specified testimonial.
     */
    public function destroy(Request $request, Space $space, Testimonial $testimonial): RedirectResponse
    {
        Gate::authorize('delete', $testimonial);

        abort_if($testimonial->space_id !== $space->id, 404);

        $testimonial->delete();

        return back()->with('success', 'Testimonial deleted successfully.');
    }
}
