import React, { useEffect, useState } from "react";
import { Bar, Column } from "@ant-design/plots";
import axios from "axios";

interface ProductStatisticDTO {
    productId: number | null;
    productName: string | null;
    totalQuantity: number;
    date?: string;   // thống kê theo ngày
    month?: number;  // thống kê theo tháng
    week?: number;   // thống kê theo tuần
    year?: number;   // thống kê theo năm
}

/* 1. Chart theo ngày (top sản phẩm) */
const TopProductsByDayChart: React.FC<{ date: string }> = ({ date }) => {
    const [data, setData] = useState<ProductStatisticDTO[]>([]);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/v1/statistics/top-products/day?date=${date}`)
            .then((res) => setData(res.data));
    }, [date]);

    const config = {
        data,
        xField: "totalQuantity",
        yField: "productName",
        seriesField: "productName",
        barWidthRatio: 0.5,
        label: {
            position: "right" as const,
            style: { fill: "#333", fontWeight: 600 },
        },
        legend: false,
        height: 250,
    };

    return (
        <div className="bg-white shadow rounded-xl p-4 w-1/3">
            <h3 className="text-center font-semibold mb-2">
                Top sản phẩm ngày {date}
            </h3>
            <Bar {...config} />
        </div>
    );
};

/* 2. Chart theo tuần */
const TopProductsByWeekChart: React.FC<{ year: number; week: number }> = ({ year, week }) => {
    const [data, setData] = useState<ProductStatisticDTO[]>([]);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/v1/statistics/top-products/week?year=${year}&week=${week}`)
            .then((res) => setData(res.data));
    }, [year, week]);

    const config = {
        data,
        xField: "week",
        yField: "totalQuantity",
        seriesField: "productName",
        isGroup: true,
        columnWidthRatio: 0.5,
        xAxis: {
            label: {
                formatter: (v: any) => `Tuần ${v}`,
            },
        },
        height: 250,
    };

    return (
        <div className="bg-white shadow rounded-xl p-4 w-1/3">
            <h3 className="text-center font-semibold mb-2">
                Top sản phẩm tuần {week}/{year}
            </h3>
            <Column {...config} />
        </div>
    );
};

/* 3. Chart tổng sản phẩm theo tháng (cả năm) */
const TotalByMonthChart: React.FC<{ year: number }> = ({ year }) => {
    const [data, setData] = useState<ProductStatisticDTO[]>([]);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/v1/statistics/top-products/year?year=${year}`)
            .then((res) => setData(res.data));
    }, [year]);

    const config = {
        data,
        xField: "month",
        yField: "totalQuantity",
        columnWidthRatio: 0.5,
        xAxis: {
            label: {
                formatter: (v: any) => `Tháng ${v}`,
            },
        },
        label: {
            position: "top" as const,
            style: { fill: "#333", fontWeight: 600 },
        },
        height: 250,
    };

    return (
        <div className="bg-white shadow rounded-xl p-4 w-1/2">
            <h3 className="text-center font-semibold mb-2">
                Tổng sản phẩm theo tháng {year}
            </h3>
            <Column {...config} />
        </div>
    );
};

/* 4. Chart top sản phẩm theo tháng */
const TopProductsByMonthChart: React.FC<{ year: number; month: number }> = ({ year, month }) => {
    const [data, setData] = useState<ProductStatisticDTO[]>([]);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/v1/statistics/top-products/month?year=${year}&month=${month}`)
            .then((res) => setData(res.data));
    }, [year, month]);

    const config = {
        data,
        xField: "productName",
        yField: "totalQuantity",
        seriesField: "productName",
        columnWidthRatio: 0.5,
        isGroup: true,
        height: 250,
    };

    return (
        <div className="bg-white shadow rounded-xl p-4 w-1/3">
            <h3 className="text-center font-semibold mb-2">
                Top sản phẩm tháng {month}/{year}
            </h3>
            <Column {...config} />
        </div>
    );
};

/* Dashboard */
const TopProductsDashboard: React.FC = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = today.getMonth() + 1;
    const dd = today.toISOString().split("T")[0];

    return (
        <div className="flex flex-wrap gap-4">
            <TopProductsByDayChart date={dd} />
            <TopProductsByWeekChart year={yyyy} week={37} />
            <TopProductsByMonthChart year={yyyy} month={mm} />
            <TotalByMonthChart year={yyyy} />
        </div>
    );
};

export default TopProductsDashboard;
