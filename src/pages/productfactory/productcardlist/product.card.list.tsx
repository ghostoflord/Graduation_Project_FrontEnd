import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Rate, message } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { addOrUpdateReviewAPI } from "@/services/api";
import slugify from "slugify";
import "./ProductCard.scss";

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
    selectedCompareProducts: number[];
    handleSelectCompare: (id: number) => void;
    handleToggleLike: (id: number) => void;
    isLiked: boolean;
}

const ProductCard: React.FC<Props> = ({
    product,
    userId,
    selectedCompareProducts,
    handleSelectCompare,
    handleToggleLike,
    isLiked
}) => {
    const formatPrice = (price: number) =>
        price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    const renderBestsellBadge = (bestsell?: boolean) =>
        bestsell ? <div className="product-badge best-seller">Best Seller</div> : null;

    const renderSellBadge = (sell?: boolean) =>
        sell ? <div className="product-discount">Hot</div> : null;

    return (
        <div className="product-card" key={product.id}>
            <Link to={`/product/${slugify(product.name)}-${product.id}`}>
                {renderBestsellBadge(product.bestsell)}
                {renderSellBadge(product.sell)}

                <div className="product-image">
                    <img
                        src={
                            product.image
                                ? `${import.meta.env.VITE_BACKEND_URL}/upload/products/${product.image}`
                                : "/default-product.jpg"
                        }
                        alt={product.name}
                    />
                </div>

                <div className="product-info">
                    <div className="product-name">{product.name}</div>

                    <div className="product-price">
                        {product.discountPrice ? (
                            <>
                                <span className="price-current">
                                    {formatPrice(product.discountPrice)}
                                </span>
                                <span className="price-old">
                                    {formatPrice(product.price)}
                                </span>
                            </>
                        ) : (
                            <span className="price-current">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>

                    <div className="product-stock">
                        Kho: {product.quantity || 0} sản phẩm
                    </div>

                    <div className="product-rating-like">
                        <div
                            className="product-rating"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                            }}
                        >
                            <Rate
                                allowHalf
                                defaultValue={
                                    product.averageRating && product.averageRating > 0
                                        ? product.averageRating
                                        : 5
                                }
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
                            <span>
                                {product.totalReviews && product.totalReviews > 0
                                    ? `(${product.totalReviews})`
                                    : "(0)"}
                            </span>
                        </div>

                        <div
                            className="product-like"
                            title="Yêu thích"
                            onClick={(e) => {
                                e.preventDefault();
                                handleToggleLike(product.id);
                            }}
                        >
                            {isLiked ? (
                                <HeartFilled style={{ fontSize: 14, color: "red" }} />
                            ) : (
                                <HeartOutlined style={{ fontSize: 14, color: "gray" }} />
                            )}
                            <span className="like-text">Yêu thích</span>
                        </div>
                    </div>

                    <div className="product-compare">
                        <button
                            className={`compare-btn ${selectedCompareProducts.includes(product.id)
                                    ? "selected"
                                    : ""
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleSelectCompare(product.id);
                            }}
                        >
                            {selectedCompareProducts.includes(product.id)
                                ? "Đã chọn"
                                : "So sánh"}
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
