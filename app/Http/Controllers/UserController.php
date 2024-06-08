<?php

namespace App\Http\Controllers;

use App\Events\BlockUnblockUser;
use App\Events\ChangeRoleUser;
use App\Events\UserCreated;
use Illuminate\Http\Request;
use App\Models\User;

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

        UserCreated::dispatch($user->name);

        return redirect()->back();
    }

    public function changeRole(User $user) {
        $user->update(['is_admin' => !(bool) $user->is_admin]);

        ChangeRoleUser::dispatch($user->id, $user->name, $user->is_admin);

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

        return redirect()->back();
    }
}
