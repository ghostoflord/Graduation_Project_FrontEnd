import { useEffect, useState } from "react";
import { Card, Typography, Badge, Image, Modal, Button, message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { getAllFlashSalesAPI, addToCartAPI, getCart, useCartStore, reduceFlashSaleQuantityAPI } from "@/services/api";
import dayjs from "dayjs";
import Countdown, { CountdownRenderProps } from "react-countdown";
import { useNavigate } from "react-router-dom";
import { useCurrentApp } from "@/components/context/app.context";
import Slider from "react-slick";
import styles from "./flash.sale.list.module.scss";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const { Title } = Typography;

const FlashSaleList = () => {
    const [flashSales, setFlashSales] = useState<IFlashSale[]>([]);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { setCartSummary } = useCurrentApp();
    const navigate = useNavigate();

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

            console.log("Flash Sales:", result);

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

    const handleProductClick = (item: any) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleAddToCart = async (item: any) => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user.id;

        if (!userId) {
            message.error("Bạn cần đăng nhập để thêm vào giỏ hàng.");
            return;
        }

        // Kiểm tra thời gian còn lại của Flash Sale
        const now = new Date();
        const endTime = item.endTime ? new Date(item.endTime) : null;

        if (!endTime || isNaN(endTime.getTime())) {
            console.warn(" Không có thời gian kết thúc hợp lệ:", item.endTime);
            message.warning("Không xác định được thời gian Flash Sale.");
            return;
        }

        const timeLeft = endTime.getTime() - now.getTime(); // milliseconds
        const fiveMinutes = 5 * 60 * 1000;

        if (timeLeft <= 0) {
            message.warning("Flash Sale đã kết thúc cho sản phẩm này.");
            return;
        }

        const confirmAdd = async () => {
            try {
                await addToCartAPI({
                    productId: item.productId,
                    quantity: 1,
                    price: item.salePrice,
                    userId,
                });
                message.success("Đã thêm vào giỏ hàng!");

                const res = await getCart(userId);
                if (res?.data) setCartSummary(res.data);
            } catch (error) {
                message.error("Lỗi khi thêm vào giỏ hàng!");
            }
        };

        // Nếu còn dưới 5 phút → hiện cảnh báo trước
        if (timeLeft < fiveMinutes) {
            const minutesLeft = Math.floor(timeLeft / 60000);
            const secondsLeft = Math.floor((timeLeft % 60000) / 1000);

            const formattedTime =
                minutesLeft > 0
                    ? `${minutesLeft} phút ${secondsLeft} giây`
                    : `${secondsLeft} giây`;

            Modal.warning({
                title: "Flash Sale sắp kết thúc",
                content: `Sản phẩm chỉ còn ${formattedTime} trước khi trở về giá gốc. Bạn có chắc chắn muốn thêm vào giỏ hàng không?`,
                centered: true,
                okText: "Thêm vào giỏ hàng",
                cancelText: "Huỷ",
                onOk: confirmAdd,
            });
        }
        else {
            confirmAdd();
        }
    };


    const handleBuyNow = async (item: any) => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            message.warning("Vui lòng đăng nhập để tiếp tục");
            navigate("/login");
            return;
        }

        if (item.quantity <= 0) {
            message.warning("Sản phẩm đã hết số lượng khuyến mãi");
            return;
        }

        try {
            const user = JSON.parse(storedUser);
            const userId = user.id;

            await addToCartAPI({
                productId: item.productId,
                quantity: 1,
                price: item.salePrice,
                userId,
            });

            useCartStore.getState().addItem({
                productId: item.productId,
                name: item.productName,
                price: item.salePrice,
                quantity: 1,
                image: item.imageUrl,
                shortDescription: item.shortDescription,
                detailDescription: item.detailDescription,
            });

            const res = await getCart(userId);
            if (res?.data) setCartSummary(res.data);

            navigate("/thanh-toan", {
                state: {
                    flashSaleItem: {
                        flashSaleItemId: item.id,
                        productId: item.productId,
                        price: item.salePrice,
                        quantity: 1,
                        name: item.productName,
                        image: item.imageUrl,
                        shortDescription: item.shortDescription,
                        detailDescription: item.detailDescription,
                    },
                },
            });
        } catch (error: any) {
            message.error(error?.response?.data?.message || "Không thể mua ngay");
        }
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
                    title={(
                        <div className={styles.saleHeader}>
                            <Title level={4} style={{ margin: 0 }}>{sale.name}</Title>
                            <div className={styles.countdown}>
                                <Countdown date={dayjs(sale.endTime).toDate()} renderer={renderCountdown} />
                            </div>
                        </div>
                    )}
                    bordered
                >
                    <Slider {...sliderSettings}>
                        {sale.items?.map((item) => {
                            const enrichedItem = { ...item, endTime: sale.endTime };
                            // const isExpired = dayjs().isAfter(dayjs(enrichedItem.endTime));
                            const isExpired = sale.status !== "ACTIVE";
                            const percent = enrichedItem.originalPrice && enrichedItem.originalPrice > enrichedItem.salePrice
                                ? Math.round(((enrichedItem.originalPrice - enrichedItem.salePrice) / enrichedItem.originalPrice) * 100)
                                : 0;

                            return (

                                <div className={styles.slideItem} key={enrichedItem.id}>
                                    <div style={{ maxWidth: 220, margin: "0 auto" }}>
                                        <Badge.Ribbon text={`Giảm ${percent}%`} color="red">
                                            <Card
                                                hoverable
                                                className={styles.productCard}
                                                cover={(
                                                    <div
                                                        className={styles["product-image"]}
                                                        onClick={() => handleProductClick(enrichedItem)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <img
                                                            src={
                                                                enrichedItem.imageUrl
                                                                    ? `${import.meta.env.VITE_BACKEND_URL}/upload/products/${enrichedItem.imageUrl}`
                                                                    : "/default-product.jpg"
                                                            }
                                                            alt="product"
                                                        />
                                                    </div>
                                                )}
                                            >
                                                <div className={styles.productName}>{enrichedItem.productName}</div>
                                                {isExpired ? (
                                                    <div className={styles.salePrice}>
                                                        {enrichedItem.originalPrice?.toLocaleString()}₫
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className={styles.originalPrice}>
                                                            {enrichedItem.originalPrice?.toLocaleString()}₫
                                                        </div>
                                                        <div className={styles.salePrice}>
                                                            {enrichedItem.salePrice.toLocaleString()}₫
                                                        </div>
                                                    </>
                                                )}

                                                <div className={styles.quantityInfo}>Còn lại: {enrichedItem.quantity}</div>
                                                {!isExpired && (
                                                    <div className={styles.buttonGroup}>
                                                        <Button
                                                            icon={<ShoppingCartOutlined />}
                                                            onClick={() => handleAddToCart(enrichedItem)}
                                                        />
                                                        <Button
                                                            type="primary"
                                                            onClick={() => handleBuyNow(enrichedItem)}
                                                        >
                                                            Mua ngay
                                                        </Button>
                                                    </div>
                                                )}


                                            </Card>
                                        </Badge.Ribbon>
                                    </div>
                                </div>
                            );
                        })}

                    </Slider>
                </Card>
            ))}

            <Modal
                title={selectedItem?.productName}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalOpen(false)}>Đóng</Button>,
                    <Button key="buy" type="primary" onClick={() => handleBuyNow(selectedItem)}>Mua ngay</Button>,
                ]}
            >
                <Image
                    src={
                        selectedItem?.imageUrl
                            ? `${import.meta.env.VITE_BACKEND_URL}/upload/products/${selectedItem.imageUrl}`
                            : "/default-product.jpg"
                    }
                    alt="product"
                    width={"100%"}
                    style={{ marginBottom: 16 }}
                />
                <p>Giá gốc: {selectedItem?.originalPrice?.toLocaleString()}₫</p>
                <p>Giá sale: <b style={{ color: "red" }}>{selectedItem?.salePrice?.toLocaleString()}₫</b></p>
                <p>Còn lại: {selectedItem?.quantity}</p>
            </Modal>
        </div>
    );
};

export default FlashSaleList;
