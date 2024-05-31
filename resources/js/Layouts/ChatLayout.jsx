import ConversationItem from "@/Components/ConversationItem";
// import { useEventBus } from "@/Components/EventBus";
import TextInput from "@/Components/TextInput";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";


export default function ChatLayout({ children }) {
    const page = usePage();
    // get from inertiajs request
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});
    // const {on} = useEventBus();

    // check user online yet (return true/false)
    const isUserOnline = (userId) => onlineUsers[userId];

    // search conversation
    const onSearch = (e) => {
        const search = e.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation) => {
                return (
                    conversation.name.toLowerCase().includes(search)
                )
            })
        )
    };

    // display new message
    // const messageCreated = (message) => {
    //     setLocalConversations((oldUsers) => {
    //         return oldUsers.map((user) => {
    //             if(message.receiver_id &&
    //                 !user.is_group &&
    //                 (user.id === message.sender_id || user.id === message.receiver_id)
    //             ) {
    //                 user.last_message = message.message;
    //                 user.last_message_date = message.created_at;
    //                 return user;
    //             }

    //             if(message.group_id &&
    //                 user.is_group &&
    //                 user.id === message.group_id
    //             ) {
    //                 user.last_message = message.message;
    //                 user.last_message_date = message.created_at;
    //                 return user;
    //             }
    //         })
    //     })
    // }

    // useEffect(() => {
    //     const offCreated = on("message.created", messageCreated);

    //     return () => {
    //         offCreated();
    //     };
    // }, [on]);

    // sort conversation based on block_at and last_message_date
    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                if(a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                }else if(a.blocked_at) {
                    return 1;
                }else if(b.blocked_at) {
                    return -1;
                }

                if(a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(
                        a.last_message_date
                    );
                }else if(a.last_message_date) {
                    return -1;
                }else if(b.last_message_date) {
                    return 1;
                }else {
                    return 0;
                }
            })
        )
    }, [localConversations]);

    // set local conversations whenever conversations change
    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    // listen event to update onlineUser
    useEffect(() => {
        Echo.join("online")
            .here((users) => {
                const onlineUsersObj = Object.fromEntries(users.map((user) => [user.id, user]));

                setOnlineUsers((prevOnlineUsers) => {
                    return {...prevOnlineUsers, ...onlineUsersObj};
                });
            })
            .joining((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = {...prevOnlineUsers};
                    updatedUsers[user.id] = user;

                    return updatedUsers;
                });
            })
            .leaving((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = {...prevOnlineUsers};
                    delete updatedUsers[user.id];

                    return updatedUsers;
                });
            })
            .error((error) => {
                console.error("error", error);
            });

            return () => {
                Echo.leave("online");
            }
    }, []);
    // console.log(sortedConversations)
    return (
        <>
            <div className="flex-1 w-full flex overflow-hidden">
                <div
                    className={`transition-all w-full sm:w-[220px] md:w-[330px] bg-slate-800
                    flex flex-col overflow-hidden ${
                        selectedConversation ? "-ml-[100%] sm:ml-0" : ""
                    }`}
                >
                    <div className="flex items-center justify-between py-2 px-3 text-xl font-medium text-blue-200">
                        Đoạn chat
                        <div
                            className="tooltip tooltip-left"
                            data-tip="Tạo nhóm mới"
                        >
                            <button
                                className="text-blue-400 hover:text-blue-200"
                            >
                                <PencilSquareIcon className="w-4 h-4 inline-block ml-2" />
                            </button>
                        </div>
                    </div>

                    <div className="p-3">
                        <TextInput
                            onKeyUp={onSearch}
                            placeholder="Tìm kiếm bạn bè hoặc nhóm"
                            className="w-full"
                        />
                    </div>

                    <div className="flex-1 overflow-auto">
                        {sortedConversations &&
                            sortedConversations.map((conversation) => {
                                return (
                                    <ConversationItem
                                        key={`${
                                            conversation.is_group ? "group_" : "user_"
                                        }${conversation.id}`}
                                        conversation={conversation}
                                        online={!!isUserOnline(conversation.id)}
                                        selectedConversation={selectedConversation}
                                    />
                                )
                            })
                        }
                    </div>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                    {children}
                </div>
            </div>
        </>
    )
}
