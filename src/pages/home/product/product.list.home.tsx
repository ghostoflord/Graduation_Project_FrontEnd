import { useEffect, useState } from 'react';
import { getProductsAPI } from '@/services/api';
import './product.list.home.scss';
import { Link } from 'react-router-dom';
import { slugify } from '@/utils/slugify';

const ProductList = () => {
    const [products, setProducts] = useState<IProductTable[]>([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                console.log(` Fetching current=${current}, pageSize=${pageSize}`);
                const response = await getProductsAPI(`current=${current}&pageSize=${pageSize}`);
                console.log('Response:', response.data);

                const productList = response.data?.result ?? [];
                const totalProducts = response.data?.meta?.total || 0;

                setProducts(productList);
                setTotal(totalProducts);
            } catch (error) {
                console.error('Lỗi khi lấy sản phẩm:', error);
                setProducts([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [current, pageSize]);

    const formatPrice = (price: any) => {
        if (!price) return 'Đang cập nhật';
        const cleanPrice = String(price).replace(/\./g, '');
        const num = Number(cleanPrice);
        if (isNaN(num) || num <= 0) return 'Đang cập nhật';
        return num.toLocaleString('vi-VN') + '₫';
    };

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="product-list-container">
            {loading ? (
                <div className="product-list-loading">Loading sản phẩm...</div>
            ) : products.length > 0 ? (
                <>
                    <div className="product-list">
                        {products.map((product) => (
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
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="pagination">
                        <button
                            onClick={() => setCurrent((prev) => Math.max(prev - 1, 1))}
                            disabled={current === 1}
                        >
                            Trang trước
                        </button>
                        <span>Trang {current} / {totalPages}</span>
                        <button
                            onClick={() => setCurrent((prev) => Math.min(prev + 1, totalPages))}
                            disabled={current === totalPages}
                        >
                            Trang sau
                        </button>
                    </div>
                </>
            ) : (
                <div>Không có sản phẩm nào.</div>
            )}
        </div>
    );
};

export default ProductList;
