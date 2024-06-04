import { Menu, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon, LockClosedIcon, LockOpenIcon, ShieldCheckIcon, UserIcon } from "@heroicons/react/24/solid"
import axios from "axios"

export default function MessageOptionDropdown({message}) {
    const onMessageDelete = () => {
        axios.delete(route('message.destroy', message.id))
            .then((res) => {

            })
            .catch((err) => {

            });
    }

    return (
        <div className="absolute right-full text-gray-100 top-1/2 -translate-y-1/2 z-10">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button
                        onClick={handleClick}
                        className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/40"
                    >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                    </Menu.Button>
                </div>
                <Menu.Items className="absolute left-0 mt-2 w-48 rounded-md bg-gray-800 shadow-lg z-50">
                    <div className="py-1 px-1">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={`${
                                        active ? "bg-black/30 text-blue" : "text-blue-100"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    onClick={onMessageDelete}
                                >
                                    <TrashIcon className="w-4 h-4 mr-2 text-red-500" />
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Menu>
        </div>
    )
}