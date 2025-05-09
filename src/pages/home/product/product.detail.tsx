import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProductDetailSlugAPI, addToCartAPI } from '@/services/api';
import { ShoppingCartOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { message } from 'antd';
import './product.detail.scss';

const ProductDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<IProductTable | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProductDetail = async () => {
            if (!slug) {
                setLoading(false);
                return;
            }
            const realSlug = slug.replace(/-\d+$/, '');
            try {
                const res = await getProductDetailSlugAPI(realSlug);
                setProduct(res.data);
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetail();
    }, [slug]);

    const formatPrice = (price: any) => {
        const num = Number(price);
        if (!price || isNaN(num) || num <= 0) {
            return 'Đang cập nhật';
        }
        return num.toLocaleString('vi-VN') + '₫';
    };

    const decreaseQty = () => setQuantity((prev) => Math.max(prev - 1, 1));
    const increaseQty = () => setQuantity((prev) => prev + 1);

    const handleAddToCart = async () => {
        if (!product) return;

        // Kiểm tra nếu số lượng trong kho không đủ
        const availableQuantity = Number(product.quantity);
        if (isNaN(availableQuantity) || availableQuantity <= 0) {
            message.error("Sản phẩm này đã hết hàng.");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user.id;

        if (!userId) {
            message.error("Bạn cần đăng nhập để thêm vào giỏ hàng.");
            return;
        }

        const cartData = {
            quantity,
            price: Number(product.price),
            productId: product.id,
            userId,
        };

        try {
            const res = await addToCartAPI(cartData);
            message.success("Đã thêm vào giỏ hàng!");
        } catch (err) {
            console.error("Lỗi khi thêm vào giỏ hàng:", err);
            message.error("Thêm vào giỏ hàng thất bại.");
        }
    };



    if (loading) return <div className="product-detail-loading">Đang tải chi tiết sản phẩm...</div>;
    if (!product) return <div>Không tìm thấy sản phẩm.</div>;

    return (
        <div className="product-detail">
            <div className="product-images">
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/upload/products/${product.image}`}
                    alt={product.name}
                    onError={(e) => (e.currentTarget.src = '/default-product.jpg')}
                />
            </div>
            <div className="product-info">
                <h1>{product.name}</h1>
                <p>Giá: {formatPrice(product.price)}</p>
                <p>Mô tả: {product.shortDescription || 'Đang cập nhật mô tả.'}</p>
                <p>Cấu hình: {product.detailDescription || 'Đang cập nhật.'}</p>
                <p>Kho còn: {product.quantity ?? 'Đang cập nhật'} sản phẩm</p>

                <div className="quantity-control">
                    <button onClick={decreaseQty}><MinusOutlined /></button>
                    <span>{quantity}</span>
                    <button onClick={increaseQty}><PlusOutlined /></button>
                </div>

                <button
                    className="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={!product.quantity || Number(product.quantity) <= 0}
                >
                    <ShoppingCartOutlined style={{ marginRight: 8 }} />
                    {Number(product.quantity) <= 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                </button>

            </div>
        </div>
    );
};

export default ProductDetail;
