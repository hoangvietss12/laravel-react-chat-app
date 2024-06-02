import { FaceSmileIcon, HandThumbUpIcon, PaperAirplaneIcon, PaperClipIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import NewMessageInput from './NewMessageInput';
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';

export default function MessageInput({conversation = null}) {
    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [messageSending, setMessageSending] = useState(false);

    const onLikeClick = () => {
        if(newMessage) {
            return;
        }

        const data = {
            message: "👍"
        }

        if(conversation.is_user) {
            data["receiver_id"] = conversation.id;
        }else {
            data["group_id"] = conversation.id;

        }

        axios.post(route("message.store", data));
    };

    // handle event click send message
    const onSend = () => {
        if(messageSending) {
            return;
        }

        // check message is null or not
        if(newMessage.trim === "") {
            setInputErrorMessage("Hãy nhập vào gì đó đã!");
            console.log(inputErrorMessage)
            setTimeout(() => {
                setInputErrorMessage("");
            }, 3000);
            return;
        }

        // create form data to store message data
        const formData = new FormData();
        formData.append("message", newMessage);
        if(conversation.is_user) {
            formData.append("receiver_id", conversation.id);
        }else {
            formData.append("group_id", conversation.id);
        }

        setMessageSending(true);
        // call route message store
        axios.post(route('message.store'), formData, {
            onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                    (progressEvent.loaded / progressEvent.total) * 100
                );
            }
        }).then((response) => {
            setNewMessage("");
            setMessageSending(false);
        }).catch((err) => {
            setMessageSending(false);
        });
    }
    // console.log(newMessage)

    return (
        <div className="flex flex-wrap items-start border-t border-slate-700 py-3">
            <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2">
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PaperClipIcon className="w-6" />
                    <input
                        type="file"
                        multiple
                        className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PhotoIcon className="w-6" />
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
            </div>
            <div className="order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative">
                <div className="flex">
                    <NewMessageInput
                        value={newMessage}
                        onSend={onSend}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        onClick={onSend}
                        className="btn btn-info rounded-l-none"
                        disabled={messageSending}
                    >
                        {messageSending && (
                            <span className="loading loading-spinner loading-xs"></span>
                        )}
                        <PaperAirplaneIcon className="w-6" />
                        <span className="hidden sm:inline">Gửi</span>
                    </button>
                </div>
                {inputErrorMessage && (
                    <p className="text-xs text-red-400">{inputErrorMessage}</p>
                )}
            </div>
            <div className="order-3 xs:order-3 p-2 flex">
                <Popover className="relative">
                    <Popover.Button className="p-1 text-blue-400 hover:text-blue-300">
                        <FaceSmileIcon className="w-6 h-6" />
                    </Popover.Button>
                    <Popover.Panel className="absolute z-10 right-0 bottom-full">
                    <EmojiPicker
                        onEmojiClick={(e) => {
                            setNewMessage(newMessage + e.emoji)
                        }}
                    >

                    </EmojiPicker>
                    </Popover.Panel>
                </Popover>

                <button onClick={onLikeClick} className="p-1 text-blue-400 hover:text-blue-300">
                    <HandThumbUpIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}

