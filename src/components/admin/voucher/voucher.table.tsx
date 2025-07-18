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

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    });
    const [currentDataTable, setCurrentDataTable] = useState<IVoucher[]>([]);

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
            width: 100,
            ellipsis: true,
            copyable: true,
        },
        {
            title: 'Mô tả',
            width: 50,
            ellipsis: true,
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
                    {value ? 'Hoạt động' : 'Ngưng'}
                </Tag>
            ),
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            valueType: 'date',
            width: 50,
            ellipsis: true,
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            valueType: 'date',
            width: 50,
            ellipsis: true,
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
            width: 100,
            render(dom, entity, index, action, schema) {
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}
                ></div>
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{
                                cursor: "pointer", marginRight: 15,
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                gap: 12
                            }}
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
                actionRef={actionRef}
                request={async (params, sort, filter) => {
                    let query = `current=${params.current}&pageSize=${params.pageSize}`;
                    const res = await getAllVouchersAPI(query);
                    if (res?.data) {
                        setMeta(res.data.meta);
                        setCurrentDataTable(res.data.result);
                    }
                    return {
                        data: res.data?.result ?? [],
                        page: 1,
                        success: true,
                        total: res.data?.meta.total ?? 0,
                    };
                }}
                rowKey="id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => (
                        <div>{range[0]}-{range[1]} trên {total} dòng</div>
                    )
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
