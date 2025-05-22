import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProductDetailSlugAPI, addToCartAPI, getCart, useCartStore } from '@/services/api';
import { ShoppingCartOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Tag } from 'antd';
import './product.detail.scss';
import { useCurrentApp } from '@/components/context/app.context';
import ProductInfo from '@/components/client/product.info/product.info';

const ProductDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<IProductTable | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { setCartSummary } = useCurrentApp();
    const navigate = useNavigate();

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

    const increaseQty = () => {
        if (!product) return;
        setQuantity((prev) => {
            if (prev >= Number(product.quantity)) {
                message.warning(`Sản phẩm chỉ còn ${product.quantity} trong kho.`);
                return prev;
            }
            return prev + 1;
        });
    };

    const handleAddToCart = async () => {
        if (!product) return;

        const availableQuantity = Number(product.quantity);
        if (isNaN(availableQuantity) || availableQuantity <= 0) {
            message.error("Sản phẩm này đã hết hàng.");
            return;
        }

        if (quantity > availableQuantity) {
            message.error(`Số lượng bạn chọn vượt quá số lượng tồn kho (${availableQuantity}).`);
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
            await addToCartAPI(cartData);
            message.success("Đã thêm vào giỏ hàng!");

            const res = await getCart(userId);
            if (res?.data) {
                setCartSummary(res.data);
            }

        } catch (err) {
            console.error("Lỗi khi thêm vào giỏ hàng:", err);
            message.error("Thêm vào giỏ hàng thất bại.");
        }
    };

    const handleBuyNow = async () => {
        if (!product) return;

        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            message.warning('Vui lòng đăng nhập để tiếp tục');
            navigate('/login');
            return;
        }

        try {
            const user = JSON.parse(storedUser);
            const userId = user.id;

            const buyItem = {
                productId: product.id,
                quantity: 1,
                price: product.price,
                userId
            };

            await addToCartAPI(buyItem);

            useCartStore.getState().addItem({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image,
                shortDescription: product.shortDescription,
                detailDescription: product.detailDescription,
            });

            const res = await getCart(userId);
            if (res?.data) {
                setCartSummary(res.data);
            }

            navigate('/thanh-toan');
        } catch (error) {
            console.error(error);
            message.error('Không thể mua ngay');
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
                <div className="price-box">
                    <div className="price-current">{formatPrice(product.price)}</div>
                    {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                        <>
                            <div className="price-old">{formatPrice(product.originalPrice)}</div>
                            <Tag color="red">
                                {Math.round(100 - (Number(product.price) / Number(product.originalPrice)) * 100)}%
                            </Tag>
                        </>
                    )}
                </div>
                <p className="product-desc">{product.shortDescription || 'Đang cập nhật mô tả.'}</p>
                <p className="product-config"><b>Cấu hình:</b> {product.detailDescription || 'Đang cập nhật.'}</p>
                <p className="product-stock">Kho còn: {product.quantity ?? 'Đang cập nhật'} sản phẩm</p>

                <div className="quantity-control">
                    <button onClick={decreaseQty}><MinusOutlined /></button>
                    <span>{quantity}</span>
                    <button onClick={increaseQty}><PlusOutlined /></button>
                </div>

                <div className="action-buttons">
                    <button
                        className="add-to-cart-btn"
                        onClick={handleAddToCart}
                        disabled={!product.quantity || Number(product.quantity) <= 0}
                    >
                        <ShoppingCartOutlined style={{ marginRight: 8 }} />
                        {Number(product.quantity) <= 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                    </button>

                    <button
                        className="buy-now-btn"
                        disabled={!product.quantity || Number(product.quantity) <= 0}
                        onClick={handleBuyNow}
                    >
                        Mua ngay
                    </button>
                </div>

            </div>

            <div className="product-info-wrapper">
                <ProductInfo productId={product.id} />
            </div>
        </div>
    );
};

export default ProductDetail;
