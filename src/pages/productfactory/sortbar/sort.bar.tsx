import React from "react";
import { Segmented } from "antd";
import "./sort.bar.scss";
interface Props {
    value: string;
    onChange: (v: string) => void;
}

const SortBar: React.FC<Props> = ({ value, onChange }) => {
    return (
        <div className="sort-bar-chips">
            <Segmented
                value={value}
                onChange={(v) => onChange(String(v))}
                options={[
                    { label: "Mặc định", value: "default" },
                    { label: "A → Z", value: "name,asc" },
                    { label: "Z → A", value: "name,desc" },
                    { label: "Giá tăng dần", value: "price_asc" },
                    { label: "Giá giảm dần", value: "price_desc" },
                    { label: "Mới nhất", value: "newest" },
                ]}
            />
        </div>
    );
};

export default SortBar;
