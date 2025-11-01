import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Rate, Row, message } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { addOrUpdateReviewAPI, getLikedProductsAPI, toggleLikeAPI } from "@/services/api";
import { slugify } from "@/utils/slugify";
import "./product.card.list.scss";
import { PropagateLoader } from "react-spinners";

interface IProductTable {
    id: number;
    name: string;
    image?: string;
    price?: number;
    discountPrice?: number | null;
    sell?: string | number;
    bestsell?: string;
    quantity?: number;
    averageRating?: number;
    totalReviews?: number;
    // ... bất kỳ field nào bạn dùng trong giao diện
}

interface ProductCardProps {
    products: IProductTable[];
    total: number;
    current: number;
    setCurrent: (n: number) => void;
    pageSize: number;
    filterParams?: {
        search?: string;
        sort?: string | null;
        priceFrom?: string | null;
        priceTo?: string | null;
    };
}

const ProductCard: React.FC<ProductCardProps> = ({
    products,
    total,
    current,
    setCurrent,
    pageSize,
    filterParams,
}) => {
    const [likedProductIds, setLikedProductIds] = useState<number[]>([]);
    const [loadingLikes, setLoadingLikes] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id;

    useEffect(() => {
        const fetchLikedProducts = async () => {
            try {
                if (!userId) return;
                setLoadingLikes(true);
                const res = await getLikedProductsAPI(userId);
                const likedIds = res.data.map((like: any) => like.productId);
                setLikedProductIds(likedIds);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách yêu thích:", error);
            } finally {
                setLoadingLikes(false);
            }
        };

        fetchLikedProducts();
    }, [userId]);

    const handleToggleLike = async (productId: number) => {
        if (!userId || isNaN(userId) || userId <= 0) {
            message.warning("Bạn cần đăng nhập để yêu thích sản phẩm");
            return;
        }
        try {
            const res = await toggleLikeAPI(productId, userId);
            const { liked } = res.data;
            message.success(liked ? "Đã thêm vào yêu thích" : "Đã bỏ khỏi yêu thích");
            setLikedProductIds((prev) => (liked ? [...prev, productId] : prev.filter((id) => id !== productId)));
        } catch (error) {
            message.error("Lỗi khi xử lý yêu thích");
            console.error(error);
        }
    };

    const formatPrice = (price: any) => {
        if (!price) return "Đang cập nhật";
        const cleanPrice = String(price).replace(/\./g, "");
        const num = Number(cleanPrice);
        if (isNaN(num) || num <= 0) return "Đang cập nhật";
        return num.toLocaleString("vi-VN") + "₫";
    };

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const renderBestsellBadge = (bestsell?: string) => {
        switch (bestsell) {
            case "BESTSELLER":
                return <div className="product-badge best-seller">Best Seller</div>;
            case "HOT":
                return <div className="product-badge hot">Hot</div>;
            case "FEATURED":
                return <div className="product-badge featured">Featured</div>;
            default:
                return null;
        }
    };

    const renderSellBadge = (sell?: string | number) => {
        if (sell && !isNaN(Number(sell))) {
            return <div className="product-discount">Giảm {Number(sell)}%</div>;
        }
        return null;
    };

    // Compare selection local
    const [selectedCompareProducts, setSelectedCompareProducts] = useState<number[]>([]);

    const handleSelectCompare = (id: number) => {
        setSelectedCompareProducts((prev) => {
            if (prev.includes(id)) return prev.filter((pid) => pid !== id);
            if (prev.length >= 2) {
                message.warning("Chỉ được so sánh 2 sản phẩm một lúc");
                return prev;
            }
            const newSelected = [...prev, id];
            if (newSelected.length === 2) {
                const query = newSelected.join(",");
                window.location.href = `/compare?ids=${query}`;
            }
            return newSelected;
        });
    };

    return (
        <div className="pc-list-container">
            <div className="pc-list-wrapper">
                {loadingLikes && (
                    <div className="pc-list-overlay">
                        <PropagateLoader size={15} />
                    </div>
                )}

                <div className={`pc-list`}>
                    <Row gutter={[16, 16]}>
                        {products.map((product) => {
                            const isLiked = likedProductIds.includes(product.id);
                            return (
                                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                    <div className="pc-card">
                                        <Link to={`/product/${slugify(product.name)}-${product.id}`}>
                                            {renderBestsellBadge(product.bestsell)}
                                            {renderSellBadge(product.sell)}
                                            <div className="pc-image">
                                                <img
                                                    src={product.image ? `${import.meta.env.VITE_BACKEND_URL}/upload/products/${product.image}` : "/default-product.jpg"}
                                                    alt={product.name}
                                                />
                                            </div>
                                            <div className="pc-info">
                                                <div className="pc-name">{product.name}</div>
                                                <div className="pc-price">
                                                    {product.discountPrice ? (
                                                        <>
                                                            <span className="pc-price-current">{formatPrice(product.discountPrice)}</span>
                                                            <span className="pc-price-old">{formatPrice(product.price)}</span>
                                                        </>
                                                    ) : (
                                                        <span className="pc-price-current">{formatPrice(product.price)}</span>
                                                    )}
                                                </div>
                                                <div className="pc-stock">Kho: {product.quantity || 0} sản phẩm</div>

                                                <div className="pc-rating-like">
                                                    <div
                                                        className="pc-rating"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                        }}
                                                    >
                                                        <Rate
                                                            allowHalf
                                                            defaultValue={product.averageRating && product.averageRating > 0 ? product.averageRating : 5}
                                                            onChange={async (value) => {
                                                                if (!userId || isNaN(userId)) {
                                                                    message.warning("Bạn cần đăng nhập để đánh giá sản phẩm");
                                                                    return;
                                                                }
                                                                try {
                                                                    await addOrUpdateReviewAPI(product.id, userId, value);
                                                                    message.success(`Bạn đã đánh giá sản phẩm ${value} sao.`);
                                                                } catch (err) {
                                                                    console.error(err);
                                                                    message.error("Đánh giá thất bại");
                                                                }
                                                            }}
                                                        />
                                                        <span>{product.totalReviews && product.totalReviews > 0 ? `(${product.totalReviews})` : "(0)"}</span>
                                                    </div>

                                                    <div
                                                        className="pc-like"
                                                        title="Yêu thích"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleToggleLike(product.id);
                                                        }}
                                                    >
                                                        {isLiked ? <HeartFilled style={{ fontSize: 14, color: "red" }} /> : <HeartOutlined style={{ fontSize: 14, color: "gray" }} />}
                                                        <span className="like-text">Yêu thích</span>
                                                    </div>
                                                </div>

                                                <div className="pc-compare">
                                                    <button
                                                        className={`pc-compare-btn ${selectedCompareProducts.includes(product.id) ? "selected" : ""}`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleSelectCompare(product.id);
                                                        }}
                                                    >
                                                        {selectedCompareProducts.includes(product.id) ? "Đã chọn" : "So sánh"}
                                                    </button>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                </div>
            </div>

            {/* pagination nhỏ (nếu muốn) */}
            <div className="pagination">
                <button className="page-btn" onClick={() => setCurrent(Math.max(current - 1, 1))} disabled={current === 1}>
                    «
                </button>

                {Array.from({ length: 5 }, (_, i) => {
                    const startPage = Math.min(Math.max(current - 2, 1), Math.max(totalPages - 4, 1));
                    const pageNumber = startPage + i;
                    if (pageNumber > totalPages) return null;
                    return (
                        <button key={pageNumber} className={`page-number ${current === pageNumber ? "active" : ""}`} onClick={() => setCurrent(pageNumber)}>
                            {pageNumber}
                        </button>
                    );
                })}

                <button className="page-btn" onClick={() => setCurrent(Math.min(current + 1, totalPages))} disabled={current === totalPages}>
                    »
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
