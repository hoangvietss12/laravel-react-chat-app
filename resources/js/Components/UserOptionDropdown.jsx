import { Menu, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon, LockClosedIcon, LockOpenIcon, ShieldCheckIcon, UserIcon } from "@heroicons/react/24/solid"
import axios from "axios"
import { Fragment } from "react"

export default function UserOptionsDropdown({ conversation }) {
    const handleClick = (event) => {
        event.stopPropagation();
    };

    const changeUserRole = () => {
        if(!conversation.is_user) {
            return;
        }

        axios.post(route('user.changeRole', conversation.id))
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const onBlockUser = () => {
        if(!conversation.is_user) {
            return;
        }

        axios.post(route('user.blockUnblock', conversation.id))
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button
                    onClick={handleClick}
                    className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/40"
                >
                    <EllipsisVerticalIcon className="h-5 w-5" />
                </Menu.Button>
            </div>
            <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-gray-800 shadow-lg z-50">
                <div className="py-1 px-1">
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                className={`${
                                    active ? "bg-black/30 text-blue" : "text-blue-100"
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                onClick={onBlockUser}
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
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                className={`${
                                    active ? "bg-black/30 text-blue" : "text-blue-100"
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                onClick={changeUserRole}
                            >
                                {conversation.is_admin && (
                                    <>
                                        <UserIcon className="w-4 h-4 mr-2" />
                                        Thành viên
                                    </>
                                )}
                                {!conversation.is_admin && (
                                    <>
                                        <ShieldCheckIcon className="w-4 h-4 mr-2" />
                                        Quản trị viên
                                    </>
                                )}
                            </button>
                        )}
                    </Menu.Item>
                </div>
            </Menu.Items>
        </Menu>
    )
};
