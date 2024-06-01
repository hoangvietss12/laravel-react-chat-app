import ChatLayout from '@/Layouts/ChatLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import ConversationHeader from '@/Components/ConversationHeader';
import MessageItem from '@/Components/MessageItem';
import MessageInput from '@/Components/MessageInput';
// import { useEventBus } from '@/Components/EventBus';
import axios from 'axios';

export default function Home({ messages = null, selectedConversation = null }) {
    const [localMessages, setLocalMessages] = useState([]);
    const [noMoreMessage, setNoMoreMessage] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const loadMoreIntersect = useRef(null);
    const messagesCtrRef = useRef(null);
    // const {on} = useEventBus();

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

    // const messageCreated = (message) => {
    //     if(selectedConversation &&
    //         selectedConversation.is_group &&
    //         selectedConversation.id === message.group_id
    //     ) {
    //         setLocalMessages((prevMessages) => [...prevMessages, message]);
    //     }

    //     if(selectedConversation &&
    //         selectedConversation.is_user &&
    //         selectedConversation.id === message.sender_id || selectedConversation.id === message.receiver_id
    //     ) {
    //         setLocalMessages((prevMessages) => [...prevMessages, message]);
    //     }
    // }
    // auto scroll when selectedConversation change
    useEffect(() => {
        setTimeout(() => {
            if(messagesCtrRef.current) {
                messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight
            }
        }, 10);

        // const offCreated = on('message.created', messageCreated);
        // setScrollFromBottom(0);
        // setNoMoreMessage(false);

        // return () => {
        //     offCreated();
        // }
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
                                        />
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </>
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
