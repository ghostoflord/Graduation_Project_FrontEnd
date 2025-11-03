import React from "react";
import { Button, Slider, InputNumber, Checkbox } from "antd";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import "./filter.sidebar.scss";
import { CATEGORY_LIST, CPU_LIST, FACTORY_LIST, GPU_LIST, RAM_LIST, ROM_LIST, SCREEN_LIST } from "../productenum/product.enum";

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

    cpus: string[];
    selectedCpus: string[];
    setSelectedCpus: (c: string[]) => void;
    gpus: string[];
    selectedGpus: string[];
    setSelectedGpus: (g: string[]) => void;
    rams: string[];
    selectedRams: string[];
    setSelectedRams: (r: string[]) => void;
    roms: string[];
    selectedRoms: string[];
    setSelectedRoms: (r: string[]) => void;
    screen: string[];
    selectedScreens: string[];
    setSelectedScreens: (r: string[]) => void;
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
    cpus,
    selectedCpus,
    setSelectedCpus,
    gpus,
    selectedGpus,
    setSelectedGpus,
    rams,
    selectedRams,
    setSelectedRams,
    roms,
    selectedRoms,
    setSelectedRoms,
    screen,
    selectedScreens,
    setSelectedScreens,
}) => {
    const [openBlock, setOpenBlock] = React.useState<string | null>(null);

    const toggleBlock = (block: string) => {
        setOpenBlock(openBlock === block ? null : block);
    };

    const onSliderChange = (value: number | number[]) => {
        if (Array.isArray(value)) setPriceRange([value[0], value[1]]);
    };

    return (
        <div className="filter-container">
            <div className="filter-sidebar-box">
                <div className="filter-sidebar">
                    {/* GIÁ (luôn mở) */}
                    <div className="filter-block always-open">
                        <div className="block-title">Giá (VNĐ)</div>
                        <div className="block-content">
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
                            <Slider range min={0} max={30000000} step={100000} value={priceRange} onChange={onSliderChange} />
                            <div className="apply-row">
                                <Button
                                    type="primary"
                                    block
                                    onClick={() => {
                                        const params = new URLSearchParams(window.location.search);
                                        params.set("price", `${priceRange[0]}-${priceRange[1]}`);
                                        window.history.pushState({}, "", `?${params.toString()}`);
                                        window.dispatchEvent(new PopStateEvent("popstate"));
                                    }}
                                >
                                    Áp dụng
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* CATEGORY */}
                    <div className="filter-block">
                        <div className="block-title" onClick={() => toggleBlock("category")}>
                            Loại sản phẩm
                            {openBlock === "category" ? <DownOutlined className="arrow" /> : <RightOutlined className="arrow" />}
                        </div>
                        {openBlock === "category" && (
                            <div className="block-content chips">
                                {CATEGORY_LIST.map((c) => (
                                    <Button
                                        key={c}
                                        type={selectedBrands.includes(c) ? "primary" : "default"}
                                        className="chip"
                                        onClick={() => {
                                            const newSelected = selectedBrands.includes(c)
                                                ? selectedBrands.filter((x) => x !== c)
                                                : [c];
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
                        )}
                    </div>

                    {/* FACTORY */}
                    <div className="filter-block">
                        <div className="block-title" onClick={() => toggleBlock("factory")}>
                            Thương hiệu
                            {openBlock === "factory" ? <DownOutlined className="arrow" /> : <RightOutlined className="arrow" />}
                        </div>
                        {openBlock === "factory" && (
                            <div className="block-content chips">
                                {FACTORY_LIST.map((f) => (
                                    <Button
                                        key={f}
                                        type={selectedTypes.includes(f) ? "primary" : "default"}
                                        className="chip"
                                        onClick={() => {
                                            const newSelected = selectedTypes.includes(f)
                                                ? selectedTypes.filter((x) => x !== f)
                                                : [f];
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
                        )}
                    </div>

                    {/* CPU */}
                    <div className="filter-block">
                        <div className="block-title" onClick={() => toggleBlock("cpu")}>
                            CPU
                            {openBlock === "cpu" ? <DownOutlined className="arrow" /> : <RightOutlined className="arrow" />}
                        </div>
                        {openBlock === "cpu" && (
                            <div className="block-content chips">
                                {CPU_LIST.map((c) => (
                                    <Button
                                        key={c}
                                        type={selectedCpus.includes(c) ? "primary" : "default"}
                                        className="chip"
                                        onClick={() => {
                                            const newSelected = selectedCpus.includes(c)
                                                ? selectedCpus.filter((x) => x !== c)
                                                : [c];
                                            setSelectedCpus(newSelected);
                                            const params = new URLSearchParams(window.location.search);
                                            if (newSelected.length > 0) params.set("cpu", newSelected[0]);
                                            else params.delete("cpu");
                                            window.history.pushState({}, "", `?${params.toString()}`);
                                            window.dispatchEvent(new PopStateEvent("popstate"));
                                        }}
                                    >
                                        {c}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* GPU */}
                    <div className="filter-block">
                        <div className="block-title" onClick={() => toggleBlock("gpu")}>
                            GPU
                            {openBlock === "gpu" ? <DownOutlined className="arrow" /> : <RightOutlined className="arrow" />}
                        </div>
                        {openBlock === "gpu" && (
                            <div className="block-content chips">
                                {GPU_LIST.map((c) => (
                                    <Button
                                        key={c}
                                        type={selectedGpus.includes(c) ? "primary" : "default"}
                                        className="chip"
                                        onClick={() => {
                                            const newSelected = selectedGpus.includes(c)
                                                ? selectedGpus.filter((x) => x !== c)
                                                : [c];
                                            setSelectedGpus(newSelected);
                                            const params = new URLSearchParams(window.location.search);
                                            if (newSelected.length > 0) params.set("gpu", newSelected[0]);
                                            else params.delete("gpu");
                                            window.history.pushState({}, "", `?${params.toString()}`);
                                            window.dispatchEvent(new PopStateEvent("popstate"));
                                        }}
                                    >
                                        {c}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RAM */}
                    <div className="filter-block">
                        <div className="block-title" onClick={() => toggleBlock("ram")}>
                            RAM
                            {openBlock === "ram" ? <DownOutlined className="arrow" /> : <RightOutlined className="arrow" />}
                        </div>
                        {openBlock === "ram" && (
                            <div className="block-content chips">
                                {RAM_LIST.map((c) => (
                                    <Button
                                        key={c}
                                        type={selectedRams.includes(c) ? "primary" : "default"}
                                        className="chip"
                                        onClick={() => {
                                            const newSelected = selectedRams.includes(c)
                                                ? selectedRams.filter((x) => x !== c)
                                                : [c];
                                            setSelectedRams(newSelected);
                                            const params = new URLSearchParams(window.location.search);
                                            if (newSelected.length > 0) params.set("ram", newSelected[0]);
                                            else params.delete("ram");
                                            window.history.pushState({}, "", `?${params.toString()}`);
                                            window.dispatchEvent(new PopStateEvent("popstate"));
                                        }}
                                    >
                                        {c}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ROM */}
                    <div className="filter-block">
                        <div className="block-title" onClick={() => toggleBlock("storage")}>
                            ROM
                            {openBlock === "storage" ? <DownOutlined className="arrow" /> : <RightOutlined className="arrow" />}
                        </div>
                        {openBlock === "storage" && (
                            <div className="block-content chips">
                                {ROM_LIST.map((c) => (
                                    <Button
                                        key={c}
                                        type={selectedRoms.includes(c) ? "primary" : "default"}
                                        className="chip"
                                        onClick={() => {
                                            const newSelected = selectedRoms.includes(c)
                                                ? selectedRoms.filter((x) => x !== c)
                                                : [c];
                                            setSelectedRoms(newSelected);
                                            const params = new URLSearchParams(window.location.search);
                                            if (newSelected.length > 0) params.set("storage", newSelected[0]);
                                            else params.delete("storage");
                                            window.history.pushState({}, "", `?${params.toString()}`);
                                            window.dispatchEvent(new PopStateEvent("popstate"));
                                        }}
                                    >
                                        {c}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* SCREEN */}
                    <div className="filter-block">
                        <div className="block-title" onClick={() => toggleBlock("screen")}>
                            SCREEN
                            {openBlock === "screen" ? <DownOutlined className="arrow" /> : <RightOutlined className="arrow" />}
                        </div>
                        {openBlock === "screen" && (
                            <div className="block-content chips">
                                {SCREEN_LIST.map((c) => (
                                    <Button
                                        key={c}
                                        type={selectedScreens.includes(c) ? "primary" : "default"}
                                        className="chip"
                                        onClick={() => {
                                            const newSelected = selectedScreens.includes(c)
                                                ? selectedScreens.filter((x) => x !== c)
                                                : [c];
                                            setSelectedScreens(newSelected);
                                            const params = new URLSearchParams(window.location.search);
                                            if (newSelected.length > 0) params.set("screen", newSelected[0]);
                                            else params.delete("screen");
                                            window.history.pushState({}, "", `?${params.toString()}`);
                                            window.dispatchEvent(new PopStateEvent("popstate"));
                                        }}
                                    >
                                        {c}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
