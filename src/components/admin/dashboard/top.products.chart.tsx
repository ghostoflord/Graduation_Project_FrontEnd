import React, { useEffect, useState } from "react";
import { Bar } from "@ant-design/charts";
import axios from "axios";

interface ProductStatisticDTO {
    productId: number;
    productName: string;
    totalQuantity: number;
}

const ChartWrapper: React.FC<{
    title: string;
    url: string;
}> = ({ title, url }) => {
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

    const config = {
        data,
        xField: "totalQuantity",
        yField: "productName",
        seriesField: "productName",
        legend: false,
        colorField: "productName",
        barWidthRatio: 0.6,
        label: {
            position: "right" as const,
            style: { fill: "#000" },
        },
        height: 250, // nhỏ gọn
    };

    return (
        <div className="p-2 w-1/3">
            <h3 className="text-center font-semibold mb-2">{title}</h3>
            <Bar {...config} />
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
            {/* Chart theo ngày */}
            <ChartWrapper
                title="Top sản phẩm hôm nay"
                url={`http://localhost:8080/api/v1/statistics/top-products/day?date=${dd}`}
            />

            {/* Chart theo tuần (ví dụ tuần 37 năm nay) */}
            <ChartWrapper
                title="Top sản phẩm tuần"
                url={`http://localhost:8080/api/v1/statistics/top-products/week?year=${yyyy}&week=37`}
            />

            {/* Chart theo tháng */}
            <ChartWrapper
                title="Top sản phẩm tháng"
                url={`http://localhost:8080/api/v1/statistics/top-products/month?year=${yyyy}&month=${mm}`}
            />
        </div>
    );
};

export default TopProductsDashboard;
