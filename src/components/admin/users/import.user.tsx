import { Modal, Table, message, Upload } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useState } from "react";
import ExcelJS from "exceljs";
import { importUserExcelAPI } from "@/services/api";

interface IProps {
    openModalImport: boolean;
    setOpenModalImport: (v: boolean) => void;
}

interface UserData {
    name: string;
    email: string;
    address: string;
}

const ImportUser = ({ openModalImport, setOpenModalImport }: IProps) => {
    const [dataExcel, setDataExcel] = useState<UserData[]>([]);
    const { Dragger } = Upload;

    // Hàm xử lý file CSV
    const processCSVFile = async (file: File): Promise<UserData[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;
                    const lines = content.split('\n');
                    const data: UserData[] = [];

                    // Bỏ qua hàng đầu tiên (header) và các hàng trống
                    for (let i = 1; i < lines.length; i++) {
                        const line = lines[i].trim();
                        if (!line) continue;

                        // Xử lý CSV có dấu quotes và comma
                        const cells: string[] = [];
                        let currentCell = '';
                        let inQuotes = false;

                        for (let j = 0; j < line.length; j++) {
                            const char = line[j];

                            if (char === '"') {
                                inQuotes = !inQuotes;
                            } else if (char === ',' && !inQuotes) {
                                cells.push(currentCell.trim());
                                currentCell = '';
                            } else {
                                currentCell += char;
                            }
                        }
                        cells.push(currentCell.trim()); // Thêm cell cuối cùng

                        // Remove quotes từ các cell
                        const cleanCells = cells.map(cell =>
                            cell.replace(/^"(.*)"$/, '$1').trim()
                        );

                        if (cleanCells.length >= 3) {
                            const item: UserData = {
                                name: cleanCells[0] || '',
                                email: cleanCells[1] || '',
                                address: cleanCells[2] || '',
                            };
                            data.push(item);
                        }
                    }
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => {
                reject(new Error("Lỗi đọc file"));
            };

            reader.readAsText(file);
        });
    };

    // Hàm xử lý file Excel
    const processExcelFile = async (file: File): Promise<UserData[]> => {
        const workbook = new ExcelJS.Workbook();
        const arrayBuffer = await file.arrayBuffer();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.worksheets[0];
        const data: UserData[] = [];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Bỏ qua header
            const item: UserData = {
                name: row.getCell(1).text?.toString() || '',
                email: row.getCell(2).text?.toString() || '',
                address: row.getCell(3).text?.toString() || '',
            };
            data.push(item);
        });

        return data;
    };

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        customRequest: async ({ file, onSuccess, onError }) => {
            try {
                const fileObj = file as File;
                let data: UserData[] = [];

                // Kiểm tra loại file
                if (fileObj.name.endsWith('.csv') || fileObj.type === 'text/csv') {
                    data = await processCSVFile(fileObj);
                } else {
                    // Xử lý file Excel
                    data = await processExcelFile(fileObj);
                }

                console.log("check data import ", data);

                if (data.length === 0) {
                    message.warning("File không có dữ liệu hợp lệ!");
                    return;
                }

                // Gọi API import
                await importUserExcelAPI(data);

                message.success(`Import thành công ${data.length} người dùng!`);
                setDataExcel(data);
                if (onSuccess) onSuccess("ok");
            } catch (err) {
                console.error("Lỗi khi đọc hoặc gửi dữ liệu:", err);
                message.error("Import thất bại!");
            }
        },
        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <Modal
            title="Import data user"
            width={"50vw"}
            open={openModalImport}
            onOk={() => setOpenModalImport(false)}
            onCancel={() => setOpenModalImport(false)}
            okText="Đóng"
            maskClosable={false}
        >
            <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single upload. Only accept .csv, .xls, .xlsx
                </p>
            </Dragger>

            {dataExcel.length > 0 && (
                <div style={{ paddingTop: 20 }}>
                    <div style={{ marginBottom: 10 }}>
                        <strong>Dữ liệu sẽ được import ({dataExcel.length} bản ghi):</strong>
                    </div>
                    <Table
                        size="small"
                        pagination={{ pageSize: 5 }}
                        rowKey={(record, index) => `${record.email}-${index}`}
                        dataSource={dataExcel}
                        columns={[
                            { dataIndex: 'name', title: 'Tên hiển thị' },
                            { dataIndex: 'email', title: 'Email' },
                            { dataIndex: 'address', title: 'Địa chỉ' },
                        ]}
                    />
                </div>
            )}
        </Modal>
    );
};

export default ImportUser;