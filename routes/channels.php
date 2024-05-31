<?php

use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Broadcast;
use App\Models\User;

Broadcast::channel('online', function (User $user) {
    return $user ? new UserResource($user) : null;
});
