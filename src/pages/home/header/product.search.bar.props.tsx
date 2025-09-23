import React, { useEffect, useState } from "react";
import { Input, List, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { getProductSuggestionsAPI } from "@/services/api";
import { useDebounce } from "use-debounce";

interface IProductSuggestion {
    id: number;
    name: string;
    price: string;
    image?: string;
    slug?: string;
}

interface ProductSearchBarProps {
    initialValue?: string;
    placeholder?: string;
}

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({
    initialValue = "",
    placeholder = "Từ khóa...",
}) => {
    const [searchValue, setSearchValue] = useState(initialValue);
    const [suggestions, setSuggestions] = useState<IProductSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [debouncedSearch] = useDebounce(searchValue, 400); // destructure [value]

    useEffect(() => {
        if (!debouncedSearch || debouncedSearch.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        getProductSuggestionsAPI(debouncedSearch)
            .then((res) => {
                console.log("suggestions response:", res.data);
                setSuggestions(res?.data || []);
            })
            .finally(() => setLoading(false));
    }, [debouncedSearch]);

    return (
        <div className="relative w-full" style={{ position: "relative" }}>
            <Input.Search
                placeholder={placeholder}
                allowClear
                value={searchValue}
                onChange={(e) => {
                    setSearchValue(e.target.value);
                    if (!e.target.value) {
                        setSuggestions([]); // clear khi input trống
                    }
                }}
                onPressEnter={() => {
                    const trimmed = searchValue.trim();
                    if (trimmed) {
                        navigate(`/?search=${encodeURIComponent(trimmed)}`);
                        setSuggestions([]);
                    }
                }}
            />

            {/* Loading icon */}
            {loading && (
                <Spin
                    size="small"
                    style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                />
            )}

            {/* Suggestion dropdown */}
            {suggestions.length > 0 && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        minWidth: "400px",
                        width: "max-content",
                        background: "white",
                        border: "1px solid #eee",
                        borderTop: "none",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                        borderRadius: "0 0 8px 8px",
                        zIndex: 999,
                        maxHeight: 300,
                        overflowY: "auto",
                    }}
                >
                    <List
                        dataSource={suggestions}
                        renderItem={(item) => (
                            <List.Item
                                onClick={() => {
                                    navigate(`/product/${item.slug}`);
                                    setSearchValue("");
                                    setSuggestions([]);
                                }}
                                style={{
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "10px 14px",
                                    transition: "background 0.2s ease",
                                    borderBottom: "1px solid #f5f5f5",
                                    background: "transparent",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.background = "#fafafa";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.background = "transparent";
                                }}

                            >
                                <img
                                    src={
                                        item.image?.startsWith("http")
                                            ? item.image
                                            : `${import.meta.env.VITE_BACKEND_URL}/upload/products/${item.image}`
                                    }
                                    alt={item.name}
                                    style={{
                                        width: 48,
                                        height: 48,
                                        objectFit: "cover",
                                        borderRadius: 8,
                                        backgroundColor: "#f3f4f6",
                                    }}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 2,
                                        flex: 1,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontWeight: 500,
                                            fontSize: "0.95rem",
                                            color: "#111827",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {item.name}
                                    </span>
                                    <span
                                        style={{
                                            color: "#e11d48",
                                            fontWeight: 600,
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {Number(item.price).toLocaleString("vi-VN")} ₫
                                    </span>
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
            )}
        </div>
    );

};

export default ProductSearchBar;
