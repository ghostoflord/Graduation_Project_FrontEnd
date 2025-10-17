import React, { useEffect, useState } from 'react';
import { Card, Table, message } from 'antd';
import { Line } from '@ant-design/plots';
import { getRevenueMonthly, getProductTsopSelling } from '@/services/api'; // 👈 nhớ import thêm API mới

const Dashboard: React.FC = () => {
    const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);
    const [topProducts, setTopProducts] = useState<{ key: number; productName: string; quantity: number; revenue: number }[]>([]);

    /** 🧩 Lấy dữ liệu doanh thu theo tháng */
    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const res = await getRevenueMonthly('', 0);
                const data = res.data?.data || res.data;

                if (Array.isArray(data)) {
                    const formattedData = data.map((item: any) => ({
                        month: item.month,
                        revenue: Number(item.revenue ?? 0),
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

    /** 🧩 Lấy dữ liệu top sản phẩm bán chạy */
    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const res = await getProductTsopSelling('', 0, 0);
                const data = res.data?.data || res.data;

                if (Array.isArray(data)) {
                    const formattedProducts = data.map((item: any, index: number) => ({
                        key: index + 1,
                        productName: item.productName,
                        quantity: Number(item.totalQuantity ?? 0),
                        revenue: Number(item.totalRevenue ?? 0),
                    }));
                    setTopProducts(formattedProducts);
                } else {
                    message.error('Không thể tải dữ liệu sản phẩm bán chạy');
                }
            } catch (error) {
                console.error(error);
                message.error('Lỗi khi tải dữ liệu sản phẩm bán chạy');
            }
        };

        fetchTopProducts();
    }, []);

    /** 📈 Cấu hình biểu đồ doanh thu */
    const lineConfig = {
        data: revenueData,
        xField: 'month',
        yField: 'revenue',
        smooth: true,
        color: '#1890ff',
        point: { size: 5, shape: 'circle' },
        tooltip: {
            showContent: true,
            showMarkers: true,
            formatter: (datum: any) => ({
                name: 'Doanh thu',
                value: datum.revenue?.toLocaleString?.() + ' ₫',
            }),
        },
    };

    /** 🧾 Cột hiển thị bảng top sản phẩm */
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
