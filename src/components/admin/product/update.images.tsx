import { useState } from "react";
import { Modal, Upload, Button, App } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import { uploadSubImagesAPI } from "@/services/api";



interface IProps {
    open: boolean;
    onClose: () => void;
    productId: number | string | null;
    refreshTable: () => void;
}

const UpdateImages = ({ open, onClose, productId, refreshTable }: IProps) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();

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
            onClose();
            refreshTable();
        } catch (err) {
            console.error(err);
            message.error("Upload ảnh thất bại");
        } finally {
            setLoading(false);
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
        >
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