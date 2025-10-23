import { useEffect, useState } from 'react';
import { addOrUpdateReviewAPI, getLikedProductsAPI, getProductsAPI, toggleLikeAPI } from '@/services/api';
import './product.list.home.scss';
import { Link, useLocation } from 'react-router-dom';
import { slugify } from '@/utils/slugify';
import { PropagateLoader } from 'react-spinners';
import { Rate, message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState<IProductTable[]>([]);

    const [likedProductIds, setLikedProductIds] = useState<number[]>([]);

    const [loading, setLoading] = useState(true);

    const [current, setCurrent] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const search = query.get('search') || '';
    const sort = query.get('sort');
    const priceFrom = query.get('priceFrom');
    const priceTo = query.get('priceTo');

    const [selectedCompareProducts, setSelectedCompareProducts] = useState<number[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const urlFilter = query.get('filter'); // lấy filter từ URL
                let queryParams = '';

                if (urlFilter) {
                    // Nếu có filter từ URL → chỉ call filter, bỏ pagination
                    queryParams = `filter=${encodeURIComponent(urlFilter)}`;
                } else {
                    // Nếu không có filter → dùng pagination + search + sort + priceFrom/priceTo bình thường
                    queryParams = `current=${current}&pageSize=${pageSize}`;
                    let filters: string[] = [];

                    if (search) filters.push(`name~'${search}'`);
                    if (priceFrom) filters.push(`price>=${priceFrom}`);
                    if (priceTo) filters.push(`price<=${priceTo}`);

                    if (filters.length > 0) {
                        const filterStr = filters.join(';');
                        queryParams += `&filter=${encodeURIComponent(filterStr)}`;
                    }

                    if (sort === 'price_asc') queryParams += `&sort=price`;
                    else if (sort === 'price_desc') queryParams += `&sort=price,desc`;
                }

                const response = await getProductsAPI(queryParams);
                setProducts(response.data?.result ?? []);
                setTotal(response.data?.meta?.total || 0);
            } catch (error) {
                console.error('Lỗi khi lấy sản phẩm:', error);
                setProducts([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };

        const fetchLikedProducts = async () => {
            try {
                if (!userId) return;
                const res = await getLikedProductsAPI(userId);
                const likedIds = res.data.map((like: any) => like.productId);
                setLikedProductIds(likedIds);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách yêu thích:', error);
            }
        };

        fetchProducts();
        fetchLikedProducts();
    }, [current, pageSize, search, sort, priceFrom, priceTo, userId, location.search]); // thêm location.search để filter URL update

    const handleToggleLike = async (productId: number,) => {
        if (!userId || isNaN(userId) || userId <= 0) {
            message.warning('Bạn cần đăng nhập để yêu thích sản phẩm');
            return;
        }

        try {
            const res = await toggleLikeAPI(productId, userId);
            const { liked } = res.data;

            message.success(liked ? 'Đã thêm vào yêu thích' : 'Đã bỏ khỏi yêu thích');

            setLikedProductIds((prev) =>
                liked ? [...prev, productId] : prev.filter((id) => id !== productId)
            );
        } catch (error) {
            message.error('Lỗi khi xử lý yêu thích');
        }
    };

    const formatPrice = (price: any) => {
        if (!price) return 'Đang cập nhật';
        const cleanPrice = String(price).replace(/\./g, '');
        const num = Number(cleanPrice);
        if (isNaN(num) || num <= 0) return 'Đang cập nhật';
        return num.toLocaleString('vi-VN') + '₫';
    };

    const totalPages = Math.ceil(total / pageSize);

    const renderBestsellBadge = (bestsell: string) => {
        switch (bestsell) {
            case 'BESTSELLER':
                return <div className="product-badge best-seller">Best Seller</div>;
            case 'HOT':
                return <div className="product-badge hot">Hot</div>;
            case 'FEATURED':
                return <div className="product-badge featured">Featured</div>;
            default:
                return null;
        }
    };

    const renderSellBadge = (sell: string) => {
        if (sell && !isNaN(Number(sell))) {
            const discountPercentage = Number(sell);
            return <div className="product-discount">Giảm {discountPercentage}%</div>;
        }
        return null;
    };


    const handleSelectCompare = (id: number) => {
        setSelectedCompareProducts((prev) => {
            if (prev.includes(id)) {
                return prev.filter((pid) => pid !== id); // Bỏ chọn
            }

            if (prev.length >= 2) {
                message.warning("Chỉ được so sánh 2 sản phẩm một lúc");
                return prev;
            }

            const newSelected = [...prev, id];
            if (newSelected.length === 2) {
                const query = newSelected.join(",");
                navigate(`/compare?ids=${query}`);
            }

            return newSelected;
        });
    };

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
                            {products.map((product) => {
                                const isLiked = likedProductIds.includes(product.id);
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
                                                            : '/default-product.jpg'
                                                    }
                                                    alt={product.name}
                                                />
                                            </div>
                                            <div className="product-info">
                                                <div className="product-name">{product.name}</div>
                                                <div className="product-price">
                                                    {product.discountPrice ? (
                                                        <>
                                                            <span className="price-current">{formatPrice(product.discountPrice)}</span>
                                                            <span className="price-old">{formatPrice(product.price)}</span>
                                                        </>
                                                    ) : (
                                                        <span className="price-current">{formatPrice(product.price)}</span>
                                                    )}
                                                </div>
                                                <div className="product-stock">Kho: {product.quantity || 0} sản phẩm</div>
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
                                                            defaultValue={product.averageRating && product.averageRating > 0 ? product.averageRating : 5}
                                                            onChange={async (value) => {
                                                                if (!userId || isNaN(userId)) {
                                                                    message.warning('Bạn cần đăng nhập để đánh giá sản phẩm');
                                                                    return;
                                                                }

                                                                try {
                                                                    await addOrUpdateReviewAPI(product.id, userId, value);
                                                                    message.success(`Bạn đã đánh giá sản phẩm ${value} sao.`);
                                                                } catch (err) {
                                                                    console.error(err);
                                                                    message.error('Đánh giá thất bại');
                                                                }
                                                            }}
                                                        />

                                                        <span>
                                                            {product.totalReviews && product.totalReviews > 0
                                                                ? `(${product.totalReviews})`
                                                                : '(0)'}
                                                        </span>
                                                    </div>

                                                    <div
                                                        className="product-like"
                                                        title="Yêu thích"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleToggleLike(product.id,);
                                                        }}
                                                    >
                                                        {isLiked ? (
                                                            <HeartFilled style={{ fontSize: 14, color: 'red' }} />
                                                        ) : (
                                                            <HeartOutlined style={{ fontSize: 14, color: 'gray' }} />
                                                        )}
                                                        <span className="like-text">Yêu thích</span>
                                                    </div>
                                                </div>
                                                <div className="product-compare">
                                                    <button
                                                        className={`compare-btn ${selectedCompareProducts.includes(product.id) ? 'selected' : ''
                                                            }`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleSelectCompare(product.id);
                                                        }}
                                                    >
                                                        {selectedCompareProducts.includes(product.id) ? 'Đã chọn' : 'So sánh'}
                                                    </button>
                                                </div>

                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pagination">
                        <button
                            className="page-btn"
                            onClick={() => setCurrent((prev) => Math.max(prev - 1, 1))}
                            disabled={current === 1}
                        >
                            «
                        </button>

                        {Array.from({ length: 5 }, (_, i) => {
                            const startPage = Math.min(
                                Math.max(current - 2, 1),
                                Math.max(totalPages - 4, 1)
                            );
                            const pageNumber = startPage + i;
                            if (pageNumber > totalPages) return null;

                            return (
                                <button
                                    key={pageNumber}
                                    className={`page-number ${current === pageNumber ? 'active' : ''}`}
                                    onClick={() => setCurrent(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}

                        <button
                            className="page-btn"
                            onClick={() => setCurrent((prev) => Math.min(prev + 1, totalPages))}
                            disabled={current === totalPages}
                        >
                            »
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
