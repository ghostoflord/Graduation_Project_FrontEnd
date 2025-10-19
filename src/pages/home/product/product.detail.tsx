import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProductDetailSlugAPI, addToCartAPI, getCart, useCartStore } from '@/services/api';
import { ShoppingCartOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Modal, Tag } from 'antd';
import './product.detail.scss';
import { useCurrentApp } from '@/components/context/app.context';
import ProductInfo from '@/components/client/product.info/product.info';
import ProductBreadcrumb from '@/pages/productbreadcrumb/product.bread.crumb';

const ProductDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<IProductTable | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { setCartSummary } = useCurrentApp();
    const navigate = useNavigate();
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // ảnh đang chọn
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const [currentIndex, setCurrentIndex] = useState(0);

    // fetch sản phẩm
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

    // khi product thay đổi thì set ảnh mặc định
    useEffect(() => {
        if (product?.image) {
            const defaultImg = `${import.meta.env.VITE_BACKEND_URL}/upload/products/${product.image}`;
            setSelectedImage(defaultImg);
            setCurrentIndex(0);
        }
    }, [product]);

    // list ảnh
    const images = [
        product?.image
            ? `${import.meta.env.VITE_BACKEND_URL}/upload/products/${product.image}`
            : "/default-product.jpg",
        ...(product?.images?.map(
            (img) => `${import.meta.env.VITE_BACKEND_URL}/upload/products/${img.imageUrl}`
        ) || []),
    ];

    // xử lý prev/next
    const handlePrevImage = () => {
        if (!images.length) return;
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        setCurrentIndex(newIndex);
        setSelectedImage(images[newIndex]);
    };

    const handleNextImage = () => {
        if (!images.length) return;
        const newIndex = (currentIndex + 1) % images.length;
        setCurrentIndex(newIndex);
        setSelectedImage(images[newIndex]);
    };

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

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user.id;

        if (!userId) {
            message.error("Bạn cần đăng nhập để thêm vào giỏ hàng.");
            return;
        }

        try {
            const res = await getCart(userId);
            const existingItem = res?.data?.items?.find((item: any) => item.productId === product.id);
            const currentQtyInCart = existingItem?.quantity || 0;
            const totalQty = currentQtyInCart + quantity;

            if (totalQty > availableQuantity) {
                message.warning(`Tổng số lượng vượt quá tồn kho (${availableQuantity}).`);
                return;
            }

            const cartData = {
                quantity,
                price: Number(product.price),
                productId: product.id,
                userId,
            };

            await addToCartAPI(cartData);
            message.success("Đã thêm vào giỏ hàng!");

            const updatedCart = await getCart(userId);
            if (updatedCart?.data) {
                setCartSummary(updatedCart.data);
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
                quantity: quantity,
                price: product.price,
                userId
            };

            await addToCartAPI(buyItem);

            useCartStore.getState().addItem({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
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
        <>
            {product && (
                <ProductBreadcrumb brand={product.slug} name={product.name} />
            )}
            <div className="product-detail">
                <div className="product-images">
                    <div className="main-image">
                        <button className="nav-btn left" onClick={handlePrevImage}>‹</button>
                        <img
                            src={selectedImage || "/default-product.jpg"}
                            alt={product.name}
                            onError={(e) => (e.currentTarget.src = "/default-product.jpg")}
                            onClick={() => setIsPreviewOpen(true)}
                        />
                        <button className="nav-btn right" onClick={handleNextImage}>›</button>
                    </div>


                    <div className="thumbnail-list">
                        {images.map((url, idx) => (
                            <img
                                key={idx}
                                src={url}
                                alt={`thumb-${idx}`}
                                className={selectedImage === url ? "active" : ""}
                                onClick={() => setSelectedImage(url)}
                                onError={(e) => (e.currentTarget.src = "/default-product.jpg")}
                            />
                        ))}
                    </div>
                </div>

                {/* phần info giữ nguyên của ông */}
                <div className="product-info">
                    <h1>{product.name}</h1>
                    <div className="price-box">
                        {product.discountPrice && Number(product.discountPrice) > 0 ? (
                            <>
                                <div className="price-current text-red-500">
                                    {formatPrice(product.discountPrice)}
                                </div>
                                <div className="price-old line-through text-gray-500">
                                    {formatPrice(product.price)}
                                </div>
                                <Tag color="red">
                                    -{Math.round(100 - (Number(product.discountPrice) / Number(product.price)) * 100)}%
                                </Tag>
                            </>
                        ) : (
                            <div className="price-current">{formatPrice(product.price)}</div>
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

            <Modal
                open={isPreviewOpen}
                onCancel={() => setIsPreviewOpen(false)}
                footer={null}
                centered
                width={800}
                className="image-preview-modal"
            >
                <img
                    src={selectedImage || "/default-product.jpg"}
                    alt="preview"
                    style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: 8,
                        objectFit: 'contain',
                    }}
                />
            </Modal>

        </>
    );
};

export default ProductDetail;
