import React, { useState, useEffect } from "react";
import { Empty, Spin } from "antd";
import "./product.factory.page.scss";
import ProductCard from "./productcardlist/product.card.list";
import SortBar from "./sortbar/sort.bar";
import FilterSidebar from "./filtersidebar/filter.sidebar";
import { getProductsAPI } from "@/services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { CPU_LIST, GPU_LIST, RAM_LIST, ROM_LIST, SCREEN_LIST } from "./productenum/product.enum";
import FactoryBreadcrumb from "../productbreadcrumb/productfactorybreadcrumd/product.factory.breadcrumd";

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
    factory?: string;
    category?: string;
}

const ProductFactoryPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    const [sortBy, setSortBy] = useState<string>("default");
    const [keyword, setKeyword] = useState<string>("");
    const [current, setCurrent] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [brands, setBrands] = useState<string[]>([]);

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const search = query.get("search") || "";
    const sort = query.get("sort");
    const priceParam = query.get("price");
    const typeParam = query.get("factory");
    const categoryParam = query.get("category");

    const [debouncedKeyword] = useDebounce(keyword, 500);
    const navigate = useNavigate();

    const [factoryList, setFactoryList] = useState<string[]>([]);
    const [featureList, setFeatureList] = useState<string[]>([]);
    const [sizeList, setSizeList] = useState<string[]>([]);

    const [selectedCpus, setSelectedCpus] = useState<string[]>([]);
    const [selectedGpus, setSelectedGpus] = useState<string[]>([]);
    const [selectedRams, setSelectedRams] = useState<string[]>([]);
    const [selectedRoms, setSelectedRoms] = useState<string[]>([]);
    const [selectedScreens, setSelectedScreens] = useState<string[]>([]);
    // Parse priceParam: "1000000-5000000" → min, max
    let min = 0;
    let max = 0;
    if (priceParam) {
        const [minStr, maxStr] = priceParam.split("-");
        min = Number(minStr) || 0;
        max = Number(maxStr) || 0;
    }

    // Đồng bộ keyword vào URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (debouncedKeyword) params.set("search", debouncedKeyword);
        else params.delete("search");
        navigate(`?${params.toString()}`, { replace: true });
    }, [debouncedKeyword, navigate]);

    // Gọi API sản phẩm
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let queryParams = `current=${current}&pageSize=${pageSize}`;
                let filters: string[] = [];

                if (search) filters.push(`name like '%${search}%'`);
                if (typeParam) filters.push(`factory='${typeParam}'`);
                if (categoryParam) filters.push(`category='${categoryParam}'`);

                // Lọc giá bằng 1 param duy nhất
                if (!isNaN(min) && min > 0 && !isNaN(max) && max > 0) {
                    filters.push(`price >= ${min} and price <= ${max}`);
                } else if (!isNaN(min) && min > 0) {
                    filters.push(`price >= ${min}`);
                } else if (!isNaN(max) && max > 0) {
                    filters.push(`price <= ${max}`);
                }

                if (selectedCpus.length > 0) filters.push(`productDetail.cpu~'${selectedCpus[0]}'`);
                if (selectedGpus.length > 0) filters.push(`productDetail.gpu~'${selectedGpus[0]}'`);
                if (selectedRams.length > 0) filters.push(`productDetail.ram~'${selectedRams[0]}'`);
                if (selectedRoms.length > 0) filters.push(`productDetail.storage~'${selectedRoms[0]}'`);
                if (selectedScreens.length > 0) filters.push(`productDetail.screen~'${selectedScreens[0].split(" ")[0]}'`);

                // Gắn filter
                if (filters.length > 0) {
                    queryParams += `&filter=${encodeURIComponent(filters.join(" and "))}`;
                }

                // Gắn sort (backend hiểu đúng)
                if (sort && sort !== "default") {
                    let sortParam = "";
                    if (sort === "price_asc") sortParam = "price,asc";
                    else if (sort === "price_desc") sortParam = "price,desc";
                    else if (sort === "newest") sortParam = "createdAt,desc";
                    else sortParam = sort; // ví dụ name,asc
                    queryParams += `&sort=${encodeURIComponent(sortParam)}`;
                }

                // Call API
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
    }, [current, search, sort, priceParam, typeParam, categoryParam, selectedCpus, selectedGpus, selectedRams, selectedRoms, selectedScreens, pageSize]);

    useEffect(() => {
        const newFactories = Array.from(new Set(products.map(p => p.factory))).sort();
        if (newFactories.length > 0) setFactoryList(prev => Array.from(new Set([...prev, ...newFactories])));

        const newFeatures = Array.from(new Set(products.flatMap(p => p.features || []))).sort();
        if (newFeatures.length > 0) setFeatureList(prev => Array.from(new Set([...prev, ...newFeatures])));

        const newSizes = Array.from(new Set(products.map(p => p.size))).sort();
        if (newSizes.length > 0) setSizeList(prev => Array.from(new Set([...prev, ...newSizes])));

        const newBrands = Array.from(new Set(products.map(p => p.category))).sort();
        if (newBrands.length > 0) setBrands(prev => Array.from(new Set([...prev, ...newBrands])));

    }, [products]);

    return (
        <>
            <FactoryBreadcrumb />
            <div className="product-page container">

                <div className="content">
                    <aside className="sidebar">
                        <FilterSidebar
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            selectedBrands={selectedBrands}
                            setSelectedBrands={setSelectedBrands}
                            types={factoryList}
                            selectedTypes={selectedTypes}
                            setSelectedTypes={setSelectedTypes}
                            features={featureList}
                            selectedFeatures={selectedFeatures}
                            setSelectedFeatures={setSelectedFeatures}
                            sizes={sizeList}
                            brands={brands}

                            cpus={CPU_LIST}
                            selectedCpus={selectedCpus}
                            setSelectedCpus={setSelectedCpus}
                            gpus={GPU_LIST}
                            selectedGpus={selectedGpus}
                            setSelectedGpus={setSelectedGpus}
                            rams={RAM_LIST}
                            selectedRams={selectedRams}
                            setSelectedRams={setSelectedRams}
                            roms={ROM_LIST}
                            selectedRoms={selectedRoms}
                            setSelectedRoms={setSelectedRoms}
                            screen={SCREEN_LIST}
                            selectedScreens={selectedScreens}
                            setSelectedScreens={setSelectedScreens}
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
        </>
    );
};

export default ProductFactoryPage;
