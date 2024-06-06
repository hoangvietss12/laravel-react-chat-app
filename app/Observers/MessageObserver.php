<?php

namespace App\Observers;

use Illuminate\Support\Facades\Storage;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Group;


class MessageObserver
{
    public function deleting(Message $message) {
        //delete message's attachment
        $message->attachments->each(function ($attachment) {
            $dir = dirname($attachment->path);
            Storage::disk('public')->deleteDirectory($dir);
        });

        $message->attachments()->delete();

        // update group and conversation's last message if the message is the last message
        if($message->group_id) {
            $group = Group::where('last_message_id', $message->id)->first();

            if($group) {
                $prev_message = Message::where('group_id', $message->group_id)
                                        ->where('id', '!=', $message->id)
                                        ->latest()
                                        ->limit(1)
                                        ->first();

                if($prev_message) {
                    $group->last_message_id = $prev_message->id;
                    $group->save();
                }
            }
        }else {
            $conversation = Conversation::where('last_message_id', $message->id)->first();

            if($conversation) {
                $prev_message = Message::where(function ($query) use ($message) {
                                    $query->where('sender_id', $message->sender_id)
                                        ->where('receiver_id', $message->receiver_id)
                                        ->orWhere('sender_id', $message->receiver_id)
                                        ->where('receiver_id', $message->sender_id);
                                })
                                ->where('id', '!=', $message->id)
                                ->latest()
                                ->limit(1)
                                ->first();

                if($prev_message) {
                    $conversation->last_message_id = $prev_message->id;
                    $conversation->save();
                }

            }
        }
    }
}
