import { getDashboardAPI } from "@/services/api";
import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import CountUp from 'react-countup';

const AdminDashboard = () => {
    const [dataDashboard, setDataDashboard] = useState({
        countOrder: 0,
        countUser: 0,
        countProduct: 0
    });

    useEffect(() => {
        const initDashboard = async () => {
            const res = await getDashboardAPI();
            console.log("Dashboard API response:", res);
            if (res && res.data) {
                setDataDashboard(res.data);
            }
        };
        initDashboard();
    }, []);

    const formatter = (value: number) => <CountUp end={value} separator="," />;

    return (
        <Row gutter={[40, 40]}>
            <Col span={8}>
                <Card title="" bordered={false}>
                    <Statistic
                        title="Tổng Users"
                        value={dataDashboard.countUser}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card title="" bordered={false}>
                    <Statistic
                        title="Tổng Đơn hàng"
                        value={dataDashboard.countOrder}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card title="" bordered={false}>
                    <Statistic
                        title="Tổng Books"
                        value={dataDashboard.countProduct}
                        formatter={formatter}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default AdminDashboard;
