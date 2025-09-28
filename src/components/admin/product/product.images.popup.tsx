import { useEffect, useState } from "react";
import { Modal, Image, Popconfirm, App, Spin } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { deleteProductImageAPI, getProductImagesAPI } from "@/services/api";

interface IProps {
    open: boolean;
    onClose: () => void;
    productId: number | string | null;
    refreshTable: () => void;
}

interface ProductImage {
    id: number;
    imageUrl: string;
}

const ProductImagesPopup = ({ open, onClose, productId, refreshTable }: IProps) => {
    const [images, setImages] = useState<ProductImage[]>([]);
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();

    useEffect(() => {
        if (open && productId) {
            setLoading(true);
            getProductImagesAPI(productId.toString())
                .then((res) => {
                    if (res) {
                        setImages(res); // [{id, imageUrl}]
                    }
                })
                .catch(() => {
                    message.error("Không thể tải ảnh sản phẩm");
                })
                .finally(() => setLoading(false));
        }
    }, [open, productId]);

    const handleDeleteImage = async (id: number) => {
        try {
            await deleteProductImageAPI(id);
            message.success("Xoá ảnh thành công");
            setImages((prev) => prev.filter((img) => img.id !== id));
            refreshTable();
        } catch (err) {
            message.error("Xoá ảnh thất bại");
        }
    };

    return (
        <Modal
            title="Danh sách ảnh sản phẩm"
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <Spin />
                </div>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                    {images.length > 0 ? (
                        images.map((img) => (
                            <div key={img.id} style={{ position: "relative" }}>
                                <Image
                                    src={`${import.meta.env.VITE_BACKEND_URL}/upload/products/${img.imageUrl}`}
                                    width={150}
                                    height={150}
                                    style={{ objectFit: "cover", borderRadius: 8 }}
                                />
                                <Popconfirm
                                    title="Xoá ảnh"
                                    description="Bạn có chắc muốn xoá ảnh này không?"
                                    onConfirm={() => handleDeleteImage(img.id)}
                                    okText="Xác nhận"
                                    cancelText="Huỷ"
                                >
                                    <DeleteTwoTone
                                        twoToneColor="#ff4d4f"
                                        style={{
                                            position: "absolute",
                                            top: 5,
                                            right: 5,
                                            cursor: "pointer",
                                            fontSize: 20,
                                        }}
                                    />
                                </Popconfirm>
                            </div>
                        ))
                    ) : (
                        <p>Chưa có ảnh nào cho sản phẩm này.</p>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default ProductImagesPopup;
