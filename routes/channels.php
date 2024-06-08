<?php

use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Broadcast;
use App\Models\User;

Broadcast::channel('online', function ($user) {
    return $user ? new UserResource($user) : null;
});

Broadcast::channel('message.user.{userId1}-{userId2}', function(User $user, $userId1, $userId2) {
    return $user->id === intval($userId1) || $user->id === intval($userId2) ? $user : null;
});

Broadcast::channel('message.group.{groupId}', function (User $user, $groupId) {
    return $user->groups->contains('id', $groupId) ? $user : null;
});

Broadcast::channel('group.created', function(User $user) {
    return $user ? $user : null;
});

Broadcast::channel('group.updated.{groupId}', function(User $user, $groupId) {
    return $user->groups->contains('id', $groupId) ? $user : null;
});

Broadcast::channel('group.deleted.{groupId}', function(User $user, $groupId) {
    return $user->groups->contains('id', intval($groupId)) ? $user : null;
});

Broadcast::channel('user.created', function(User $user) {
    return $user ? $user : null;
});

Broadcast::channel('user.changeRole.{userId}', function(User $user, $userId) {
    return $user ? $user : null;
});

Broadcast::channel('user.blockUnblock.{userId}', function(User $user, $userId) {
    return $user ? $user : null;
});
