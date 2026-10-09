<?php

namespace App\Http\Requests;

use App\Models\Space;
use App\Services\PlanLimitService;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSpaceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(PlanLimitService $planLimitService): bool
    {
        $user = $this->user();

        if (! $user) {
            return false;
        }

        return $planLimitService->canCreateSpace($user);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:500'],
            'ask' => ['nullable', 'string', 'max:1000'],
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', 'unique:spaces,slug'],
            'theme' => ['required', 'string', Rule::in(Space::THEMES)],
            'rating_enabled' => ['required', 'boolean'],
            'field_configuration' => [
                'nullable',
                'array',
                function (string $attribute, mixed $value, Closure $fail): void {
                    if (is_array($value) && ! Space::isValidFieldConfiguration($value)) {
                        $fail('The selected field configuration is invalid.');
                    }
                },
            ],
        ];
    }
}
