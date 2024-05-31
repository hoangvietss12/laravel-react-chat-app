import { Link, usePage } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import UserOptionDropDown from "./UserOptionDropdown";
import { formatMessageDateShort } from "@/helpers";

export default function ConversationItem({conversation, selectedConversation = null, online = null}) {
    const page = usePage();
    const currentUser = page.props.auth.user;
    let classes = "border-transparent";

    if(selectedConversation) {
        if(
            !selectedConversation.is_group &&
            !conversation.is_group &&
            selectedConversation.id == conversation.id
        ) {
            classes = "border-blue-500 bg-black/20";
        }

        if(
            selectedConversation.is_group &&
            conversation.is_group &&
            selectedConversation.id == conversation.id
        ) {
            classes = "border-blue-500 bg-black/20";
        }
    }

    return (
        <Link
            href={
                conversation.is_group
                ? route('chat.group', conversation)
                : route('chat.user', conversation)
            }
            preserveState
            className={
                "conversation-item flex items-center gap-2 p-2 text-gray-300 transition-all cursor-pointer border-l-4 hover:bg-black/30"
                + classes
                + (conversation.is_user && currentUser.is_admin
                    ? "pr-2"
                    : "pr-4"
                )
            }
        >
            {conversation.is_user && (
                <UserAvatar user={conversation} online={online} />
            )}

            {conversation.is_group && (
                <GroupAvatar />
            )}

            <div
                className={
                    `flex-1 text-xs max-w-full overflow-hidden`
                    + (conversation.is_user && conversation.blocked_at
                        ? " opacity-50"
                        : ""
                    )
                }
            >
                <div className="flex gap-1 justify-between items-center">
                    <h3 className="text-sm font-semibold overflow-hidden text-nowrap text-ellipsis">
                        {conversation.name}
                    </h3>
                    {conversation.last_message_date && (
                        <span className="text-nowrap">
                            {formatMessageDateShort(conversation.last_message_date)}
                        </span>
                    )}
                </div>

                {conversation.last_message && (
                    <p className="text-xs text-nowrap overflow-hidden text-ellipsis">
                        {conversation.last_message}
                    </p>
                )}
            </div>
            {currentUser.is_admin && conversation.is_user ? (
                <UserOptionDropDown conversation={conversation} />
            ) : ""}
        </Link>
    )
};

{/* <Menu as="div" className="relative inline-block text-left">
<div>
    <Menu.Button
        onClick={handleClick}
        className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/40"
    >
        <EllipsisVerticalIcon className="h-5 w-5" />
    </Menu.Button>
</div>
    <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-gray-800 shadow-lg z-50">
        <div className="px-1 py-1">
            <Menu.Item>
                {({active}) => {
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Your item action here
                        }}
                        className={`${
                            active ? "bg-black/30 text-blue" : "text-blue-100"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                        {conversation.blocked_at && (
                            <>
                                <LockOpenIcon className="w-4 h-4 mr-2" />
                                Mở chặn
                            </>
                        )}
                        {!conversation.blocked_at && (
                            <>
                                <LockClosedIcon className="w-4 h-4 mr-2" />
                                Chặn
                            </>
                        )}
                    </button>
                }}
            </Menu.Item>
        </div>
        <div className="px-1 py-1">
            <Menu.Item>
                {({active}) => {
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Your item action here
                        }}
                        className={`${
                            active ? "bg-black/30 text-blue" : "text-blue-100"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                        {conversation.is_admin && (
                            <>
                                <UserIcon className="w-4 h-4 mr-2" />
                                Thành viên
                            </>
                        )}
                        {!conversation.blocked_at && (
                            <>
                                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                                Quản trị viên
                            </>
                        )}
                    </button>
                }}
            </Menu.Item>
        </div>
    </Menu.Items>
</Menu> */}
