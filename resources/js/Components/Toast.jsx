import { usePage, Link } from "@inertiajs/react";
import { useEffect } from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import UserAvatar from "./UserAvatar";

export default function Toast({}) {
    const page = usePage();
    const conversations = page.props.conversations;
    const user = page.props.auth.user;
    const [toasts, setToasts] = useState([]);

    const toastMessage = (message) => {
        const uuid = uuidv4();
        const sender = message.sender;
        const groupId = message.group_id;
        const newMessage = message.message || `Đã chia sẻ ${
            message.attachments.length === 1
            ? "một file đính kèm"
            : message.attachments.length + " nhiều file đính kèm"
        }`;

        setToasts((oldToasts) => [...oldToasts, {newMessage, uuid, user, groupId}]);

        setTimeout(() => {
            setToasts((oldToasts) =>
                oldToasts.filter((toast) => toast.uuid !== uuid)
            );
        }, 5000)
    }

    useEffect(() => {
        conversations.forEach((conversation) => {
            let channel = `message.group.${conversation.id}`;

            if(conversation.is_user) {
                channel = `message.user.${[
                    parseInt(user.id),
                    parseInt(conversation.id)
                ].sort((a, b) => a - b).join("-")}`
            }

            window.Echo.private(channel)
                .listen("SocketMessage", (e) => {
                    toastMessage(e.message)
                })
        });

        return () => {
            conversations.forEach((conversation) => {
                let channel = `message.group.${conversation.id}`;

                if(conversation.is_user) {
                    channel = `message.user.${[
                        parseInt(user.id),
                        parseInt(conversation.id)
                    ].sort((a, b) => a - b).join('-')}`;
                }
                window.Echo.leave(channel);
            });
        }
    }, [conversations]);

    return (
        <div className="toast toast-top toast-center min-w-[240px]">
            {toasts.map((toast) => {
                return (
                    <div
                        key={toast.uuid}
                        className="alert alert-success py-3 px-4 text-gray-100 rounded-lg"
                    >
                        <Link
                            href={
                                toast.groupId
                                    ? route('chat.group', toast.groupId)
                                    : route('chat.user', toast.user.id)
                            }
                            className="flex items-center gap-2"
                        >
                            <UserAvatar user={toast.user} />
                            <span>{toast.newMessage}</span>
                        </Link>
                    </div>
                )
            })}
        </div>
    )
}
