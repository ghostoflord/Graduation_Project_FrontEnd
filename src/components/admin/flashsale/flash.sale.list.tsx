import { useEffect, useState } from "react";
import { Card, Typography, Badge, Image } from "antd";
import { getAllFlashSalesAPI } from "@/services/api";
import dayjs from "dayjs";
import Countdown, { CountdownRenderProps } from "react-countdown";
import Slider from "react-slick";
import styles from "./flash.sale.list.module.scss";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const { Title } = Typography;

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
            const result = res?.data?.result || [];
            const activeSales = result.filter((fs) => fs.status === "ACTIVE");
            setFlashSales(activeSales);
        });
    }, []);

    const PrevArrow = (props: any) => {
        const { onClick } = props;
        return (
            <div className={`${styles.customArrow} ${styles.prevArrow}`} onClick={onClick}>
                {"<"}
            </div>
        );
    };

    const NextArrow = (props: any) => {
        const { onClick } = props;
        return (
            <div className={`${styles.customArrow} ${styles.nextArrow}`} onClick={onClick}>
                {">"}
            </div>
        );
    };


    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

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
                    bordered
                >
                    <Slider {...sliderSettings}>
                        {sale.items?.map((item) => {
                            const percent = item.originalPrice && item.originalPrice > item.salePrice
                                ? Math.round(((item.originalPrice - item.salePrice) / item.originalPrice) * 100)
                                : 0;

                            return (
                                <div className={styles.slideItem}>
                                    <div style={{ maxWidth: 220, margin: "0 auto" }}>
                                        <Badge.Ribbon text={`Giảm ${percent}%`} color="red">
                                            <Card
                                                hoverable
                                                className={styles.productCard}
                                                cover={
                                                    <div className={styles["product-image"]}>
                                                        <img
                                                            src={
                                                                item.imageUrl
                                                                    ? `${import.meta.env.VITE_BACKEND_URL}/upload/products/${item.imageUrl}`
                                                                    : "/default-product.jpg"
                                                            }
                                                            alt="product"
                                                        />
                                                    </div>
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
                                    </div>
                                </div>
                            );
                        })}
                    </Slider>
                </Card>
            ))}
        </div>
    );
};

export default FlashSaleList;
