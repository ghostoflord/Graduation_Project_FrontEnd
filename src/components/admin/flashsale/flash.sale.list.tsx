import { useEffect, useState } from "react";
import { Card, Tag, Row, Col, Image, Typography, Badge } from "antd";
import { getAllFlashSalesAPI } from "@/services/api";
import dayjs from "dayjs";
import Countdown, { CountdownRenderProps } from "react-countdown";

import styles from "./flash.sale.list.module.scss";
const { Title, Text } = Typography;

const FlashSaleList = () => {
    const [flashSales, setFlashSales] = useState<IFlashSale[]>([]);

    const renderCountdown = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
        if (completed) return <span>Đã kết thúc</span>;
        return (
            <span>
                {days > 0 && `${days} ngày `}{hours} giờ {minutes} phút {seconds} giây
            </span>
        );
    };

    useEffect(() => {
        getAllFlashSalesAPI().then((res) => {
            if (res.statusCode === 200) {
                setFlashSales(res.data.filter((fs) => fs.status === "ACTIVE"));
            }
        });
    }, []);

    return (
        <div className={styles.container}>
            {flashSales.map((sale) => (
                <Card
                    key={sale.id}
                    className={styles.saleCard}
                    title={
                        <div className={styles.saleHeader}>
                            <Title level={4} style={{ margin: 0 }}>{sale.name}</Title>
                            <div className={styles.countdown}>
                                <Countdown date={dayjs(sale.endTime).toDate()} renderer={renderCountdown} />
                            </div>
                        </div>
                    }
                    style={{ marginBottom: 24 }}
                    bordered
                >
                    <Row gutter={[16, 16]}>
                        {sale.items?.map((item) => {
                            const percent = item.originalPrice && item.originalPrice > item.salePrice
                                ? Math.round(((item.originalPrice - item.salePrice) / item.originalPrice) * 100)
                                : 0;

                            return (
                                <Col key={item.productId} xs={24} sm={12} md={8} lg={6} xl={4}>
                                    <Badge.Ribbon text={`Giảm ${percent}%`} color="red">
                                        <Card
                                            hoverable
                                            className={styles.productCard}
                                            cover={
                                                <Image
                                                    height={150}
                                                    src={item.productThumbnail || "/default.jpg"}
                                                    alt="product"
                                                    preview={false}
                                                />
                                            }
                                        >
                                            <div className={styles.productName}>{item.productName}</div>
                                            <div className={styles.originalPrice}>
                                                {item.originalPrice?.toLocaleString()}₫
                                            </div>
                                            <div className={styles.salePrice}>
                                                {item.salePrice.toLocaleString()}₫
                                            </div>
                                        </Card>
                                    </Badge.Ribbon>
                                </Col>
                            );
                        })}
                    </Row>
                </Card>
            ))}
        </div>

    );
};

export default FlashSaleList;
