import { useEffect, useState } from 'react';
import { Card, Tag, Spin, Row, Col, Typography, Pagination, App } from 'antd';
import { getAllProductDetailsAPI } from '@/services/api';

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

    const paginatedData = productDetails.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div style={{ padding: 12 }}>
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
        </div>
    );
};

export default TableProductDetailMobile;
