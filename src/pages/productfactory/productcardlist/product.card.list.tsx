import React from "react";
import { Card, Tag, Tooltip } from "antd";
import type { Product } from "../product.factory.page"; // ✅ import type từ trang chính

const formatVND = (n: number) =>
    n.toLocaleString("vi-VN") + "₫";

const placeholder =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>
            <rect width='100%' height='100%' fill='#f5f6fa'/>
            <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#c8c9ce' font-size='18'>
                No image
            </text>
        </svg>`
    );

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    return (
        <Card
            className="product-card"
            hoverable
            cover={
                <div className="product-image">
                    <img src={product.image || placeholder} alt={product.name} />
                    {product.discount ? (
                        <Tag className="discount-tag">Giảm {product.discount}%</Tag>
                    ) : null}
                </div>
            }
        >
            <div className="card-body">
                <h4 className="product-name" title={product.name}>
                    {product.name}
                </h4>

                <div className="price-row">
                    <div className="price">{formatVND(product.price)}</div>
                    {product.oldPrice && (
                        <div className="old-price">{formatVND(product.oldPrice)}</div>
                    )}
                </div>

                <div className="meta-row">
                    <div className="meta-item">{product.features?.join(", ") || ""}</div>
                    <div className="meta-item">{product.size}</div>
                </div>

                <div className="card-footer">
                    <Tooltip title="So sánh">
                        <label className="compare">
                            <input type="radio" name="compare" />
                            <span> So sánh</span>
                        </label>
                    </Tooltip>
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;
