import { deleteOrderAPI, fetchAllOrders } from '@/services/api';
import { ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { App, Popconfirm, Tag } from 'antd';
import { useRef, useState } from 'react';
import DetailOrder from './order.detail';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import UpdateOrder from './order.update';

const TableOrder = () => {
    const actionRef = useRef<ActionType>();
    const [dataSource, setDataSource] = useState<IOrderTable[]>([]);
    const { message, notification } = App.useApp();

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IOrderTable | null>(null);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IOrderTable | null>(null);

    const [isDeleteOrder, setIsDeleteOrder] = useState<boolean>(false);

    const handleDeleteOrder = async (id: string) => {
        setIsDeleteOrder(true);
        try {
            const res = await deleteOrderAPI(id);
            if (res && (res.statusCode === 200 || res.statusCode === 204)) {
                message.success(res.message || 'Xóa order thành công');
                refreshTable();
            } else {
                notification.error({
                    message: res.error || 'Đã có lỗi xảy ra',
                    description: res.message || 'Không thể xóa order'
                });
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi hệ thống',
                description: 'Đã có lỗi xảy ra khi xóa order'
            })
        } finally {
            setIsDeleteOrder(false);
        }
    };

    const columns: ProColumns<IOrderTable>[] = [
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
            title: 'Receiver Name',
            dataIndex: 'receiverName',
            sorter: true,
        },
        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
        },
        {
            title: 'Payment Status',
            dataIndex: 'paymentStatus',
        },
        {
            title: 'Tracking Code',
            dataIndex: 'trackingCode',
        },
        {
            title: 'Shipping Method',
            dataIndex: 'shippingMethod',
        },
        {
            title: 'Receiver Phone',
            dataIndex: 'receiverPhone',
        },
        {
            title: 'Total Quantity',
            dataIndex: 'totalQuantity',
            valueType: 'digit',
            sorter: true,
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            sorter: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>{new Intl.NumberFormat(
                        'vi-VN',
                        { style: 'currency', currency: 'VND' }).format(entity.totalPrice)}
                    </>
                )
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (value) => {
                let color = 'blue';
                if (value === 'CANCELLED') color = 'red';
                else if (value === 'COMPLETED') color = 'green';
                else if (value === 'PENDING') color = 'orange';

                return <Tag color={color}>{value}</Tag>;
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
            sorter: true,
        },
        {
            title: 'User ID',
            dataIndex: 'userId'
        },
        {
            title: 'Action',
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
                            style={{ cursor: "pointer", marginRight: 15 }}
                            onClick={() => {
                                setDataUpdate(entity);
                                setOpenModalUpdate(true);
                            }}
                        />
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa order"}
                            description={"Bạn có chắc chắn muốn xóa order này ?"}
                            onConfirm={() => handleDeleteOrder(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            okButtonProps={{ loading: isDeleteOrder }}
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
        }
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IOrderTable>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                rowKey="id"
                headerTitle="Table Orders"
                pagination={{
                    showSizeChanger: true,
                    showTotal: (total, range) => (
                        <div>{range[0]}-{range[1]} trên {total} đơn hàng</div>
                    ),
                }}
                request={async () => {
                    try {
                        const data = await fetchAllOrders();
                        setDataSource(data);
                        return {
                            data: data,
                            success: true,
                            total: data.length,
                        };
                    } catch (error) {
                        notification.error({
                            message: 'Lỗi tải đơn hàng',
                            description: 'Không thể lấy danh sách đơn hàng',
                        });
                        return {
                            data: [],
                            success: false,
                            total: 0,
                        };
                    }
                }}
            />

            <DetailOrder
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <UpdateOrder
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
        </>
    );
};

export default TableOrder;
