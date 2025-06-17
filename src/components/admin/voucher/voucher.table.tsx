import { deleteVoucherAPI, getAllVouchersAPI } from '@/services/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm, Tag } from 'antd';
import { useRef, useState } from 'react';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import CreateVoucher from './voucher.create';
import AssignVoucherToUser from './assign.voucher.to.user';
import ApplyVoucherModal from './apply.voucher.form';
import DetailVoucher from './detail.voucher';
import UpdateVoucher from './update.voucher';
const TableVoucher = () => {
    const [vouchers, setVouchers] = useState<IVoucher[]>([]);

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IVoucher | null>(null);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IVoucher | null>(null);
    const [userList, setUserList] = useState<IUser[]>([]);

    const actionRef = useRef<ActionType>();
    const { message, notification } = App.useApp();
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const [openModalAssign, setOpenModalAssign] = useState(false);
    const [openApply, setOpenApply] = useState(false);

    const [openModalApply, setOpenModalApply] = useState(false);

    const handleDeleteVoucher = async (id: number) => {
        setIsDeleteLoading(true);
        try {
            const res = await deleteVoucherAPI(id);
            if (res && res.statusCode === 200) {
                message.success(res.message || 'Xoá voucher thành công');
                refreshTable();
            } else {
                notification.error({
                    message: res.error || 'Lỗi xoá voucher',
                    description: res.message || 'Không thể xoá voucher'
                });
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi hệ thống',
                description: 'Đã có lỗi xảy ra khi xoá voucher'
            });
        } finally {
            setIsDeleteLoading(false);
        }
    };

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const columns: ProColumns<IVoucher>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a
                        onClick={() => {
                            setDataViewDetail(entity);
                            setOpenViewDetail(true);
                        }}
                        href='#'>{entity.id}</a>
                )
            },
        },
        {
            title: 'Mã giảm giá',
            dataIndex: 'code',
            copyable: true,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
        },
        {
            title: 'Giá trị',
            dataIndex: 'discountValue',
            render: (value, record) =>
                record.percentage ? `${value}%` : `${value.toLocaleString()}%`,
        },
        {
            title: 'Áp dụng một lần?',
            dataIndex: 'isSingleUse',
            render: (value) => (
                <Tag color={value ? 'orange' : 'blue'}>
                    {value ? 'Có' : 'Không'}
                </Tag>
            ),
        },
        {
            title: 'Đã dùng?',
            dataIndex: 'used',
            render: (value) => (
                <Tag color={value ? 'red' : 'green'}>
                    {value ? 'Đã dùng' : 'Chưa dùng'}
                </Tag>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            render: (value) => (
                <Tag color={value ? 'green' : 'default'}>
                    {value ? 'Đang hoạt động' : 'Ngưng'}
                </Tag>
            ),
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            valueType: 'date',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            valueType: 'date',
        },
        {
            title: 'Người được gán',
            dataIndex: ['assignedUser', 'email'],
            render: (_, record) => {
                if (record.assignedUser) {
                    return `${record.assignedUser.name} (${record.assignedUser.email})`;
                }
                return <Tag color="gray">Chung</Tag>;
            }
        },
        {
            title: 'Tạo lúc',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
            hideInSearch: true
        },
        {
            title: 'Cập nhật lúc',
            dataIndex: 'updatedAt',
            valueType: 'dateTime',
            hideInSearch: true
        },
        {
            title: 'Hành động',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer", marginRight: 15 }}
                            onClick={() => {
                                setDataUpdate(entity);
                                setOpenModalUpdate(true);
                            }}
                        />
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa user"}
                            description={"Bạn có chắc chắn muốn xóa user này ?"}
                            onConfirm={() => handleDeleteVoucher(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            okButtonProps={{ loading: isDeleteLoading }}
                        >
                            <span style={{ cursor: "pointer", marginLeft: 20 }}>
                                <DeleteTwoTone
                                    twoToneColor="#ff4d4f"
                                    style={{ cursor: "pointer" }}
                                />
                            </span>
                        </Popconfirm>
                    </>
                )
            }
        },
    ];

    return (
        <>
            <ProTable<IVoucher>
                columns={columns}
                request={async () => {
                    const res = await getAllVouchersAPI();
                    if (res && res.data) {
                        setVouchers(res.data);
                    }
                    return {
                        data: res.data || [],
                        success: true,
                    };
                }}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                }}
                search={false}

                headerTitle="Table Voucher"
                toolBarRender={() => [
                    <Button
                        key="assign"
                        onClick={() => setOpenModalAssign(true)}
                    >
                        Gán mã cho user
                    </Button>,
                    <Button
                        key="apply"
                        onClick={() => setOpenModalApply(true)}
                    >
                        Admin thử áp mã
                    </Button>,

                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModalCreate(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
            <CreateVoucher
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />
            <AssignVoucherToUser
                openModalAssign={openModalAssign}
                setOpenModalAssign={setOpenModalAssign}
                refreshTable={refreshTable}
            />
            <ApplyVoucherModal
                openModalApply={openModalApply}
                setOpenModalApply={setOpenModalApply}
            />
            <DetailVoucher
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <UpdateVoucher
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                userList={userList || []}
            />
        </>
    );
};

export default TableVoucher;
