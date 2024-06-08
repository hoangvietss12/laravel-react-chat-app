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
        const sender = message.sender ?? null;
        const groupId = message.group_id ?? null;
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
            // listen action message
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

            // listen action group
            if(conversation.is_group) {
                window.Echo.private(`group.deleted.${conversation.id}`)
                    .listen("GroupDeleted", (e) => {
                        toastMessage({message: `Nhóm "${e.name}" đã bị xóa!`});
                    })
                    .error((e) => {
                        console.error(e);
                    });

                window.Echo.private(`group.updated.${conversation.id}`)
                    .listen("UpdateGroup", (e) => {
                        toastMessage({message: `Nhóm "${e.group.name}" đã cập nhật thành công!`});
                    })
                    .error((e) => {
                        console.error(e);
                    });
            }

            // listen action user
            if(conversation.is_user) {
                window.Echo.private(`user.blockUnblock.${conversation.id}`)
                    .listen("BlockUnblockUser", (e) => {
                        toastMessage({message:
                            e.blocked_at
                            ? `Tài khoản "${e.name}" đã bị khóa!`
                            : `Tài khoản "${e.name}" đã được active!`
                        });
                    })
                    .error((e) => {
                        console.error(e);
                    });

                window.Echo.private(`user.changeRole.${conversation.id}`)
                    .listen("ChangeRoleUser", (e) => {
                        toastMessage({message:
                            e.is_admin
                            ? `Tài khoản "${e.name}" đã có quyền quản trị!`
                            : `Tài khoản "${e.name}" đã bị thu hồi quyền quản trị!`
                        });
                    })
                    .error((e) => {
                        console.error(e);
                    });
            }
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

                if(conversation.is_group) {
                    window.Echo.leave(`group.updated.${conversation.id}`);
                    window.Echo.leave(`group.deleted.${conversation.id}`);
                }

                if(conversation.is_user) {
                    window.Echo.leave(`user.changeRole.${conversation.id}`);
                    window.Echo.leave(`user.blockUnblock.${conversation.id}`);
                }
            });
        }
    }, [conversations]);

    useEffect(() => {
            window.Echo.private('group.created')
                .listen("StoreGroup", (e) => {
                    toastMessage({message: `Nhóm ${e.group.name} tạo thành công!`});
                })
                .error((e) => {
                    console.error(e);
                });

                window.Echo.private('user.created')
                .listen("UserCreated", (e) => {
                    toastMessage({message: `Tài khoản ${e.name} đã thêm thành công!`});
                })
                .error((e) => {
                    console.error(e);
                });

        return () => {
            window.Echo.leave('group.created');
            window.Echo.leave('user.created');
        }
    }, []);

    return (
        <div className="toast toast-top toast-center min-w-[280px] w-full xs:w-auto">
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
