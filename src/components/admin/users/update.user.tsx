import { useEffect, useState } from 'react';
import {
    App,
    Divider,
    Form,
    Input,
    Modal,
    Select,
    Upload,
    Button,
    Image,
    Spin
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { updateUserAPI, uploadFileAPI, callFetchRoles, getUserByIdAPI } from '@/services/api';
import type { RcFile, UploadFile } from 'antd/es/upload';

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: IUserTable | null) => void;
    dataUpdate: IUserTable | null;
}

type FieldType = {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    address: string;
    gender: string;
    age: string;
    roleId: string;
    avatar?: UploadFile[];
};

const UpdateUser = (props: IProps) => {
    const {
        openModalUpdate,
        setOpenModalUpdate,
        refreshTable,
        setDataUpdate,
        dataUpdate
    } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();

    const [avatarFile, setAvatarFile] = useState<UploadFile | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [roleList, setRoleList] = useState<IRole[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(false);

    const normFile = (e: any) => Array.isArray(e) ? e : e?.fileList;

    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview && file.originFileObj) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }
        setPreviewImage(file.preview as string);
    };

    const handleUploadAvatar = async (options: RcCustomRequestOptions) => {
        const { file, onSuccess, onError } = options;
        try {
            const res = await uploadFileAPI(file as File, 'avatars');
            if (res && res.data) {
                const uploadedUrl = `${import.meta.env.VITE_BACKEND_URL}/upload/avatars/${res.data.fileName}`;
                const uploadedFile: UploadFile = {
                    uid: (file as RcFile).uid,
                    name: res.data.fileName,
                    status: 'done',
                    url: uploadedUrl,
                    thumbUrl: uploadedUrl,
                    originFileObj: file as RcFile
                };
                setAvatarFile(uploadedFile);
                await handlePreview(uploadedFile);
                setTimeout(() => {
                    onSuccess?.("ok", uploadedFile as any);
                }, 100);
            } else {
                onError?.(new Error(res?.message || "Upload failed"));
            }
        } catch (err: any) {
            onError?.(err);
        }
    };

    useEffect(() => {
        const fetchRoles = async () => {
            setLoadingRoles(true);
            const res = await callFetchRoles("page=1&pageSize=100");
            if (res?.data?.result) {
                setRoleList(res.data.result);
            }
            setLoadingRoles(false);
        };
        fetchRoles();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (dataUpdate?.id) {
                const res = await getUserByIdAPI(dataUpdate.id);
                if (res && res.data) {
                    const user = res.data;
                    form.setFieldsValue({
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        name: user.name,
                        address: user.address,
                        gender: user.gender ?? undefined,
                        age: user.age,
                        roleId: user.role?.id ? Number(user.role.id) : undefined,
                    });

                    if (user.avatar) {
                        const avatarUrl = user.avatar.startsWith("http")
                            ? `${user.avatar}?t=${Date.now()}`
                            : `${import.meta.env.VITE_BACKEND_URL}/upload/avatars/${user.avatar}`;
                        const file: UploadFile = {
                            uid: '-1',
                            name: user.avatar,
                            status: 'done',
                            url: avatarUrl,
                            thumbUrl: avatarUrl
                        };
                        setAvatarFile(file);
                        setPreviewImage(avatarUrl);
                    }
                }
            }
        };

        if (openModalUpdate) {
            fetchData();
        }
    }, [dataUpdate, openModalUpdate]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { id, firstName, lastName, name, address, gender, age, roleId } = values;
        setIsSubmit(true);
        const avatarBase64 = avatarFile?.originFileObj
            ? await getBase64(avatarFile.originFileObj as RcFile)
            : '';
        const res = await updateUserAPI(
            id,
            firstName,
            lastName,
            name,
            address,
            gender,
            age,
            roleId,
            avatarBase64
        );
        if (res && res.data) {
            message.success('Cập nhật user thành công');
            form.resetFields();
            setOpenModalUpdate(false);
            setDataUpdate(null);
            setAvatarFile(null);
            setPreviewImage("");
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            });
        }
        setIsSubmit(false);
    };

    return (
        <Modal
            title="Cập nhật người dùng"
            open={openModalUpdate}
            onOk={() => form.submit()}
            onCancel={() => {
                setOpenModalUpdate(false);
                setDataUpdate(null);
                form.resetFields();
                setAvatarFile(null);
                setPreviewImage("");
            }}
            okText="Cập nhật"
            cancelText="Hủy"
            confirmLoading={isSubmit}
        >
            <Divider />
            <Form
                form={form}
                name="form-update"
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item<FieldType> hidden label="id" name="id">
                    <Input disabled />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Tên"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Giới tính"
                    name="gender"
                    rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                >
                    <Select placeholder="Chọn giới tính" allowClear>
                        <Select.Option value="MALE">Nam</Select.Option>
                        <Select.Option value="FEMALE">Nữ</Select.Option>
                        <Select.Option value="OTHER">Khác</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item<FieldType>
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Tuổi"
                    name="age"
                    rules={[{ required: true, message: 'Vui lòng nhập số tuổi!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Role"
                    name="roleId"
                    rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                >
                    <Select placeholder="Chọn vai trò" loading={loadingRoles} allowClear>
                        {roleList.map(role => (
                            <Select.Option key={role.id} value={Number(role.id)}>
                                {role.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item<FieldType>
                    label="Avatar"
                    name="avatar"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                >
                    <Upload
                        listType="picture"
                        maxCount={1}
                        customRequest={handleUploadAvatar}
                        fileList={avatarFile ? [avatarFile] : []}
                        onRemove={() => {
                            setAvatarFile(null);
                            setPreviewImage("");
                        }}
                        onPreview={handlePreview}
                        accept="image/*"
                    >
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                </Form.Item>
                {previewImage && (
                    <Image
                        width={100}
                        src={previewImage}
                        style={{ marginTop: 10, borderRadius: 4 }}
                        preview={false}
                    />
                )}
            </Form>
        </Modal>
    );
};

export default UpdateUser;
