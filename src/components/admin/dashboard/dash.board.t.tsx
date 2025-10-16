import React, { useEffect, useState } from 'react';
import { Card, Table, message } from 'antd';
import { Line } from '@ant-design/plots';
import { getRevenueMonthly } from '@/services/api';

const mockTopProducts = [
    { key: 1, productName: 'Laptop Asus ROG', quantity: 120, revenue: 240000000 },
    { key: 2, productName: 'Macbook Pro M3', quantity: 90, revenue: 315000000 },
    { key: 3, productName: 'Dell XPS 13', quantity: 80, revenue: 192000000 },
    { key: 4, productName: 'HP Omen 16', quantity: 65, revenue: 130000000 },
];

const Dashboard: React.FC = () => {
    const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);
    const [topProducts, setTopProducts] = useState(mockTopProducts);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const res = await getRevenueMonthly('', 0);
                console.log(res)
                if (Array.isArray(res.data)) {
                    const formattedData = res.data.map((item: any) => ({
                        month: item.month,
                        revenue: item.revenue,
                    }));
                    setRevenueData(formattedData);
                } else {
                    message.error('Không thể tải dữ liệu doanh thu');
                }
            } catch (error) {
                console.error(error);
                message.error('Lỗi khi tải dữ liệu doanh thu');
            }
        };

        fetchRevenue();
    }, []);

    const lineConfig = {
        data: revenueData,
        xField: 'month',
        yField: 'revenue',
        smooth: true,
        color: '#1890ff',
        point: { size: 5, shape: 'circle' },
        tooltip: {
            revenueData: (datum: any) => ({
                name: 'Doanh thu',
                value: datum.revenue.toLocaleString() + ' ₫',
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
        <div style={{ padding: 24 }}>
            <Card title="📊 Doanh thu theo tháng" style={{ marginBottom: 24 }}>
                <Line {...lineConfig} />
            </Card>

            <Card title="🔥 Top sản phẩm bán chạy">
                <Table columns={columns} dataSource={topProducts} pagination={false} bordered />
            </Card>
        </div>
    );
};

export default Dashboard;
