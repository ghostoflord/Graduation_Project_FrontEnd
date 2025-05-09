import { useEffect, useState } from 'react';
import { App, Button, Card, List, Popconfirm, Pagination } from 'antd';
import { PlusOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { getProductsAPI, deleteProductAPI } from '@/services/api';
import CreateProduct from '../create.product';
import UpdateProduct from '../update.product';
import DetailProduct from '../detail.product';

const TableProductMobile = () => {
    const [products, setProducts] = useState<IProductTable[]>([]);
    const [loading, setLoading] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<IProductTable | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState<IProductTable | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const { message, notification } = App.useApp();

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const res = await getProductsAPI(`current=${page}&pageSize=${pageSize}`);
            if (res?.data?.result) {
                setProducts(res.data.result);
                setTotal(res.data.meta?.total || 0);
            }
        } catch (err) {
            notification.error({ message: 'Lỗi khi lấy danh sách sản phẩm' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const handleDelete = async (id: string) => {
        setIsDeleting(true);
        try {
            const res = await deleteProductAPI(id);
            if (res && res.statusCode === 200) {
                message.success(res.message || 'Xóa sản phẩm thành công');
                fetchProducts(currentPage);
            } else {
                notification.error({
                    message: res.error || 'Lỗi xóa sản phẩm',
                    description: res.message || 'Không thể xóa sản phẩm'
                });
            }
        } catch (err) {
            notification.error({
                message: 'Lỗi hệ thống',
                description: 'Đã có lỗi xảy ra khi xóa sản phẩm'
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        style={{
                            width: '50%',
                            maxWidth: 400,
                            height: '40px',
                            fontSize: '16px',
                            fontWeight: 600
                        }}
                        onClick={() => setOpenModalCreate(true)}
                    >
                        Thêm mới
                    </Button>
                </div>

                <List
                    loading={loading}
                    dataSource={products}
                    renderItem={(item) => (
                        <Card
                            key={item._id}
                            style={{ marginBottom: 16 }}
                            title={
                                <div onClick={() => { setDataViewDetail(item); setOpenViewDetail(true); }} style={{ cursor: 'pointer' }}>
                                    {item.name}
                                </div>
                            }
                            extra={
                                <>
                                    <EditTwoTone
                                        twoToneColor="#f57800"
                                        style={{ marginRight: 12 }}
                                        onClick={() => {
                                            setDataUpdate(item);
                                            setOpenModalUpdate(true);
                                        }}
                                    />
                                    <Popconfirm
                                        title="Xác nhận xóa sản phẩm"
                                        description="Bạn có chắc chắn muốn xóa sản phẩm này?"
                                        onConfirm={() => handleDelete(item.id)}
                                        okText="Xác nhận"
                                        cancelText="Hủy"
                                        okButtonProps={{ loading: isDeleting }}
                                    >
                                        <DeleteTwoTone twoToneColor="#ff4d4f" style={{ cursor: 'pointer' }} />
                                    </Popconfirm>
                                </>
                            }
                        >
                            <div>
                                <div>Mã SP: {item.productCode}</div>
                                <div>Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</div>
                                {item.image && (
                                    <img
                                        src={
                                            item.image.startsWith('http')
                                                ? item.image
                                                : `${import.meta.env.VITE_BACKEND_URL}/upload/products/${item.image}`
                                        }
                                        alt="product"
                                        style={{ marginTop: 10, width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }}
                                    />
                                )}
                            </div>
                        </Card>
                    )}
                />

                {/* Pagination Controls */}
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={total}
                        onChange={(page) => setCurrentPage(page)}
                        showSizeChanger={false}
                        simple={window.innerWidth < 576}
                    />
                </div>
            </div>

            {/* Modal thêm mới */}
            <CreateProduct
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={() => fetchProducts(currentPage)}
            />

            {/* Modal cập nhật */}
            <UpdateProduct
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={() => fetchProducts(currentPage)}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />

            {/* Modal xem chi tiết */}
            <DetailProduct
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
        </>
    );
};

export default TableProductMobile;
