import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProductDetailSlugAPI } from '@/services/api';
import './product.detail.scss';

const ProductDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<IProductTable | null>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="product-detail-loading">Đang tải chi tiết sản phẩm...</div>;
    if (!product) return <div>Không tìm thấy sản phẩm.</div>;

    return (
        <div className="product-detail">
            <div className="product-images">
                <img src={product.image || '/default-product.jpg'} alt={product.name} />
            </div>
            <div className="product-info">
                <h1>{product.name}</h1>
                <p>Giá: {formatPrice(product.price)}</p>
                <p>Mô tả: {product.shortDescription || 'Đang cập nhật mô tả.'}</p>
                <p>Cấu hình: {product.detailDescription || 'Đang cập nhật.'}</p>
                <p>Kho còn: {product.quantity ?? 'Đang cập nhật'} sản phẩm</p>
                <button className="add-to-cart-btn">Thêm vào giỏ hàng</button>
            </div>
        </div>
    );
};

export default ProductDetail;
