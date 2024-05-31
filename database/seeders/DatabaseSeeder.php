<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use App\Models\Group;
use App\Models\Message;
Use App\Models\User;
use App\Models\Conversation;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // fake data users
        User::factory()->create([
            'name' => 'Hoàng Việt',
            'email' => 'hoangviet@gmail.com',
            'password' => bcrypt('hoangviet12'),
            'is_admin' => true
        ]);

        User::factory()->create([
            'name' => 'Đức Hải',
            'email' => 'nguyenduchai@gmail.com',
            'password' => bcrypt('hoangviet12'),
        ]);

        User::factory(10)->create();

        // fake data group
        for($i = 0; $i < 5; $i++) {
            $group = Group::factory()->create([
                'owner_id' => 1
            ]);

            // get random 2 to 5 users and add them to this group
            $users = User::inRandomOrder()->limit(rand(2, 5))->pluck('id');
            $group->users()->attach(array_unique([1, ...$users]));
        }

        // fake data message
        Message::factory(100)->create();
        $messages = Message::whereNull('group_id')->orderBy('created_at')->get();

        // fake data conservation
        $conversations = $messages->groupBy(function ($message) {
            // group sender and receiver users
            return collect([$message->sender_id, $message->receiver_id])->sort()->implode('_');
        })->map(function ($groupedMessages) {
            return [
                'user_id1' => $groupedMessages->first()->sender_id,
                'user_id2' => $groupedMessages->first()->receiver_id,
                'last_message_id' => $groupedMessages->last()->id,
                'created_at' => new Carbon(),
                'updated_at' => new Carbon(),
            ];
        })->values();

        Conversation::insertOrIgnore($conversations->toArray());
    }
}
