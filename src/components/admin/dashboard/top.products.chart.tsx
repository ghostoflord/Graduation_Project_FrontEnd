import React, { useEffect, useState } from "react";
import { Bar, Column } from "@ant-design/plots";
import axios from "axios";

interface ProductStatisticDTO {
    productId: number;
    productName: string;
    totalQuantity: number;
    date?: string;   // khi thống kê theo ngày
    month?: number;  // khi thống kê theo tháng
    week?: number;   // khi thống kê theo tuần
}

const ChartWrapper: React.FC<{
    title: string;
    url: string;
    type?: "bar" | "column";
    mode?: "day" | "week" | "month"; // <-- thêm mode
}> = ({ title, url, type = "bar", mode }) => {
    const [data, setData] = useState<ProductStatisticDTO[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(url);
                setData(res.data);
            } catch (err) {
                console.error("Error fetching top products", err);
            }
        };
        fetchData();
    }, [url]);

    const commonConfig = {
        data,
        height: 250,
    };

    const barConfig = {
        ...commonConfig,
        xField: "totalQuantity",
        yField: "productName",
        seriesField: "productName",
        colorField: "productName",
        barWidthRatio: 0.5,
        label: {
            position: "right" as const,
            style: { fill: "#333", fontWeight: 600 },
        },
        legend: false,
    };

    // Chart cột dọc cho tuần / tháng
    const columnConfig = {
        ...commonConfig,
        xField: mode === "day" ? "date" : mode === "week" ? "week" : "month",
        yField: "totalQuantity",
        seriesField: "productName",
        isGroup: true,
        columnWidthRatio: 0.5,
        xAxis: {
            label: {
                formatter: (v: any) => {
                    if (mode === "month") return `Tháng ${v}`;
                    if (mode === "week") return `Tuần ${v}`;
                    return v;
                },
            },
        },
    };

    return (
        <div className="bg-white shadow rounded-xl p-4 w-1/3">
            <h3 className="text-center font-semibold mb-2">{title}</h3>
            {type === "bar" ? <Bar {...barConfig} /> : <Column {...columnConfig} />}
        </div>
    );
};

const TopProductsDashboard: React.FC = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = today.getMonth() + 1;
    const dd = today.toISOString().split("T")[0];

    return (
        <div className="flex gap-4">
            {/* Chart theo ngày -> Bar */}
            <ChartWrapper
                title="Top sản phẩm hôm nay"
                url={`http://localhost:8080/api/v1/statistics/top-products/day?date=${dd}`}
                type="bar"
                mode="day"
            />

            {/* Chart theo tuần -> Column */}
            <ChartWrapper
                title="Top sản phẩm tuần"
                url={`http://localhost:8080/api/v1/statistics/top-products/week?year=${yyyy}&week=37`}
                type="column"
                mode="week"
            />

            {/* Chart theo tháng -> Column */}
            <ChartWrapper
                title="Top sản phẩm tháng"
                url={`http://localhost:8080/api/v1/statistics/top-products/month?year=${yyyy}`}
                type="column"
                mode="month"
            />
        </div>
    );
};

export default TopProductsDashboard;
