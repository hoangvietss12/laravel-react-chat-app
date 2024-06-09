<?php

namespace App\Http\Controllers;

use App\Mail\UserBlockedUnblocked;
use App\Mail\UserRoleChanged;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Events\BlockUnblockUser;
use App\Events\ChangeRoleUser;
use App\Models\User;
use App\Events\UserCreated as UserCreatedEvent;
use App\Mail\UserCreated as UserCreatedMail;

class UserController extends Controller
{
    public function store(Request $request) {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => ['required', 'email', 'unique:users,email'],
            'is_admin' => 'boolean'
        ], [
            'name.required' => 'Tên đăng nhập không được để trống.',
            'email.required' => 'Email không được để trống.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã tồn tại trong hệ thống.',
            'is_admin.boolean' => 'Trường này phải là kiểu boolean.'
        ]);

        $password = 'hoangviet12';
        $data['password'] = bcrypt($password);
        $data['email_verified_at'] = now();

        $user = User::create($data);

        UserCreatedEvent::dispatch($user->name);

        // Mail::to($user->email)->send(new UserCreatedMail($user, $password));

        return redirect()->back();
    }

    public function changeRole(User $user) {
        $user->update(['is_admin' => !(bool) $user->is_admin]);

        ChangeRoleUser::dispatch($user->id, $user->name, $user->is_admin);

        // Mail::to($user)->send(new UserRoleChanged($user));

        return redirect()->back();
    }

    public function blockUnblock(User $user) {
        if($user->blocked_at) {
            $user->blocked_at = null;
        }else {
            $user->blocked_at = now();
        }

        $blocked_at = $user->blocked_at ? $user->blocked_at : '';

        $user->save();
        BlockUnblockUser::dispatch($user->id, $user->name, $blocked_at);

        // Mail::to($user)->send(new UserBlockedUnblocked($user));

        return redirect()->back();
    }
}
