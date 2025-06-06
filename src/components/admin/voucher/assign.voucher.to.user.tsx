import { useEffect, useState } from "react";
import { App, Button, Form, Modal, Select, Spin } from "antd";
import { assignVoucherToUserAPI, getAllVouchersAPI, getUsersAPI } from "@/services/api";
import type { IUserTable, IVoucher, IModelPaginate } from "@/types";

interface IProps {
    openModalAssign: boolean;
    setOpenModalAssign: (v: boolean) => void;
    refreshTable: () => void;
}

interface AssignFormType {
    userId: number;
    voucherId: number;
}

const AssignVoucherToUser = ({ openModalAssign, setOpenModalAssign, refreshTable }: IProps) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [isSubmit, setIsSubmit] = useState(false);
    const [loading, setLoading] = useState(false);

    const [users, setUsers] = useState<IUserTable[]>([]);
    const [vouchers, setVouchers] = useState<IVoucher[]>([]);

    const fetchUsers = async () => {
        try {
            const res = await getUsersAPI("page=1&limit=1000");
            if (res.data && Array.isArray(res.data.result)) {
                setUsers(res.data.result);
            }
        } catch (error) {
            message.error("Không thể tải danh sách người dùng");
        }
    };

    const fetchVouchers = async () => {
        try {
            const res = await getAllVouchersAPI();
            if (res.data) {
                setVouchers(res.data);
            }
        } catch (error) {
            message.error("Không thể tải danh sách voucher");
        }
    };

    useEffect(() => {
        if (openModalAssign) {
            setLoading(true);
            Promise.all([fetchUsers(), fetchVouchers()]).finally(() => setLoading(false));
        }
    }, [openModalAssign]);

    const onFinish = async (values: AssignFormType) => {
        setIsSubmit(true);
        try {
            const res = await assignVoucherToUserAPI(values.voucherId, values.userId);
            if (res?.data) {
                message.success("Gán voucher thành công");
                form.resetFields();
                setOpenModalAssign(false);
                refreshTable();
            } else {
                message.error(res?.data?.message || "Gán voucher thất bại");
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi gọi API");
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <Modal
            title="Gán Voucher cho Người dùng"
            open={openModalAssign}
            onOk={() => form.submit()}
            onCancel={() => {
                form.resetFields();
                setOpenModalAssign(false);
            }}
            okText="Gán Voucher"
            cancelText="Hủy"
            confirmLoading={isSubmit}
        >
            {loading ? (
                <Spin />
            ) : (
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item<AssignFormType>
                        name="userId"
                        label="Người dùng"
                        rules={[{ required: true, message: "Vui lòng chọn người dùng!" }]}
                    >
                        <Select placeholder="Chọn người dùng" showSearch optionFilterProp="children">
                            {users.map((user) => (
                                <Select.Option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item<AssignFormType>
                        name="voucherId"
                        label="Voucher"
                        rules={[{ required: true, message: "Vui lòng chọn voucher!" }]}
                    >
                        <Select placeholder="Chọn voucher" showSearch optionFilterProp="children">
                            {vouchers.map((voucher) => (
                                <Select.Option key={voucher.id} value={voucher.id}>
                                    {voucher.code} - {voucher.discountValue}
                                    {voucher.percentage ? "%" : "₫"}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default AssignVoucherToUser;
