import { Menu, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon, TrashIcon  } from "@heroicons/react/24/solid"
import axios from "axios"

export default function MessageOptionDropdown({message}) {
    const onMessageDelete = () => {
        axios.delete(route('message.destroy', message.id))
            .then((res) => {
                console.log(message);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="absolute right-full text-gray-100 top-1/2 -translate-y-1/2 z-10">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button
                        className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/40"
                    >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                    </Menu.Button>
                </div>
                <Menu.Items className="absolute left-0 mt-2 w-24 rounded-md bg-black shadow-lg z-50">
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
                                    Xóa
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Menu>
        </div>
    )
}
