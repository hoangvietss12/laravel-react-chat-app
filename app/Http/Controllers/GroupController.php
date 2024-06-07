<?php

namespace App\Http\Controllers;

use App\Events\StoreGroup;
use App\Events\UpdateGroup;
use App\Jobs\DeleteGroupJob;
use Illuminate\Http\Request;
use App\Models\Group;
use App\Http\Requests\GroupRequest;

class GroupController extends Controller
{
    public function store(GroupRequest $request) {
        $data = $request->validated();
        $user_ids = $data['user_ids'] ?? [];
        $group = Group::create($data);
        $group->users()->attach(array_unique([$request->user()->id, ...$user_ids]));

        StoreGroup::dispatch($group);
        return redirect()->back();
    }

    public function update(GroupRequest $request, Group $group) {
        $data = $request->validated();
        $user_ids = $data['user_ids'] ?? [];
        $group->update($data);

        // remove all users and attach the new users
        $group->users()->detach();
        $group->users()->attach(array_unique([$request->user()->id, ...$user_ids]));

        UpdateGroup::dispatch($group);

        return redirect()->back();
    }

    public function destroy(Group $group) {
        //check the user is owner of the group or not
        if($group->owner_id !== auth()->id()) {
            abort(403);
        }

        DeleteGroupJob::dispatch($group)->delay(now()->addSeconds(5));

        return response()->json(['message' => 'Xóa nhóm thành công!']);
    }
}
