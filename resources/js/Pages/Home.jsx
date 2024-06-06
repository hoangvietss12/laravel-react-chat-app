import ChatLayout from '@/Layouts/ChatLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import ConversationHeader from '@/Components/ConversationHeader';
import MessageItem from '@/Components/MessageItem';
import MessageInput from '@/Components/MessageInput';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import AttachmentPreviewModal from '@/Components/AttachmentPreviewModal';

export default function Home({ messages = null, selectedConversation = null }) {
    const page = usePage();
    // get from inertiajs request
    const conversations = page.props.conversations;
    const user = page.props.auth.user;
    const [localMessages, setLocalMessages] = useState([]);
    const [noMoreMessage, setNoMoreMessage] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState({});
    const loadMoreIntersect = useRef(null);
    const messagesCtrRef = useRef(null);

    // preview attachments
    const onAttachmentClick = (attachments, ind) => {
        setPreviewAttachment({
            attachments,
            ind,
        });
        setShowAttachmentPreview(true);
    };

    // load more message
    const loadMoreMessages = useCallback(() => {
        if(noMoreMessage) {
            return;
        }

        const firstMessage = localMessages[0];
        axios.get(route('message.loadOlder', firstMessage.id))
            .then(({data}) => {
                if(data.data.length === 0) {
                    setNoMoreMessage(true);
                    return;
                }

                const scrollHeight = messagesCtrRef.current.scrollHeight;
                const scrollTop = messagesCtrRef.current.scrollTop;
                const clientHeight = messagesCtrRef.current.clientHeight;

                setScrollFromBottom(scrollHeight - scrollTop -clientHeight)
                setLocalMessages((prevMessages) => {
                    return [...data.data.reverse(), ...prevMessages];
                });
            })
    }, [localMessages, noMoreMessage]);

    // message events
    const messageCreated = (message) => {
        if(selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }

        if(selectedConversation &&
            selectedConversation.is_user &&
            selectedConversation.id == message.sender_id || selectedConversation.id == message.receiver_id
        ) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }
    }

    const messageDeleted = (message) => {
        if(selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ) {
            setLocalMessages((prevMessages) => {
                return prevMessages.filter((m) => m.id != message.id);
            });
        }

        if(selectedConversation &&
            selectedConversation.is_user &&
            selectedConversation.id == message.sender_id || selectedConversation.id == message.receiver_id
        ) {
            setLocalMessages((prevMessages) => {
                return prevMessages.filter((m) => m.id != message.id);
            });
        }
    }

    // handle message events
    useEffect(() => {
        setTimeout(() => {
            if(messagesCtrRef.current) {
                messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight
            }
        }, 10);

        conversations.forEach((conversation) => {
            let channel =  `message.group.${conversation.id}`;

            if(conversation.is_user) {
                channel = `message.user.${[
                    parseInt(user.id),
                    parseInt(conversation.id)
                ].sort((a, b) => a - b).join('-')}`;

            }

            window.Echo.private(channel)
                .listen("SocketMessage", (e) => {
                    messageCreated(e.message);
                    setNoMoreMessage(false);
                    setScrollFromBottom(0);
                })
                .listen("MessageDeleted", (e) => {
                    messageDeleted(e.message);
                });
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
    }, [selectedConversation]);

    // set localMessages when messages change
    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : []);
    }, [messages]);

    // handle load more message
    useEffect(() => {
        if(messagesCtrRef.current && scrollFromBottom !== null) {
            messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight - messagesCtrRef.current.offsetHeight - scrollFromBottom;
        }

        if(noMoreMessage) {
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                entry.isIntersecting && loadMoreMessages()
            })
        }, {
            rootMargin: "0px 0px 250px 0px",
        });

        if(loadMoreIntersect.current) {
            setTimeout(() => {
                observer.observe(loadMoreIntersect.current);
            }, 100)
        }

        return () => {
            observer.disconnect();
        };
    }, [localMessages]);

    return (
        <>
            {!messages && (
                <div className='flex flex-col gap-8 items-center text-center h-full opacity-35'>
                    <div className='text-2xl md:text-4xl p-16 text-black-200'>
                        Nhấn vào cuộc hội thoại để chat
                    </div>
                    <ChatBubbleLeftRightIcon  className='w-32 h-32 inline-block'/>
                </div>
            )}

            {messages && (
                <>
                    <ConversationHeader
                        selectedConversation={selectedConversation}
                    />
                    <div
                        ref={messagesCtrRef}
                        className='flex-1 overflow-y-auto p-5'
                    >
                        {localMessages.length === 0 && (
                            <div className='flex justify-center items-center h-full'>
                                <div className='text-lg text-black-200'>
                                    Không có tin nhắn nào
                                </div>
                            </div>
                        )}


                        {localMessages.length > 0 && (
                            <div className='flex-1 flex flex-col'>
                                <div ref={loadMoreIntersect}></div>
                                {localMessages.map((message) => {
                                    return (
                                        <MessageItem
                                            key={message.id}
                                            message={message}
                                            attachmentClick={onAttachmentClick}
                                        />
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </>
            )}

            {previewAttachment.attachments && (
                <AttachmentPreviewModal
                    attachments={previewAttachment.attachments}
                    index={previewAttachment.ind}
                    show={showAttachmentPreview}
                    onClose={() => setShowAttachmentPreview(false)}
                />
            )}
        </>
    );
}

Home.layout = (page) => {
    return (
        <AuthenticatedLayout
            user={page.props.auth.user}
        >
            <ChatLayout children={page} />
        </AuthenticatedLayout>
    )
};
