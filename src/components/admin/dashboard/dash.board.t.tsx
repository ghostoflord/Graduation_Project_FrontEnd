import React, { useEffect, useState, useRef } from 'react';
import { Card, Table, message, Spin } from 'antd';
import { Line } from '@ant-design/plots';
import { getRevenueMonthly, getProductTsopSelling } from '@/services/api';

const Dashboard: React.FC = () => {
    const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);
    const [topProducts, setTopProducts] = useState<{ key: number; productName: string; quantity: number; revenue: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; month: string; revenue: number }>({
        visible: false,
        x: 0,
        y: 0,
        month: '',
        revenue: 0
    });
    const chartRef = useRef<any>();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                setLoading(true);
                const res = await getRevenueMonthly('', 0);
                const data = res.data?.data || res.data;

                if (Array.isArray(data)) {
                    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const formattedData = monthOrder.map(month => {
                        const found = data.find((item: any) => item.month === month);
                        return {
                            month: month,
                            revenue: found ? Number(found.revenue) : 0
                        };
                    });
                    setRevenueData(formattedData);
                } else {
                    message.error('Không thể tải dữ liệu doanh thu');
                }
            } catch (error) {
                console.error(error);
                message.error('Lỗi khi tải dữ liệu doanh thu');
            } finally {
                setLoading(false);
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

    // Xử lý sự kiện hover trên chart
    const handleChartHover = (event: any) => {
        if (!containerRef.current || !revenueData.length) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Tính toán month dựa trên vị trí x
        const chartWidth = rect.width;
        const monthIndex = Math.floor((x / chartWidth) * 12);
        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex];

        if (month) {
            const dataPoint = revenueData.find(d => d.month === month);
            if (dataPoint) {
                setTooltip({
                    visible: true,
                    x: x,
                    y: y - 80, // Điều chỉnh vị trí
                    month: month,
                    revenue: dataPoint.revenue
                });
            }
        }
    };

    const handleChartLeave = () => {
        setTooltip(prev => ({ ...prev, visible: false }));
    };

    // Cấu hình đơn giản, KHÔNG dùng tooltip của G2
    const lineConfig = {
        data: revenueData,
        xField: 'month',
        yField: 'revenue',
        smooth: true,
        color: '#1890ff',
        height: 320,
        point: {
            size: 6,
            shape: 'circle',
            style: {
                fill: '#1890ff',
                stroke: '#fff',
                lineWidth: 2,
            }
        },
        yAxis: {
            label: {
                formatter: (v: number) => {
                    if (v >= 1000000) {
                        return `${(v / 1000000).toFixed(1)}M ₫`;
                    }
                    return `${v.toLocaleString('vi-VN')} ₫`;
                }
            }
        },
        // TẮT tooltip của G2
        tooltip: false,

        // Thêm label trực tiếp
        label: {
            position: 'top',
            offsetY: -8,
            style: {
                fill: '#1890ff',
                fontSize: 11,
                fontWeight: 'bold',
                fillOpacity: 0.8,
            },
            formatter: (datum: any) => {
                const revenue = datum.revenue;
                if (revenue > 1000000) {
                    return `${(revenue / 1000000).toFixed(1)}M`;
                }
                return revenue > 0 ? revenue.toLocaleString('vi-VN') : '';
            },
        },

        // Config line đậm hơn
        lineStyle: {
            lineWidth: 3,
        },

        animation: {
            appear: {
                animation: 'wave-in',
                duration: 1000,
            },
        },
    };

    const columns = [
        { title: 'Sản phẩm', dataIndex: 'productName', key: 'productName' },
        {
            title: 'Số lượng bán',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center' as const,
            render: (v: number) => v.toLocaleString('vi-VN'),
        },
        {
            title: 'Doanh thu',
            dataIndex: 'revenue',
            key: 'revenue',
            render: (v: number) => v.toLocaleString('vi-VN') + ' ₫',
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
                    flex: '1 1 1000px',
                    minWidth: '300px',
                    flexGrow: 1,
                    position: 'relative',
                }}
            >
                {loading ? (
                    <div style={{
                        height: 320,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <div
                        ref={containerRef}
                        style={{ position: 'relative' }}
                        onMouseMove={handleChartHover}
                        onMouseLeave={handleChartLeave}
                    >
                        <Line {...lineConfig} />

                        {/* Custom Tooltip Component */}
                        {tooltip.visible && tooltip.revenue > 0 && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: tooltip.x,
                                    top: tooltip.y,
                                    backgroundColor: 'white',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                                    border: '1px solid #e8e8e8',
                                    zIndex: 1000,
                                    minWidth: '140px',
                                    transform: 'translateX(-50%)',
                                    pointerEvents: 'none',
                                }}
                            >
                                <div style={{
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    color: '#333',
                                    marginBottom: '8px',
                                    borderBottom: '1px solid #f0f0f0',
                                    paddingBottom: '4px'
                                }}>
                                    {tooltip.month}
                                </div>
                                <div style={{
                                    color: '#1890ff',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                }}>
                                    {tooltip.revenue.toLocaleString('vi-VN')} ₫
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Summary thông tin */}
                {!loading && (
                    <div style={{
                        marginTop: 16,
                        padding: 12,
                        backgroundColor: '#f6ffed',
                        borderRadius: 6,
                        border: '1px solid #b7eb8f',
                        fontSize: 14
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                            <div>
                                <strong>Tổng doanh thu:</strong>{' '}
                                {revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString('vi-VN')} ₫
                            </div>
                            <div>
                                <strong>Tháng cao nhất:</strong>{' '}
                                {(() => {
                                    const maxMonth = revenueData.reduce((max, item) =>
                                        item.revenue > max.revenue ? item : max,
                                        { month: '', revenue: 0 }
                                    );
                                    return maxMonth.month ? `${maxMonth.month}: ${maxMonth.revenue.toLocaleString('vi-VN')} ₫` : 'Không có dữ liệu';
                                })()}
                            </div>
                        </div>
                    </div>
                )}
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