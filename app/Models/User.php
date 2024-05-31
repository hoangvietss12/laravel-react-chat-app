<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'avatar',
        'email',
        'email_verified_at',
        'password',
        'is_admin'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function groups() {
        return $this->belongsToMany(Group::class, 'group_users');
    }
    public static function getUsersExceptUser(User $user) {
        $user_id = $user->id;

        // get all conversation when other users is not blocked by this user
        $query = User::select([
                                'users.*',
                                'messages.message as last_message',
                                'messages.created_at as last_message_date'
                            ])
                    ->where('users.id', '!=', $user_id)
                    ->when(!$user->is_admin, function ($query) {
                        $query->whereNull('users.blocked_at');
                    })
                    ->leftJoin('conversations', function ($join) use ($user_id) {
                        $join->on('conversations.user_id1', '=', 'users.id')
                            ->where('conversations.user_id2', '=', $user_id)
                            ->orWhere(function ($query) use ($user_id) {
                                $query->on('conversations.user_id2', '=', 'users.id')
                                    ->where('conversations.user_id1', '=', $user_id);
                            });
                    })
                    ->leftJoin('messages', 'messages.id', '=', 'conversations.last_message_id')
                    ->orderByRaw('IFNULL(users.blocked_at, 1)')
                    ->orderBy('messages.created_at', 'desc')
                    ->orderBy('users.name');

        return $query->get();
    }

    public function toConversationArray() {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'is_group' => false,
            'is_user' => true,
            'is_admin' => (bool) $this->is_admin,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'blocked_at' => $this->blocked_at
        ];
    }
}
