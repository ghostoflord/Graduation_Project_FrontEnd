import { useEffect, useRef, useState } from 'react';
import { Card, Spin, Row, Col, Typography, Pagination, Popconfirm, Button, App, Space } from 'antd';
import { EditTwoTone, DeleteTwoTone, PlusOutlined } from '@ant-design/icons';
import { getAllProductDetailsAPI, deleteProductDetailAPI } from '@/services/api';
import DetailProduct from '../../detail.product';
import DetailOfProduct from '../detail.of.product';
import CreateProductDetail from '../create.product.detail';
import UpdateProductDetail from '../update.product.detail';
import { ActionType } from '@ant-design/pro-components';

interface IProductDetail {
    id: string;
    cpu: string;
    ram: string;
    storage: string;
    gpu: string;
    screen: string;
    battery: string;
    weight: string;
    material: string;
    os: string;
    specialFeatures: string;
    ports: string;
    productId: string;
}

const TableProductDetailMobile = () => {
    const [loading, setLoading] = useState(true);
    const [productDetails, setProductDetails] = useState<IProductDetail[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const { message } = App.useApp();

    const actionRef = useRef<ActionType>();

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IProductDetail | null>(null);

    const [openViewDetailSpecification, setOpenViewDetailSpecification] = useState<boolean>(false);
    const [dataViewDetailSpecification, setDataViewDetailSpecification] = useState<IProductDetail | null>(null);

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IProductDetail | null>(null);

    const [isDeleteProduct, setIsDeleteProduct] = useState<boolean>(false);

    const fetchProductDetails = async () => {
        setLoading(true);
        try {
            const res = await getAllProductDetailsAPI();
            if (res.data) {
                setProductDetails(res.data);
            }
        } catch (error) {
            message.error('Không thể tải danh sách chi tiết sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductDetails();
    }, []);

    const handleDeleteProduct = async (id: string) => {
        setIsDeleteProduct(true);
        try {
            const res = await deleteProductDetailAPI(id);
            if (res && res.statusCode === 200) {
                message.success(res.message || 'Xóa chi tiết sản phẩm thành công');
                fetchProductDetails(); // Refresh the table after delete
            } else {
                message.error(res.error || 'Không thể xóa chi tiết sản phẩm');
            }
        } catch (error) {
            message.error('Đã có lỗi xảy ra khi xóa chi tiết sản phẩm');
        } finally {
            setIsDeleteProduct(false);
        }
    };

    const paginatedData = productDetails.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <div style={{ padding: 12 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    {/* Add New Product Button */}
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => setOpenModalCreate(true)}
                        block
                    >
                        Add New Product
                    </Button>

                    {loading ? (
                        <Spin tip="Loading..." />
                    ) : (
                        <>
                            <Row gutter={[12, 12]}>
                                {paginatedData.map((product) => (
                                    <Col xs={24} key={product.id}>
                                        <Card title={`ID: ${product.productId}`} size="small">
                                            <Typography.Text><strong>CPU:</strong> {product.cpu}</Typography.Text>
                                            <div><strong>RAM:</strong> {product.ram}</div>
                                            <div><strong>Storage:</strong> {product.storage}</div>
                                            <div><strong>GPU:</strong> {product.gpu}</div>
                                            <div><strong>Màn hình:</strong> {product.screen}</div>
                                            <div><strong>Pin:</strong> {product.battery}</div>
                                            <div><strong>Trọng lượng:</strong> {product.weight}</div>
                                            <div><strong>Chất liệu:</strong> {product.material}</div>
                                            <div><strong>Hệ điều hành:</strong> {product.os}</div>
                                            <div><strong>Tính năng đặc biệt:</strong> {product.specialFeatures}</div>
                                            <div><strong>Cổng kết nối:</strong> {product.ports}</div>
                                            <div style={{ marginTop: 8 }}>
                                                <EditTwoTone
                                                    twoToneColor="#f57800"
                                                    style={{ marginRight: 16, fontSize: 18, cursor: 'pointer' }}
                                                    onClick={() => {
                                                        setDataUpdate(product);
                                                        setOpenModalUpdate(true);
                                                    }}
                                                />
                                                <Popconfirm
                                                    placement="bottom"
                                                    title="Xác nhận xóa chi tiết sản phẩm?"
                                                    onConfirm={() => handleDeleteProduct(product.id)}
                                                    okText="Xác nhận"
                                                    cancelText="Hủy"
                                                    okButtonProps={{ loading: isDeleteProduct }}
                                                >
                                                    <DeleteTwoTone
                                                        twoToneColor="#ff4d4f"
                                                        style={{ fontSize: 18, cursor: 'pointer' }}
                                                    />
                                                </Popconfirm>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            <div style={{ textAlign: 'center', marginTop: 16 }}>
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={productDetails.length}
                                    onChange={(page) => setCurrentPage(page)}
                                    size="small"
                                    simple={window.innerWidth < 1000}
                                />
                            </div>
                        </>
                    )}
                </Space>
            </div>

            <DetailProduct
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <DetailOfProduct
                openViewDetailSpecification={openViewDetailSpecification}
                setOpenViewDetailSpecification={setOpenViewDetailSpecification}
                dataViewDetailSpecification={dataViewDetailSpecification}
                setDataViewDetailSpecification={setDataViewDetailSpecification}
            />

            <CreateProductDetail
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <UpdateProductDetail
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    );
};

export default TableProductDetailMobile;
