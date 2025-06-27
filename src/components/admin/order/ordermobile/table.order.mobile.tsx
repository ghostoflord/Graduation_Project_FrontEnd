import React, { useEffect, useState } from 'react';
import { Card, List, Spin, Button, Row, Col, Pagination } from 'antd';
import { fetchAllOrders } from '@/services/api';
import { DownloadOutlined } from '@ant-design/icons';
import { CSVLink } from 'react-csv';

const TableOrderMobile = () => {
    const [orders, setOrders] = useState<IOrderTable[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const paginatedOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await fetchAllOrders();
            setOrders(data);
            setLoading(false);
        };
        fetchData();
    }, []);

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
    );
};

export default TableOrderMobile;
