import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";
import { useState } from "react";

export default function UserPicker({value, options, onSelect}) {
    const [selected, setSelected] = useState(value);
    const [query, setQuery] = useState("");

    const filteredPeople = query === ""
        ? options
        : options.filter((per) =>
            per.name.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, ""))
        );

    const onSelected = (per) => {
        setSelected(per);
        onSelect(per);
    }

    return (
        <>
            <Combobox value={selected} onChange={onSelected} multiple>
                <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left
                    shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75
                    focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                        <Combobox.Input
                            className="border-blue-300 focus:border-indigo-500 focus:ring-indigo-500
                            rounded-md shadow-sm mt-1 block w-full"
                            displayValue={(per) => {
                                per.length
                                    ? `${per.length} nguời đã chọn`
                                    : ""
                            }}
                            placeholder="Thêm thành viên..."
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />
                        </Combobox.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}
                    >
                        <Combobox.Options
                            className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-blue-900 px-1
                            text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                        >
                            {filteredPeople.length === 0 && query !== "" ? (
                                <div className="relative cursor-default seelct-none px-4 py-2 text-gray-700">
                                    Không có kết quả.
                                </div>
                            ) : (
                                filteredPeople.map((per) => {
                                    return (
                                        <Combobox.Option
                                            key={per.id}
                                            value={per}
                                            className={({active}) => (
                                                `relative cursor-default select-none py-2 pl-10 pr-4
                                                ${
                                                    active ? "bg-teal-600 text-white" : "bg-gray-900 text-white"
                                                }`
                                            )}
                                        >   {per.name}
                                            {({selected, active}) => {
                                                <>
                                                    <span
                                                        className={`block truncate ${
                                                            selected ? "font-medium" : "font-normal"
                                                        }`}
                                                    >
                                                        {per.name}
                                                    </span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                                                            <CheckIcon className="h-5 w-5" aria-label="true" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            }}
                                        </Combobox.Option>
                                    )
                                })
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
            {selected && (
                <div className="flex gap-2 mt-3">
                    {selected.map((per) => {
                        return (
                            <div
                                key={per.id}
                                className="badge badge-primary gap-2"
                            >
                                {per.name}
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    );
}
