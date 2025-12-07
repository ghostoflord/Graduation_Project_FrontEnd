import React, { useEffect, useRef, useState } from 'react';
import { Card, List, Spin, Button, Row, Col, Pagination, Popconfirm, App } from 'antd';
import { deleteOrderAPI, getOrdersAPI } from '@/services/api';
import { DownloadOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { CSVLink } from 'react-csv';
import DetailOrder from '../order.detail';
import UpdateOrder from '../order.update';
import { ActionType } from '@ant-design/pro-components';

const TableOrderMobile = () => {
    const [orders, setOrders] = useState<IOrderTable[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const actionRef = useRef<ActionType>();
    const [dataSource, setDataSource] = useState<IOrderTable[]>([]);

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IOrderTable | null>(null);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IOrderTable | null>(null);

    const [isDeleteOrder, setIsDeleteOrder] = useState<boolean>(false);

    const paginatedOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await getOrdersAPI("current=1&pageSize=100");
            // nếu backend trả về res.data.result
            const orderList = res?.data?.result ?? res?.result ?? [];
            setOrders(orderList);
            setLoading(false);
        };
        fetchData();
    }, []);


    const refreshTable = () => {
        actionRef.current?.reload();
    };

    const handleDeleteOrder = async (orderId: number | string) => {
        setIsDeleteOrder(true);
        try {
            // Thực hiện xóa đơn hàng tại API
            // Giả sử API của bạn là deleteOrder(orderId)
            await deleteOrderAPI(orderId);
            setOrders((prev) => prev.filter(order => order.id !== Number(orderId)));
            setIsDeleteOrder(false);
        } catch (error) {
            setIsDeleteOrder(false);
            // Thông báo lỗi nếu có vấn đề khi xóa
            App.useApp().notification.error({
                message: 'Lỗi khi xóa đơn hàng',
                description: 'Không thể xóa đơn hàng này. Vui lòng thử lại sau.',
            });
        }
    };

    const csvHeaders = [
        { label: 'ID', key: 'id' },
        { label: 'Receiver Name', key: 'receiverName' },
        { label: 'Receiver Address', key: 'receiverAddress' },
        { label: 'Receiver Phone', key: 'receiverPhone' },
        { label: 'Total Price', key: 'totalPrice' },
        { label: 'Status', key: 'status' },
        { label: 'User ID', key: 'userId' },
    ];

    return (
        <>
            <div style={{ padding: 16 }}>
                {/* Export CSV button */}
                <Row justify="end" style={{ marginBottom: 16 }}>
                    <Col>
                        <CSVLink
                            headers={csvHeaders}
                            data={orders}
                            filename="orders_mobile.csv"
                            style={{ textDecoration: 'none' }}
                        >
                            <Button icon={<DownloadOutlined />} type="primary">
                                Export CSV
                            </Button>
                        </CSVLink>
                    </Col>
                </Row>

                {/* Loading Spinner */}
                {loading ? (
                    <Spin />
                ) : (
                    <>
                        {/* List of Orders */}
                        <List
                            dataSource={paginatedOrders}
                            renderItem={(item) => (
                                <Card key={item.id} title={item.receiverName} style={{ marginBottom: 16 }}>
                                    <div><strong>Địa chỉ:</strong> {item.receiverAddress}</div>
                                    <div><strong>Điện thoại:</strong> {item.receiverPhone}</div>
                                    <div><strong>Tổng:</strong> {item.totalPrice} Đơn</div>
                                    <div><strong>Trạng thái:</strong> {item.status}</div>

                                    {/* Action Buttons */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 12,
                                            marginTop: 16,
                                        }}
                                    >
                                        <EditTwoTone
                                            twoToneColor="#f57800"
                                            style={{ cursor: "pointer", marginRight: 15 }}
                                            onClick={() => {
                                                setDataUpdate(item);
                                                setOpenModalUpdate(true);
                                            }}
                                        />
                                        <Popconfirm
                                            placement="leftTop"
                                            title={"Xác nhận xóa order"}
                                            description={"Bạn có chắc chắn muốn xóa order này ?"}
                                            onConfirm={() => handleDeleteOrder(item.id)}
                                            okText="Xác nhận"
                                            cancelText="Hủy"
                                            okButtonProps={{ loading: isDeleteOrder }}
                                        >
                                            <DeleteTwoTone
                                                twoToneColor="#ff4d4f"
                                                style={{ cursor: "pointer" }}
                                            />
                                        </Popconfirm>
                                    </div>
                                </Card>
                            )}
                        />

                        {/* Pagination */}
                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={orders.length}
                                onChange={(page) => setCurrentPage(page)}
                                size="small"
                                responsive
                                simple={window.innerWidth < 1000}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Modals for view and update */}
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

export default TableOrderMobile;
