import { useEffect, useState } from 'react';
import { getProductsAPI } from '@/services/api';
import './product.list.home.scss';
import { Link, useLocation } from 'react-router-dom';
import { slugify } from '@/utils/slugify';
import { PropagateLoader } from 'react-spinners';

const ProductList = () => {
    const [products, setProducts] = useState<IProductTable[]>([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const search = query.get('search') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let queryParams = `current=${current}&pageSize=${pageSize}`;

                if (search) {
                    const filterStr = `name~'${search}'`; // giả sử chỉ filter theo tên
                    queryParams += `&filter=${encodeURIComponent(filterStr)}`;
                }

                const response = await getProductsAPI(queryParams);
                const productList = response.data?.result ?? [];
                const totalProducts = response.data?.meta?.total || 0;

                setTimeout(() => {
                    setProducts(productList);
                    setTotal(totalProducts);
                    setLoading(false);
                }, 500); // giảm delay lại hợp lý hơn
            } catch (error) {
                console.error('Lỗi khi lấy sản phẩm:', error);
                setProducts([]);
                setTotal(0);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [current, pageSize, search]);


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
            {products.length > 0 ? (
                <>
                    <div className="product-list-wrapper">
                        {loading && (
                            <div className="product-list-overlay">
                                <PropagateLoader size={15} color="#36d6b4" />
                            </div>
                        )}
                        <div className={`product-list ${loading ? 'loading' : ''}`}>
                            {products.map((product) => (
                                <div className="product-card" key={product.id}>
                                    <Link to={`/product/${slugify(product.name)}-${product.id}`}>
                                        <div className="product-badge">Best Seller</div>
                                        <div className="product-discount">-20%</div>
                                        <div className="product-image">
                                            <img
                                                src={
                                                    product.image
                                                        ? `${import.meta.env.VITE_BACKEND_URL}/upload/products/${product.image}`
                                                        : '/default-product.jpg'
                                                }
                                                alt={product.name}
                                            />
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
                    </div>

                    {/* Pagination Controls */}
                    <div className="pagination">
                        <button onClick={() => setCurrent((prev) => Math.max(prev - 1, 1))} disabled={current === 1}>
                            Trang trước
                        </button>
                        <span>Trang {current} / {totalPages}</span>
                        <button onClick={() => setCurrent((prev) => Math.min(prev + 1, totalPages))} disabled={current === totalPages}>
                            Trang sau
                        </button>
                    </div>
                </>
            ) : loading ? (
                <div className="product-list-loading">Đang tải sản phẩm...</div>
            ) : (
                <div>Không có sản phẩm nào.</div>
            )}
        </div>
    );
};

export default ProductList;
