import { Popover, Transition } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";
import UserAvatar from "./UserAvatar";
import { Link } from "@inertiajs/react";

export default function GroupUserPopover({users = []}) {

    return (
        <Popover className="relative">
                <>
                    <Popover.Button className="text-blue-400 hover:text-blue-200">
                        <UserIcon className="w-4" />
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute right-0 z-10 mt-3 w-[300px] px-4 sm:px-0">
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                                <div className="bg-gray-800 p-2">
                                    {users.map((user) => {
                                        return (
                                            <Link
                                                href={route('chat.user', user.id)}
                                                key={user.id}
                                                className="flex items-center gap-2 py-2 px-3 hover:bg-blue/30"
                                            >
                                                <UserAvatar user={user} />
                                                <div className="text-xs">
                                                    {user.name}
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
        </Popover>
    );
}
