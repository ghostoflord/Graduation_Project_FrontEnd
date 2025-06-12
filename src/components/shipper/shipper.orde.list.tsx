import { useRef, useState } from 'react';
import { Button, message, Tag } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { getOrdersForShipperAPI, acceptOrderAPI, completeOrderAPI } from '@/services/api';
import { useCurrentApp } from '../context/app.context';

type TOrder = {
    id: number;
    code: string;
    receiverName: string;
    receiverAddress: string;
    receiverPhone: string;
    status: 'PENDING' | 'SHIPPING' | 'DELIVERED' | string;
    createdAt: string;
};

type TSearch = {
    code?: string;
    receiverName?: string;
};

const ShipperOrderTable = () => {
    const actionRef = useRef<ActionType>();
    const { user } = useCurrentApp();

    const [currentDataTable, setCurrentDataTable] = useState<[]>([]);

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });

    const handleAccept = async (orderId: number) => {
        try {
            await acceptOrderAPI(orderId);
            message.success('Nhận đơn thành công');
            actionRef.current?.reload();
        } catch (err) {
            message.error('Nhận đơn thất bại');
        }
    };

    const handleComplete = async (orderId: number) => {
        try {
            await completeOrderAPI(orderId);
            message.success('Hoàn tất đơn hàng');
            actionRef.current?.reload();
        } catch (err) {
            message.error('Thất bại khi hoàn tất đơn hàng');
        }
    };

    const columns: ProColumns<TOrder>[] = [
        {
            title: 'Mã đơn',
            dataIndex: 'code',
            copyable: true,
        },
        {
            title: 'Người nhận',
            dataIndex: 'receiverName',
        },
        {
            title: 'SĐT',
            dataIndex: 'receiverPhone',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'receiverAddress',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (_, entity) => (
                <Tag color={
                    entity.status === 'PENDING' ? 'orange' :
                        entity.status === 'SHIPPING' ? 'blue' : 'green'
                }>
                    {entity.status}
                </Tag>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
        },
        {
            title: 'Hành động',
            valueType: 'option',
            render: (_, entity) => {
                if (entity.status === 'PENDING') {
                    return <Button type="primary" onClick={() => handleAccept(entity.id)}>Nhận đơn</Button>;
                }
                if (entity.status === 'SHIPPING') {
                    return <Button danger onClick={() => handleComplete(entity.id)}>Hoàn tất</Button>;
                }
                return null;
            }
        },
    ];

    return (
        <ProTable<TOrder, TSearch>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            rowKey="id"
            pagination={{
                current: meta.current,
                pageSize: meta.pageSize,
                total: meta.total,
                showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
            }}
            request={async (params) => {
                const query = `current=${params.current}&pageSize=${params.pageSize}`;
                const res = await getOrdersForShipperAPI(query);

                if (res.data) {
                    setMeta(res.data.meta);
                    setCurrentDataTable(res.data?.result ?? [])
                }
                return {
                    data: res.data?.result,
                    page: 1,
                    success: true,
                    total: res.data?.meta.total
                }
            }}
            headerTitle="Danh sách đơn hàng cho shipper"
        />
    );
};

export default ShipperOrderTable;
