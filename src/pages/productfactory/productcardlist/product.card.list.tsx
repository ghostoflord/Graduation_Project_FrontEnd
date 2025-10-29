import React from "react";
import { Link } from "react-router-dom";
import { Rate, message } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { addOrUpdateReviewAPI } from "@/services/api";
import { slugify } from "@/utils/slugify";
import "./product.card.list.scss";


interface Product {
    id: number;
    name: string;
    price: number;
    discountPrice?: number;
    image?: string;
    quantity?: number;
    averageRating?: number;
    totalReviews?: number;
    bestsell?: boolean;
    sell?: boolean;
}

interface Props {
    product: Product;
    userId?: number | null;
    selectedCompareProducts?: number[];
    handleSelectCompare: (id: number) => void;
    handleToggleLike: (id: number) => void;
    isLiked: boolean;
}

const ProductCard: React.FC<Props> = ({
    product,
    userId,
    selectedCompareProducts = [],
    handleSelectCompare,
    handleToggleLike,
    isLiked
}) => {
    // --- format tiền tệ ---
    const formatPrice = (price: number) =>
        price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    // --- badge sản phẩm ---
    const renderBestsellBadge = (bestsell?: boolean) =>
        bestsell ? <div className="product-badge best-seller">Best Seller</div> : null;

    const renderSellBadge = (sell?: boolean) =>
        sell ? <div className="product-discount">Hot</div> : null;

    return (
        <div className="pc-card" key={product.id}>
            <Link to={`/product/${slugify(product.name)}-${product.id}`}>
                {product.bestsell && <div className="pc-badge pc-bestseller">Best Seller</div>}
                {product.sell && <div className="pc-badge pc-hot">Hot</div>}

                <div className="pc-image">
                    <img
                        src={product.image
                            ? `${import.meta.env.VITE_BACKEND_URL}/upload/products/${product.image}`
                            : "/default-product.jpg"}
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
                        <div className="pc-rating" onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
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
                                        message.success(`Bạn đã đánh giá ${value} sao.`);
                                    } catch (err) {
                                        console.error(err);
                                        message.error("Đánh giá thất bại");
                                    }
                                }}
                            />
                            <span>({product.totalReviews || 0})</span>
                        </div>

                        <div className="pc-like" title="Yêu thích" onClick={(e) => { e.preventDefault(); handleToggleLike(product.id); }}>
                            {isLiked ? <HeartFilled style={{ fontSize: 14, color: "red" }} /> : <HeartOutlined style={{ fontSize: 14, color: "gray" }} />}
                            <span className="pc-like-text">Yêu thích</span>
                        </div>
                    </div>

                    <div className="pc-compare">
                        <button
                            className={`pc-compare-btn ${selectedCompareProducts?.includes(product.id) ? "selected" : ""}`}
                            onClick={(e) => { e.preventDefault(); handleSelectCompare(product.id); }}
                        >
                            {selectedCompareProducts?.includes(product.id) ? "Đã chọn" : "So sánh"}
                        </button>
                    </div>
                </div>
            </Link>
        </div>

    );
};

export default ProductCard;
