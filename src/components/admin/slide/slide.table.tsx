import { ProTable, type ProColumns } from "@ant-design/pro-components";
import { useState, useRef, useEffect } from "react";
import type { ActionType } from "@ant-design/pro-components";
import { Tag } from "antd";
import { getSlidesByTypeAPI } from "@/services/api";

const TableSlide = () => {
    const actionRef = useRef<ActionType>();
    const [data, setData] = useState<ISlide[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        setLoading(true);
        try {
            const res = await getSlidesByTypeAPI("HOME");
            setData(res || []);
        } catch (e) {
            console.error("Error fetching slides", e);
        } finally {
            setLoading(false);
        }
    };

    const columns: ProColumns<ISlide>[] = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Title",
            dataIndex: "title",
        },
        {
            title: "Description",
            dataIndex: "description",
            ellipsis: true,
        },
        {
            title: "Image",
            dataIndex: "imageUrl",
            render: (_, record) => (
                <img
                    src={record.imageUrl}
                    alt={record.title}
                    style={{ width: 80, height: 40, objectFit: "cover" }}
                />
            ),
        },
        {
            title: "Redirect",
            dataIndex: "redirectUrl",
            render: (value) =>
                value ? (
                    <a href={value} target="_blank" rel="noreferrer">
                        {value}
                    </a>
                ) : (
                    "-"
                ),
        },
        {
            title: "Active",
            dataIndex: "active",
            render: (value) => (
                <Tag color={value ? "green" : "red"}>{value ? "Active" : "Inactive"}</Tag>
            ),
        },
        {
            title: "Order",
            dataIndex: "orderIndex",
        },
        {
            title: "Type",
            dataIndex: "type",
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            valueType: "dateTime",
        },
        {
            title: "Updated At",
            dataIndex: "updatedAt",
            valueType: "dateTime",
        },
    ];

    return (
        <ProTable<ISlide>
            columns={columns}
            dataSource={data}
            loading={loading}
            actionRef={actionRef}
            rowKey="id"
            search={false}
            pagination={false}
            headerTitle="Table Slide"
        />
    );
};

export default TableSlide;
