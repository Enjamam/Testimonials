<?php

namespace App\Http\Requests;

use App\Models\Testimonial;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateTestimonialRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var Testimonial|null $testimonial */
        $testimonial = $this->route('testimonial');

        return $testimonial !== null && $this->user()?->can('update', $testimonial);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'is_favorite' => ['sometimes', 'boolean'],
            'is_wall_of_love' => ['sometimes', 'boolean'],
            'is_hidden' => ['sometimes', 'boolean'],
            'testimonial' => ['sometimes', 'string', 'min:3', 'max:5000'],
            'rating' => ['nullable', 'integer', 'between:1,5'],
        ];
    }

    /**
     * Configure the validator instance with business invariant checks.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            /** @var Testimonial|null $testimonial */
            $testimonial = $this->route('testimonial');

            if ($testimonial && $this->boolean('is_wall_of_love')) {
                if (! $testimonial->consent_given) {
                    $validator->errors()->add(
                        'is_wall_of_love',
                        'Cannot add to Wall of Love: the respondent did not grant consent for public display.'
                    );
                }
            }
        });
    }
}
