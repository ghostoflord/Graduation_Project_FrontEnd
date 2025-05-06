import { Modal, Table, message, Upload } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useState } from "react";
import ExcelJS from "exceljs";
import { importUserExcelAPI } from "@/services/api";

const { Dragger } = Upload;

interface IProps {
    openModalImport: boolean;
    setOpenModalImport: (v: boolean) => void;
}

const ImportUser = ({ openModalImport, setOpenModalImport }: IProps) => {
    const [dataExcel, setDataExcel] = useState<any[]>([]);

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        customRequest: async ({ file, onSuccess }) => {
            try {
                const workbook = new ExcelJS.Workbook();
                const arrayBuffer = await (file as File).arrayBuffer();
                await workbook.xlsx.load(arrayBuffer);

                const worksheet = workbook.worksheets[0];
                const data: any[] = [];

                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return;
                    const item = {
                        name: row.getCell(1).text,
                        email: row.getCell(2).text,
                        address: row.getCell(3).text,
                    };
                    data.push(item);
                });

                // ✅ Gửi dữ liệu lên backend thông qua axios service
                await importUserExcelAPI(data);

                message.success("Import dữ liệu thành công!");
                setDataExcel(data);
                if (onSuccess) onSuccess("ok");
            } catch (err) {
                console.error("Lỗi khi đọc hoặc gửi dữ liệu:", err);
                message.error("Import thất bại!");
            }
        }
    };

    return (
        <Modal
            title="Import data user"
            width={"50vw"}
            open={openModalImport}
            onOk={() => setOpenModalImport(false)}
            onCancel={() => setOpenModalImport(false)}
            okText="Import data"
            okButtonProps={{
                disabled: dataExcel.length === 0
            }}
            maskClosable={false}
        >
            <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single upload. Only accept .csv, .xls, .xlsx
                </p>
            </Dragger>
            <div style={{ paddingTop: 20 }}>
                <Table
                    rowKey={(record, index) => `${record.email}-${index}`}
                    dataSource={dataExcel}
                    columns={[
                        { dataIndex: 'name', title: 'Tên hiển thị' },
                        { dataIndex: 'email', title: 'Email' },
                        { dataIndex: 'address', title: 'Địa' },
                    ]}
                />
            </div>
        </Modal>
    );
};

export default ImportUser;
