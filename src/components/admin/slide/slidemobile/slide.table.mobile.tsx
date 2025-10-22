import React, { useEffect, useState } from "react";
import {
    Card,
    List,
    Spin,
    Tag,
    Pagination,
    App,
    Popconfirm,
    Button,
} from "antd";
import {
    getSlidesByTypeAPI,
    deleteSlideAPI,
} from "@/services/api";
import {
    EditTwoTone,
    DeleteTwoTone,
    PlusOutlined,
} from "@ant-design/icons";
import CreateSlide from "../slide.create";
import UpdateSlide from "../slide.update";


export interface ISlide {
    id: number;
    title: string;
    description?: string;
    imageUrl: string;
    redirectUrl?: string;
    active: boolean;
    orderIndex: number;
    type: string;
    createdAt?: string;
    updatedAt?: string;
}

const TableSlideMobile = () => {
    const [slides, setSlides] = useState<ISlide[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDeleting, setIsDeleting] = useState(false);

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<ISlide | null>(null);

    const pageSize = 5;
    const { message, notification } = App.useApp();

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        setLoading(true);
        try {
            const res = await getSlidesByTypeAPI("HOME");
            setSlides(res?.data ?? []);
        } catch (e) {
            console.error("Error fetching slides", e);
            message.error("Lỗi tải slide");
        } finally {
            setLoading(false);
        }
    };

    const refreshTable = () => {
        fetchSlides();
    };

    const handleDeleteSlide = async (id: number) => {
        setIsDeleting(true);
        try {
            const res = await deleteSlideAPI(id);
            if (res && res.statusCode === 200) {
                message.success(res.message || "Xóa slide thành công");
                refreshTable();
            } else {
                notification.error({
                    message: res.error || "Đã có lỗi xảy ra",
                    description: res.message || "Không thể xóa slide",
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi hệ thống",
                description: "Đã có lỗi xảy ra khi xóa slide",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const paginatedSlides = slides.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div style={{ padding: 16 }}>
            {/* Nút thêm mới slide */}
            <div style={{ textAlign: "right", marginBottom: 16 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setOpenModalCreate(true)}
                    size="small"
                >
                    Thêm mới
                </Button>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", marginTop: 50 }}>
                    <Spin />
                </div>
            ) : (
                <>
                    <List
                        dataSource={paginatedSlides}
                        renderItem={(item) => (
                            <Card
                                key={item.id}
                                style={{ marginBottom: 16 }}
                                title={
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontWeight: 600,
                                                fontSize: 14,
                                            }}
                                        >
                                            {item.title}
                                        </span>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 12,
                                            }}
                                        >
                                            <EditTwoTone
                                                twoToneColor="#f57800"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    setDataUpdate(item);
                                                    setOpenModalUpdate(true);
                                                }}
                                            />
                                            <Popconfirm
                                                placement="leftTop"
                                                title="Xác nhận xóa slide"
                                                description="Bạn có chắc chắn muốn xóa slide này?"
                                                onConfirm={() =>
                                                    handleDeleteSlide(item.id)
                                                }
                                                okText="Xác nhận"
                                                cancelText="Hủy"
                                                okButtonProps={{
                                                    loading: isDeleting,
                                                }}
                                            >
                                                <DeleteTwoTone
                                                    twoToneColor="#ff4d4f"
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            </Popconfirm>
                                        </div>
                                    </div>
                                }
                                extra={
                                    <Tag
                                        color={item.active ? "green" : "red"}
                                        style={{ fontSize: 12 }}
                                    >
                                        {item.active ? "Active" : "Inactive"}
                                    </Tag>
                                }
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 6,
                                    }}
                                >
                                    <div>
                                        <strong>Hình ảnh:</strong>
                                        <br />
                                        {(() => {
                                            const imageUrl = item.imageUrl?.startsWith('http')
                                                ? item.imageUrl
                                                : `${import.meta.env.VITE_BACKEND_URL}/upload/slides/${item.imageUrl}`;
                                            return imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={item.title}
                                                    style={{
                                                        width: 120,
                                                        height: 80,
                                                        objectFit: "cover",
                                                        borderRadius: 8,
                                                        marginTop: 4,
                                                        border: "1px solid #ddd",
                                                    }}
                                                />
                                            ) : (
                                                <span>No Slide</span>
                                            );
                                        })()}
                                    </div>

                                    <div>
                                        <strong>Mô tả:</strong>{" "}
                                        {item.description || "—"}
                                    </div>
                                    <div>
                                        <strong>Link:</strong>{" "}
                                        {item.redirectUrl ? (
                                            <a
                                                href={item.redirectUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {item.redirectUrl}
                                            </a>
                                        ) : (
                                            "—"
                                        )}
                                    </div>
                                    <div>
                                        <strong>Thứ tự hiển thị:</strong>{" "}
                                        {item.orderIndex}
                                    </div>
                                    <div>
                                        <strong>Ngày tạo:</strong>{" "}
                                        {item.createdAt || "—"}
                                    </div>
                                </div>
                            </Card>
                        )}
                    />

                    {/* Pagination */}
                    <div style={{ textAlign: "center", marginTop: 16 }}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={slides.length}
                            onChange={(page) => setCurrentPage(page)}
                            size="small"
                            responsive
                            simple={window.innerWidth < 1000}
                        />
                    </div>
                </>
            )}

            {/* Modal tạo slide */}
            <CreateSlide
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            {/* Modal cập nhật slide */}
            <UpdateSlide
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
        </div>
    );
};

export default TableSlideMobile;
