import React, { useEffect } from 'react';
import { Card, Col, Row, Statistic, Typography, message } from 'antd';
import { getShipperStats } from '@/services/api';
import { useCurrentApp } from '../context/app.context';
import styles from './shipper.stats.module.scss';

const { Title } = Typography;

interface Stats {
  delivered: number;
  failed: number;
  inProgress: number;
  codAmount: number;
}

const ShipperStats = () => {
  const { user } = useCurrentApp();
  const [stats, setStats] = React.useState<Stats>({
    delivered: 0,
    failed: 0,
    inProgress: 0,
    codAmount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        const res = await getShipperStats(user.id);
        setStats(res.data);
      } catch (error) {
        console.error(error);
        message.error('Lỗi khi lấy thống kê shipper');
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className={styles.shipperStats}>
      <Title level={3} className={styles.title}>Thống kê Shipper</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.card}>
            <Statistic
              title="Đơn thành công"
              value={stats.delivered}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className={styles.card}>
            <Statistic
              title="Đơn thất bại"
              value={stats.failed}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className={styles.card}>
            <Statistic
              title="Đang giao"
              value={stats.inProgress}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className={styles.card}>
            <Statistic
              title="Tổng COD"
              value={stats.codAmount}
              prefix="₫"
              precision={0}
              valueStyle={{ color: '#096dd9' }}
              formatter={(value) =>
                new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(Number(value))
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ShipperStats;
