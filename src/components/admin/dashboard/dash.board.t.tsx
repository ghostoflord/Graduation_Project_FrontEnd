import React, { useEffect, useState } from 'react';
import { Card, Table, message } from 'antd';
import { Line } from '@ant-design/plots';
import { getRevenueMonthly, getProductTsopSelling } from '@/services/api';

const Dashboard: React.FC = () => {
    const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);
    const [topProducts, setTopProducts] = useState<{ key: number; productName: string; quantity: number; revenue: number }[]>([]);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const res = await getRevenueMonthly('', 0);
                const data = res.data?.data || res.data;
                if (Array.isArray(data)) {
                    setRevenueData(
                        data.map((item: any) => ({
                            month: item.month,
                            revenue: Number(item.revenue ?? 0),
                        }))
                    );
                } else message.error('Không thể tải dữ liệu doanh thu');
            } catch (error) {
                console.error(error);
                message.error('Lỗi khi tải dữ liệu doanh thu');
            }
        };
        fetchRevenue();
    }, []);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const res = await getProductTsopSelling('', 0, 0);
                const data = res.data?.data || res.data;
                if (Array.isArray(data)) {
                    setTopProducts(
                        data.map((item: any, index: number) => ({
                            key: index + 1,
                            productName: item.productName,
                            quantity: Number(item.totalQuantity ?? 0),
                            revenue: Number(item.totalRevenue ?? 0),
                        }))
                    );
                } else message.error('Không thể tải dữ liệu sản phẩm bán chạy');
            } catch (error) {
                console.error(error);
                message.error('Lỗi khi tải dữ liệu sản phẩm bán chạy');
            }
        };
        fetchTopProducts();
    }, []);

    const lineConfig = {
        data: revenueData,
        xField: 'month',
        yField: 'revenue',
        smooth: true,
        color: '#1890ff',
        height: 320,
        point: { size: 5, shape: 'circle' },
        tooltip: {
            showMarkers: true,
            formatter: (datum: any) => ({
                name: 'Doanh thu',
                value: (datum.revenue ?? 0).toLocaleString() + ' ₫',
            }),
        },
    };

    const columns = [
        { title: 'Sản phẩm', dataIndex: 'productName', key: 'productName' },
        {
            title: 'Số lượng bán',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center' as const,
        },
        {
            title: 'Doanh thu',
            dataIndex: 'revenue',
            key: 'revenue',
            render: (v: number) => v.toLocaleString() + ' ₫',
            align: 'right' as const,
        },
    ];

    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                width: '100%',
            }}
        >
            {/* Biểu đồ doanh thu */}
            <Card
                title="📊 Doanh thu theo tháng"
                bordered
                style={{
                    flex: '1 1 600px', // ưu tiên co giãn
                    minWidth: '300px', // ngưỡng nhỏ nhất
                    flexGrow: 1,
                }}
            >
                <Line {...lineConfig} />
            </Card>

            {/* Top sản phẩm */}
            <Card
                title="🔥 Top sản phẩm bán chạy"
                bordered
                style={{
                    flex: '1 1 400px',
                    minWidth: '300px',
                    flexGrow: 1,
                }}
            >
                <Table
                    columns={columns}
                    dataSource={topProducts}
                    pagination={false}
                    size="small"
                    bordered
                    scroll={{ x: true }}
                />
            </Card>
        </div>
    );
};

export default Dashboard;
