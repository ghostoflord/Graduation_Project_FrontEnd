import React from "react";
import { Button, Slider, InputNumber, Checkbox } from "antd";
import "./filter.sidebar.scss";
import { CATEGORY_LIST, FACTORY_LIST } from "../productenum/product.enum";
interface Props {
    priceRange: [number, number];
    setPriceRange: (r: [number, number]) => void;
    brands: string[];
    selectedBrands: string[];
    setSelectedBrands: (b: string[]) => void;
    types: string[];
    selectedTypes: string[];
    setSelectedTypes: (t: string[]) => void;
    features: string[];
    selectedFeatures: string[];
    setSelectedFeatures: (f: string[]) => void;
    sizes: string[];
    selectedSizes: string[];
    setSelectedSizes: (s: string[]) => void;
}

const FilterSidebar: React.FC<Props> = ({
    priceRange,
    setPriceRange,
    brands,
    selectedBrands,
    setSelectedBrands,
    types,
    selectedTypes,
    setSelectedTypes,
    features,
    selectedFeatures,
    setSelectedFeatures,
    sizes,
    selectedSizes,
    setSelectedSizes,
}) => {
    const onSliderChange = (value: number | number[]) => {
        if (Array.isArray(value)) setPriceRange([value[0], value[1]]);
    };



    return (
        <div className="filter-container">
            <div className="filter-sidebar-box">
                <div className="filter-sidebar">
                    <div className="filter-block">
                        <div className="block-title">Giá (VNĐ)</div>
                        <div className="price-inputs">
                            <InputNumber
                                min={0}
                                value={priceRange[0]}
                                formatter={(v) => v?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                parser={(v) => Number(v?.replace(/\./g, "") || 0)}
                                onChange={(v) => setPriceRange([Number(v || 0), priceRange[1]])}
                            />
                            <span className="dash">-</span>
                            <InputNumber
                                min={0}
                                value={priceRange[1]}
                                formatter={(v) => v?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                parser={(v) => Number(v?.replace(/\./g, "") || 0)}
                                onChange={(v) => setPriceRange([priceRange[0], Number(v || 0)])}
                            />
                        </div>
                        <Slider
                            range
                            min={0}
                            max={30000000}
                            step={100000}
                            value={priceRange}
                            onChange={onSliderChange}
                        />
                        <div className="apply-row">
                            <Button
                                type="primary"
                                block
                                onClick={() => {
                                    const params = new URLSearchParams(window.location.search);
                                    params.set("price", `${priceRange[0]}-${priceRange[1]}`);
                                    window.history.pushState({}, "", `?${params.toString()}`);
                                    window.dispatchEvent(new PopStateEvent("popstate")); // để useEffect reload
                                }}
                            >
                                Áp dụng
                            </Button>
                        </div>
                    </div>

                    <div className="filter-block">
                        <div className="block-title">Loại sản phẩm</div>
                        <div className="chips">
                            {CATEGORY_LIST.map((c) => (
                                <Button
                                    key={c}
                                    type={selectedBrands.includes(c) ? "primary" : "default"}
                                    className="chip"
                                    onClick={() => {
                                        const newSelected = selectedBrands.includes(c)
                                            ? selectedBrands.filter(x => x !== c)
                                            : [c]; // chọn 1 category
                                        setSelectedBrands(newSelected);

                                        const params = new URLSearchParams(window.location.search);
                                        if (newSelected.length > 0) params.set("category", newSelected[0]);
                                        else params.delete("category");
                                        window.history.pushState({}, "", `?${params.toString()}`);
                                        window.dispatchEvent(new PopStateEvent("popstate"));
                                    }}
                                >
                                    {c}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-block">
                        <div className="block-title">Thương hiệu</div>
                        <div className="factory">
                            {FACTORY_LIST.map((f) => (
                                <Button
                                    key={f}
                                    type={selectedTypes.includes(f) ? "primary" : "default"}
                                    className="factory"
                                    onClick={() => {
                                        const newSelected = selectedTypes.includes(f)
                                            ? selectedTypes.filter(x => x !== f)
                                            : [f]; // chọn 1 brand
                                        setSelectedTypes(newSelected);

                                        const params = new URLSearchParams(window.location.search);
                                        if (newSelected.length > 0) params.set("factory", newSelected[0]);
                                        else params.delete("factory");
                                        window.history.pushState({}, "", `?${params.toString()}`);
                                        window.dispatchEvent(new PopStateEvent("popstate"));
                                    }}
                                >
                                    {f}
                                </Button>
                            ))}
                        </div>
                    </div>


                    <div className="filter-block">
                        <div className="block-title">Tính năng</div>
                        <div className="feature-list">
                            <Checkbox.Group
                                value={selectedFeatures}
                                onChange={(vals) => setSelectedFeatures(vals as string[])}
                            >
                                {features.map((f) => (
                                    <div key={f}><Checkbox value={f}>{f}</Checkbox></div>
                                ))}
                            </Checkbox.Group>
                        </div>
                    </div>

                    <div className="filter-block">
                        <div className="block-title">Kích thước màn hình (LCD)</div>
                        <div className="chips">
                            {sizes.map((s) => (
                                <Button
                                    key={s}
                                    type={selectedSizes.includes(s) ? "primary" : "default"}
                                    className="chip"
                                    onClick={() =>
                                        setSelectedSizes(
                                            selectedSizes.includes(s) ? selectedSizes.filter(x => x !== s) : [...selectedSizes, s]
                                        )
                                    }
                                >
                                    {s}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
