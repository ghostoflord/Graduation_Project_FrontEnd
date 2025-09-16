import { getDashboardAPI } from "@/services/api";
import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import TopProductsChart from "./top.products.chart";

const AdminDashboard = () => {
    const [dataDashboard, setDataDashboard] = useState({
        countOrder: 0,
        countUser: 0,
        countProduct: 0,
        totalRevenue: 0,
        totalCanceledQuantity: 0,
    });

    const formatter = (value: number) => <CountUp end={value} separator="," />;

    useEffect(() => {
        const initDashboard = async () => {
            const res = await getDashboardAPI();
            if (res && res.data) {
                setDataDashboard(res.data);
            }
        };
        initDashboard();
    }, []);

    const today = new Date().toISOString().slice(0, 10); // yyyy-MM-dd

    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={12} lg={8}>
                <Card bordered={false}>
                    <Statistic
                        title="Tổng Users"
                        value={dataDashboard.countUser}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8}>
                <Card bordered={false}>
                    <Statistic
                        title="Tổng Đơn hàng"
                        value={dataDashboard.countOrder}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8}>
                <Card bordered={false}>
                    <Statistic
                        title="Tổng Products"
                        value={dataDashboard.countProduct}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
                <Card bordered={false}>
                    <Statistic
                        title="Tổng Doanh thu (VNĐ)"
                        value={dataDashboard.totalRevenue}
                        precision={0}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
                <Card bordered={false}>
                    <Statistic
                        title="Tổng SL sản phẩm bị huỷ"
                        value={dataDashboard.totalCanceledQuantity}
                        formatter={formatter}
                    />
                </Card>
            </Col>

            {/* Chart Top sản phẩm bán chạy trong ngày */}
            <Col span={24}>
                <Card bordered={false} title="Top sản phẩm bán chạy hôm nay">
                    <TopProductsChart type="day" date={today} />
                </Card>
            </Col>
        </Row>
    );
};

export default AdminDashboard;
