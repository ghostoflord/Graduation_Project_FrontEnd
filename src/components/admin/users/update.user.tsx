import { useEffect, useState } from 'react';
import { App, Divider, Form, Input, Modal, Select } from 'antd';
import type { FormProps } from 'antd';
import { updateUserAPI } from '@/services/api';

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: IUserTable | null) => void;
    dataUpdate: IUserTable | null;
}

type FieldType = {
    id: string,
    firstName: string,
    lastName: string,
    name: string,
    address: string,
    gender: string,
    age: string
};

const UpdateUser = (props: IProps) => {
    const { openModalUpdate, setOpenModalUpdate, refreshTable,
        setDataUpdate, dataUpdate
    } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    // https://ant.design/components/form#components-form-demo-control-hooks
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                id: dataUpdate.id,
                firstName: dataUpdate.firstName,
                name: dataUpdate.name,
                lastName: dataUpdate.lastName,
                address: dataUpdate.address,
                gender: dataUpdate.gender,
                age: dataUpdate.age,
            })
        }
    }, [dataUpdate])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { id, firstName, lastName, name, address, gender, age } = values;
        setIsSubmit(true)
        const res = await updateUserAPI(id, firstName, lastName, name, address, gender, age);
        if (res && res.data) {
            message.success('Cập nhật user thành công');
            form.resetFields();
            setOpenModalUpdate(false);
            setDataUpdate(null);
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false)
    };

    return (
        <>

            <Modal
                title="Cập nhật người dùng"
                open={openModalUpdate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    setDataUpdate(null);
                    form.resetFields();
                }}
                okText={"Cập nhật"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
            >
                <Divider />

                <Form
                    form={form}
                    name="form-update"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        hidden
                        labelCol={{ span: 24 }}
                        label="id"
                        name="id"
                        rules={[
                            { required: true, message: 'Vui lòng nhập id!' },

                        ]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Ten"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập ten !' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Giới tính"
                        name="gender"
                        rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                    >
                        <Select
                            placeholder="Chọn giới tính"
                            allowClear
                            style={{ width: '100%' }}
                        >
                            <Select.Option value="male">MALE</Select.Option>
                            <Select.Option value="female">FEMALE</Select.Option>
                            <Select.Option value="other">OTHER</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ !' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateUser;