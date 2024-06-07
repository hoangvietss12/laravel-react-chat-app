import { useForm, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { useState } from "react";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";
import InputLabel from "./InputLabel";
import TextInput from "./TextInput";
import InputError from "./InputError";
import TextAreaInput from "./TextAreaInput";
import UserPicker from "./UserPicker";
import Modal from "./Modal";

export default function GroupModal({show, selectedConversation = null ,onClose = () => {}}) {
    const page = usePage();
    const conversations = page.props.conversations;
    const [group, setGroup] = useState({});

    const {data, setData, processing, reset, post, put, errors } = useForm({
        id: "",
        name: "",
        description: "",
        user_ids: []
    });

    const users = conversations.filter((c) => !c.is_group);

    const createOrUpdateGroup = (e) => {
        e.preventDefault();

        if(group.id) {
            put(route('group.update', group.id), {
                onSuccess: () => {
                    closeModal();
                }
            });

            return;
        }

        post(route('group.store'), {
            onSuccess: () => {
                closeModal();
            }
        })
    }

    const closeModal = () => {
        reset();
        onClose();
    }

    useEffect(() => {
        if(selectedConversation) {
            setData({
                name: selectedConversation.name,
                description: selectedConversation.description,
                user_ids: selectedConversation.users.filter((u) => selectedConversation.owner_id != u.id).map((u) => u.id)
            });
            setGroup(selectedConversation);
        }
    }, [selectedConversation])

    return (
        <Modal show={show} onClose={closeModal}>
            <form
                onSubmit={createOrUpdateGroup}
                className="p-6 overflow-y-auto"
            >
                <h2 className="text-xl font-medium text-blue-900">
                    {group.id ? `Sửa thông tin nhóm ${group.name}` : "Tạo nhóm mới"}
                </h2>

                <div className="mt-8">
                    <InputLabel htmlFor="name" value="Tên nhóm" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        disabled={!!group.id}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="description" value="Mô tả" />
                    <TextAreaInput
                        id="description"
                        rows="3"
                        className="mt-1 block w-full"
                        value={data.description || ""}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.description} />
                </div>
                <div className="mt-4">
                    <InputLabel value="Thêm thành viên" />
                    <UserPicker
                        value={
                            users.filter((u) =>
                                group.owner_id != u.id &&
                                data.user_ids.includes(u.id)
                            ) || []
                        }
                        options={users}
                        onSelect={(users) => {
                            setData(
                                "user_ids",
                                users.map((u) => u.id)
                            )
                        }}
                    />
                    <InputError className="mt-2" message={errors.user_ids} />
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={closeModal}>
                        Hủy
                    </SecondaryButton>

                    <PrimaryButton className="ms-3" disabled={processing}>
                        {group.id ? "Cập nhật" : "Tạo mới"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
