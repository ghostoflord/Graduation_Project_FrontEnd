import { useEffect, useState } from "react";
import { Modal, Upload, Button, App, Image, Popconfirm } from "antd";
import { UploadOutlined, DeleteTwoTone } from "@ant-design/icons";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import { uploadSubImagesAPI, getProductDetailAPI, deleteProductImageAPI } from "@/services/api";

interface IProps {
    open: boolean;
    onClose: () => void;
    productId: number | string | null;
    refreshTable: () => void;
}

const UpdateImages = ({ open, onClose, productId, refreshTable }: IProps) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<{ id: number; url: string }[]>([]);
    const { message } = App.useApp();

    useEffect(() => {
        if (open && productId) {
            getProductDetailAPI(productId.toString()).then((res) => {
                if (res.data) {
                    const imgs = res.data.images?.map((img: any) => ({
                        id: img.id,
                        url: `${import.meta.env.VITE_BACKEND_URL}/upload/products/${img.url}`,
                    }));
                    setImages(imgs || []);
                }
            });
        }
    }, [open, productId]);

    const handleUpload = async () => {
        if (!productId || fileList.length === 0) {
            message.error("Chưa chọn ảnh hoặc thiếu productId");
            return;
        }
        try {
            setLoading(true);
            const formData = new FormData();
            fileList.forEach((file) => {
                if (file.originFileObj) {
                    formData.append("images", file.originFileObj as RcFile);
                }
            });

            await uploadSubImagesAPI(productId, formData);
            message.success("Upload ảnh thành công!");

            setFileList([]);
            refreshTable();
            onClose();
        } catch (err) {
            console.error(err);
            message.error("Upload ảnh thất bại");
        } finally {
            setLoading(false);
        }
    };

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
            title="Cập nhật ảnh phụ"
            open={open}
            onCancel={onClose}
            onOk={handleUpload}
            confirmLoading={loading}
            okText="Upload"
            cancelText="Hủy"
            width={800}
        >
            {/* List ảnh hiện có */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
                {images.map((img) => (
                    <div key={img.id} style={{ position: "relative" }}>
                        <Image src={img.url} width={120} height={120} style={{ objectFit: "cover" }} />
                        <Popconfirm
                            title="Xoá ảnh"
                            description="Bạn có chắc muốn xoá ảnh này không?"
                            onConfirm={() => handleDeleteImage(img.id)}
                            okText="Xác nhận"
                            cancelText="Huỷ"
                        >
                            <DeleteTwoTone
                                twoToneColor="#ff4d4f"
                                style={{ position: "absolute", top: 5, right: 5, cursor: "pointer", fontSize: 18 }}
                            />
                        </Popconfirm>
                    </div>
                ))}
            </div>

            {/* Upload ảnh mới */}
            <Upload
                listType="picture-card"
                multiple
                fileList={fileList}
                beforeUpload={() => false} // không upload auto
                onChange={({ fileList }) => setFileList(fileList)}
            >
                <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                </div>
            </Upload>
        </Modal>
    );
};

export default UpdateImages;
