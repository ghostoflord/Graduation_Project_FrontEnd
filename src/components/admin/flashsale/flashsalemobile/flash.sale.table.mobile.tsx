import { useEffect, useRef, useState } from 'react';
import {
    Card,
    Tag,
    Spin,
    Row,
    Col,
    Typography,
    Tooltip,
    List,
    Pagination,
    App,
    Popconfirm,
    Button,
    Space,
    notification
} from 'antd';
import {
    EditTwoTone,
    DeleteTwoTone,
    PlusOutlined
} from '@ant-design/icons';
import { getAllFlashSalesAPI, deleteFlashSaleAPI } from '@/services/api';
import CreateFlashSaleModal from '../create.flash.sale';
import UpdateFlashSale from '../update.flash.sale';
import DetailFlashSale from '../flash.sale.detail';
import { ActionType } from '@ant-design/pro-components';

interface IFlashSaleItem {
    id: number;
    productId: number;
    productName: string;
    originalPrice: number;
    salePrice: number;
    quantity: number;
}

interface IFlashSale {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    status: 'ACTIVE' | 'UPCOMING' | 'ENDED';
    items: IFlashSaleItem[];
}

const TableFlashSaleMobile = () => {
    const [loading, setLoading] = useState(true);
    const [flashSales, setFlashSales] = useState<IFlashSale[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const { message } = App.useApp();

    const actionRef = useRef<ActionType>();

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IFlashSale | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IFlashSale | null>(null);
    const [isDeleteFlashSale, setIsDeleteFlashSale] = useState<boolean>(false);

    const fetchFlashSales = async () => {
        setLoading(true);
        try {
            const res = await getAllFlashSalesAPI('current=1&pageSize=100');
            if (res.data?.result) {
                setFlashSales(res.data.result);
            }
        } catch (error) {
            message.error('Không thể tải danh sách Flash Sale');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFlashSale = async (id: string) => {
        setIsDeleteFlashSale(true);
        try {
            const res = await deleteFlashSaleAPI(id);
            if (res && res.statusCode === 200) {
                message.success(res.message || 'Xóa flash sale thành công');
                refreshTable();
            } else {
                notification.error({
                    message: res.error || 'Đã có lỗi xảy ra',
                    description: res.message || 'Không thể xóa flash sale'
                });
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi hệ thống',
                description: 'Đã có lỗi xảy ra khi xóa flash sale'
            });
        } finally {
            setIsDeleteFlashSale(false);
        }
    };

    useEffect(() => {
        fetchFlashSales();
    }, []);

    const refreshTable = () => {
        fetchFlashSales();
    };

    const paginatedData = flashSales.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const renderStatus = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <Tag color="green">Đang hoạt động</Tag>;
            case 'UPCOMING':
                return <Tag color="orange">Sắp diễn ra</Tag>;
            case 'ENDED':
                return <Tag color="red">Đã kết thúc</Tag>;
            default:
                return <Tag color="default">{status}</Tag>;
        }
    };

    return (
        <>
            <div style={{ padding: 12 }}>
                <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={() => setOpenModalCreate(true)}
                    block
                    style={{ marginBottom: 12 }}
                >
                    Add New Flash Sale
                </Button>

                {loading ? (
                    <Spin tip="Loading..." />
                ) : (
                    <>
                        <Row gutter={[12, 12]}>
                            {paginatedData.map((fs) => (
                                <Col xs={24} key={fs.id}>
                                    <Card
                                        title={fs.name}
                                        size="small"
                                        extra={
                                            <Space>
                                                <EditTwoTone
                                                    twoToneColor="#f57800"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        setDataUpdate(fs);
                                                        setOpenModalUpdate(true);
                                                    }}
                                                />
                                                <Popconfirm
                                                    placement="leftTop"
                                                    title="Xác nhận xóa flash sale"
                                                    description="Bạn có chắc chắn muốn xóa flash sale này?"
                                                    onConfirm={() => handleDeleteFlashSale(fs.id.toString())}
                                                    okText="Xác nhận"
                                                    cancelText="Hủy"
                                                    okButtonProps={{ loading: isDeleteFlashSale }}
                                                >
                                                    <DeleteTwoTone
                                                        twoToneColor="#ff4d4f"
                                                        style={{ cursor: "pointer" }}
                                                    />
                                                </Popconfirm>
                                            </Space>
                                        }
                                    >
                                        <div><strong>ID:</strong> {fs.id}</div>
                                        <div><strong>Thời gian:</strong> {fs.startTime} → {fs.endTime}</div>
                                        <div>{renderStatus(fs.status)}</div>
                                        <div style={{ marginTop: 8 }}>
                                            <Tooltip
                                                title={
                                                    <List
                                                        size="small"
                                                        dataSource={fs.items}
                                                        renderItem={(item) => (
                                                            <List.Item>
                                                                <Typography.Text>
                                                                    {item.productName} - {item.salePrice.toLocaleString()}đ ({item.quantity} sp)
                                                                </Typography.Text>
                                                            </List.Item>
                                                        )}
                                                    />
                                                }
                                            >
                                                <a>Xem chi tiết sản phẩm ({fs.items.length})</a>
                                            </Tooltip>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={flashSales.length}
                                onChange={(page) => setCurrentPage(page)}
                                size="small"
                                simple={window.innerWidth < 1000}
                            />
                        </div>
                    </>
                )}
            </div>

            <CreateFlashSaleModal
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />
            <UpdateFlashSale
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
            <DetailFlashSale
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
        </>
    );
};

export default TableFlashSaleMobile;
