import {Link, usePage} from '@inertiajs/react';
import UserAvatar from './UserAvatar';
import GroupAvatar from './GroupAvatar';
import { ArrowLeftIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import GroupUserPopover from './GroupUserPopover';
import GroupDescriptionPopover from './GroupDescriptionPopover';
import GroupModal from './GroupModal';
import { useState } from 'react';

export default function ConversationHeader({selectedConversation}) {
    const authUser = usePage().props.auth.user;
    const [showGroupModal, setShowGroupModal] = useState(false);

    const onDeleteGroup = () => {
        if(!window.confirm("Bạn chắc chắn muốn xóa nhóm này không?")) {
            return;
        }

        axios.delete(route('group.destroy', selectedConversation.id))
            .then((res) => {
                console.log(res.data.message);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    return (
        <>
            {selectedConversation && (
                <div className='p-3 flex justify-between items-center border-b border-slate-700'>
                    <div className='flex items-center gap-3'>
                        <Link
                            href={route('dashboard')}
                            className='inline-block sm:hidden'
                        >
                            <ArrowLeftIcon className='w-6'/>
                        </Link>
                        {selectedConversation.is_user && (
                            <UserAvatar user={selectedConversation} />
                        )}
                        {selectedConversation.is_group && (
                            <GroupAvatar />
                        )}
                        <div>
                            <h3>{selectedConversation.name}</h3>
                            {selectedConversation.is_group && (
                                <p className='text-xs text-blue-500'>
                                    {selectedConversation.users.length} thành viên
                                </p>
                            )}
                        </div>
                    </div>

                    {selectedConversation.is_group && (
                        <div className='flex gap-3'>
                            <GroupDescriptionPopover
                                description={selectedConversation.description}
                            />
                            <GroupUserPopover
                                users={selectedConversation.users}
                            />
                            {selectedConversation.owner_id == authUser.id && (
                                <>
                                    <div className='tooltip tooltip-left' data-tip='Chỉnh sửa nhóm'>
                                        <button
                                            onClick={() => setShowGroupModal(true)}
                                            className='text-blue-400 hover:text-blue-200'
                                        >
                                            <PencilSquareIcon className='w-4' />
                                        </button>
                                    </div>
                                    <div className='tooltip tooltip-left' data-tip='Xóa nhóm'>
                                        <button
                                            onClick={onDeleteGroup}
                                            className='text-blue-400 hover:text-blue-200'
                                        >
                                            <TrashIcon className='w-4' />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
            {selectedConversation.is_group && (
                <GroupModal
                    show={showGroupModal}
                    onClose={() => setShowGroupModal(false)}
                    selectedConversation={selectedConversation}
                />
            )}
        </>
    );
};
