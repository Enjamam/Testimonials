<?php

namespace Database\Seeders;

use App\Models\Space;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
            ]
        );

        $space = Space::updateOrCreate(
            ['id' => 1],
            [
                'user_id' => $user->id,
                'name' => 'CloudScale DevOps',
                'title' => 'How has CloudScale empowered your engineering team?',
                'subtitle' => 'Join hundreds of engineering leaders sharing how automated infrastructure and fast deployments revolutionized developer velocity.',
                'ask' => 'What was the biggest bottleneck in your delivery pipeline before CloudScale, and how much time has your team saved?',
                'slug' => 'cloudscale-devops',
                'theme' => 'minimal-light',
                'rating_enabled' => true,
                'field_configuration' => [
                    'name' => ['enabled' => true, 'required' => true],
                    'email' => ['enabled' => true, 'required' => true],
                    'company_name' => ['enabled' => true, 'required' => false],
                    'social_url' => ['enabled' => true, 'required' => false],
                    'profile_photo' => ['enabled' => true, 'required' => false],
                ],
            ]
        );

        // Ensure public_id is set if not already
        if (empty($space->public_id)) {
            $space->public_id = 'spc_'.strtolower(Str::random(16));
            $space->save();
        }

        Testimonial::where('space_id', $space->id)->delete();

        Testimonial::create([
            'space_id' => $space->id,
            'name' => 'Sarah Chen',
            'email' => 'sarah.chen@scaleops.io',
            'company_name' => 'VP of Engineering at ScaleOps',
            'social_url' => 'https://linkedin.com/in/sarahchen',
            'testimonial' => 'CloudScale slashed our CI/CD pipeline runtime from 45 minutes to under 4 minutes. Our engineering teams now ship safely multiple times per day with zero downtime incidents.',
            'rating' => 5,
            'consent_given' => true,
            'is_favorite' => true,
            'is_wall_of_love' => true,
            'is_hidden' => false,
            'submitted_at' => now()->subDays(2),
        ]);

        Testimonial::create([
            'space_id' => $space->id,
            'name' => 'Marcus Vance',
            'email' => 'marcus@hyperdrive.tech',
            'company_name' => 'Principal Architect at HyperDrive',
            'social_url' => 'https://x.com/marcusvance',
            'testimonial' => 'The developer experience is unmatched. Automated observability and intuitive config cut our mean-time-to-resolution by over 60%. Highly recommend it to any high-growth engineering organization.',
            'rating' => 5,
            'consent_given' => true,
            'is_favorite' => true,
            'is_wall_of_love' => true,
            'is_hidden' => false,
            'submitted_at' => now()->subDay(),
        ]);

        Testimonial::create([
            'space_id' => $space->id,
            'name' => 'Elena Rostova',
            'email' => 'elena@synthetixlabs.com',
            'company_name' => 'CTO at Synthetix Labs',
            'social_url' => 'https://linkedin.com/in/elenarostova',
            'testimonial' => 'Migrating our fleet over was extraordinarily smooth. The infrastructure cost savings alone paid for the service in our very first billing cycle.',
            'rating' => 5,
            'consent_given' => true,
            'is_favorite' => false,
            'is_wall_of_love' => true,
            'is_hidden' => false,
            'submitted_at' => now()->subHours(6),
        ]);
    }
}
