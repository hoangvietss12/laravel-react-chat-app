<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Events\SocketMessage;
use App\Models\MessageAttachment;
use App\Models\User;
use App\Models\Group;
use App\Models\Message;
use App\Models\Conversation;

class MessageController extends Controller
{
    public function byUser(User $user) {
        $messages = Message::where('sender_id', auth()->id())->where('receiver_id', $user->id)
                            ->orWhere('sender_id', $user->id)->where('receiver_id', auth()->id())
                            ->latest()->paginate(10);

        return inertia('Home', [
            'selectedConversation' => $user->toConversationArray(),
            'messages' => MessageResource::collection($messages)
        ]);
    }

    public function byGroup(Group $group) {
        $messages = Message::where('group_id', $group->id)
                            ->latest()->paginate(10);

        return inertia('Home', [
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages)
        ]);
    }

    public function loadOlder(Message $message) {
        if($message->group_id) {
            $messages = Message::where('created_at', '<', $message->created_at)
                                ->where('group_id', $message->group_id)
                                ->latest()->paginate(10);
        }else {
            $messages = Message::where('created_at', '<', $message->created_at)
                                ->where(function ($query) use ($message) {
                                    $query->where('sender_id', $message->sender_id)
                                        ->where('receiver_id', $message->receiver_id)
                                        ->orWhere('sender_id', $message->receiver_id)
                                        ->where('receiver_id', $message->sender_id);
                                })
                                ->latest()->paginate(20);
        }

        return MessageResource::collection($messages);
    }

    public function store(StoreMessageRequest $request) {
        // store message
        $data = $request->validated();
        $data['sender_id'] = auth()->id();
        $receiver_id = $data['receiver_id'] ?? null;
        $group_id = $data['group_id'] ?? null;
        $files = $data['attachments'] ?? [];

        $message = Message::create($data);

        $attachments = [];
        if($files) {
            foreach($files as $file) {
                $directory = 'attachments/' . Str::random(32);
                Storage::makeDirectory($directory);

                $model = [
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginName(),
                    'mine' => $file->getClientMineType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($directory, 'public')
                ];

                $attachment = MessageAttachment::create($model);
                $attachments[] = $attachment;
            }

            $message->attachments = $attachments;
        }

        if($receiver_id) {
            Conversation::updateConversationWithMessage($receiver_id, auth()->id(), $message);
        }

        if($group_id) {
            Group::updateGroupWithMessage($group_id, $message);
        }

        SocketMessage::dispatch($message);

        return new MessageResource($message);
    }

    public function destroy(Message $message) {
        if($message->sender_id !== auth()->id()) {
            return response()->json(['Message' => 'Không tìm thấy'], 403);
        }

        $message->delete();

        return response('', 204);
    }
}