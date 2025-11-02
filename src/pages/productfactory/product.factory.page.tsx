import React, { useMemo, useState, useEffect } from "react";
import { Empty, Spin } from "antd";
import "./product.factory.page.scss";
import ProductCard from "./productcardlist/product.card.list";
import SortBar from "./sortbar/sort.bar";
import FilterSidebar from "./filtersidebar/filter.sidebar";
import { getProductsAPI } from "@/services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";

export interface Product {
    id: string;
    name: string;
    brand: string;
    type: string;
    features: string[];
    size: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    image?: string;
}

const ProductFactoryPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<string>("default");
    const [keyword, setKeyword] = useState<string>("");
    const [current, setCurrent] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const search = query.get("search") || "";
    const sort = query.get("sort");
    const priceParam = query.get("price");
    const typeParam = query.get("type");

    // ✅ Parse priceParam: "1000000-5000000" → min, max
    let min = 0;
    let max = 0;
    if (priceParam) {
        const [minStr, maxStr] = priceParam.split("-");
        min = Number(minStr) || 0;
        max = Number(maxStr) || 0;
    }

    const [debouncedKeyword] = useDebounce(keyword, 500);
    const navigate = useNavigate();

    // ✅ Đồng bộ keyword vào URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (debouncedKeyword) params.set("search", debouncedKeyword);
        else params.delete("search");
        navigate(`?${params.toString()}`, { replace: true });
    }, [debouncedKeyword, navigate]);

    // ✅ Gọi API sản phẩm
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let queryParams = `current=${current}&pageSize=${pageSize}`;
                let filters: string[] = [];

                if (search) filters.push(`name like '%${search}%'`);
                if (typeParam) filters.push(`type='${typeParam}'`);

                // ✅ Lọc giá bằng 1 param duy nhất
                if (!isNaN(min) && min > 0 && !isNaN(max) && max > 0) {
                    filters.push(`price >= ${min} and price <= ${max}`);
                } else if (!isNaN(min) && min > 0) {
                    filters.push(`price >= ${min}`);
                } else if (!isNaN(max) && max > 0) {
                    filters.push(`price <= ${max}`);
                }

                // ✅ Gắn filter
                if (filters.length > 0) {
                    queryParams += `&filter=${encodeURIComponent(filters.join(" and "))}`;
                }

                // ✅ Gắn sort (backend hiểu đúng)
                if (sort && sort !== "default") {
                    let sortParam = "";
                    if (sort === "price_asc") sortParam = "price,asc";
                    else if (sort === "price_desc") sortParam = "price,desc";
                    else if (sort === "newest") sortParam = "createdAt,desc";
                    else sortParam = sort; // ví dụ name,asc
                    queryParams += `&sort=${encodeURIComponent(sortParam)}`;
                }

                // ✅ Call API
                const res = await getProductsAPI(queryParams);
                setProducts(res.data?.result || []);
                setTotal(res.data?.meta?.total || 0);
            } catch (err) {
                console.error(err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [current, search, sort, priceParam, typeParam, pageSize]);

    // ✅ Danh sách type, feature, size
    const factoryList = useMemo(
        () => Array.from(new Set(products.map((p) => p.type))).sort(),
        [products]
    );

    const handleSelectFactory = (factory: string) => {
        setSelectedTypes([factory]);
        const params = new URLSearchParams(window.location.search);
        params.set("type", factory);
        window.history.pushState({}, "", `?${params.toString()}`);
        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    const featureList = useMemo(
        () => Array.from(new Set(products.flatMap((p) => p.features || []))).sort(),
        [products]
    );

    const sizeList = useMemo(
        () => Array.from(new Set(products.map((p) => p.size))),
        [products]
    );

    return (
        <div className="product-page container">
            <div className="top-categories">
                <div className="pill-list">
                    {factoryList.length > 0 ? (
                        factoryList.map((factory) => (
                            <span
                                key={factory}
                                onClick={() => handleSelectFactory(factory)}
                                className={selectedTypes.includes(factory) ? "active" : ""}
                            >
                                {factory}
                            </span>
                        ))
                    ) : (
                        <span>Đang tải danh mục...</span>
                    )}
                </div>
            </div>

            <div className="content">
                <aside className="sidebar">
                    <FilterSidebar
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        brands={[]}
                        selectedBrands={selectedBrands}
                        setSelectedBrands={setSelectedBrands}
                        types={factoryList}
                        selectedTypes={selectedTypes}
                        setSelectedTypes={setSelectedTypes}
                        features={featureList}
                        selectedFeatures={selectedFeatures}
                        setSelectedFeatures={setSelectedFeatures}
                        sizes={sizeList}
                        selectedSizes={selectedSizes}
                        setSelectedSizes={setSelectedSizes}
                    />
                </aside>

                <main className="main">
                    <div className="sort-row">
                        <div className="left-search">
                            <input
                                type="text"
                                className="mini-search"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>
                        <div className="sort-controls">
                            <SortBar
                                value={sortBy}
                                onChange={(val) => {
                                    setSortBy(val);
                                    const params = new URLSearchParams(window.location.search);
                                    if (val === "default") params.delete("sort");
                                    else params.set("sort", val);
                                    window.history.pushState({}, "", `?${params.toString()}`);
                                    window.dispatchEvent(new PopStateEvent("popstate"));
                                }}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-wrap">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <div className="product-grid">
                            {products.length > 0 ? (
                                <ProductCard
                                    products={products}
                                    total={total}
                                    current={current}
                                    setCurrent={setCurrent}
                                    pageSize={pageSize}
                                    filterParams={{
                                        search,
                                        sort,
                                        price: priceParam || "",
                                    }}
                                />
                            ) : (
                                <Empty description="Không có sản phẩm" />
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductFactoryPage;
