import { useEffect, useState } from 'react';
import { getProductsAPI } from '@/services/api';
import './product.list.home.scss';
import { Link } from 'react-router-dom';
import { slugify } from '@/utils/slugify';
const ProductList = () => {
    const [products, setProducts] = useState<IProductTable[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProductsAPI('limit=10&page=1');
                const productList = response.data?.result ?? [];
                setProducts(productList);
            } catch (error) {
                console.error('Lỗi khi lấy sản phẩm:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div className="product-list-loading">Loading sản phẩm...</div>;
    const formatPrice = (price: any) => {
        if (!price) return 'Đang cập nhật';

        const cleanPrice = String(price).replace(/\./g, '');

        const num = Number(cleanPrice);

        if (isNaN(num) || num <= 0) {
            return 'Đang cập nhật';
        }

        return num.toLocaleString('vi-VN') + '₫';
    };
    return (
        <div className="product-list">
            {products.length > 0 ? (
                products.map((product) => (
                    <div className="product-card" key={product.id}>
                        <Link to={`/product/${slugify(product.name)}-${product.id}`}>
                            <div className="product-badge">Best Seller</div>
                            <div className="product-discount">-20%</div>
                            <div className="product-image">
                                <img src={product.image || '/default-product.jpg'} alt={product.name} />
                            </div>
                            <div className="product-info">
                                <div className="product-name">{product.name}</div>
                                <div className="product-price">
                                    <span className="price-current">{formatPrice(product.price)}</span>
                                    <span className="price-old">{product.priceOld ? formatPrice(product.priceOld) : ''}</span>
                                </div>
                                <div className="product-stock">Kho: {product.quantity || 0} sản phẩm</div>
                            </div>
                        </Link>
                    </div>
                ))
            ) : (
                <div>Không có sản phẩm nào.</div>
            )}
        </div>
    );
};

export default ProductList;
