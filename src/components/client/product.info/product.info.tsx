import { useEffect, useState } from 'react';
import { Descriptions, Spin } from 'antd';
import { getProductDetailByProductIdAPI } from '@/services/api';
import CommentSection from '../comment/comment.section';

interface ProductInfo {
    productId: string;
}

const ProductInfo = ({ productId }: ProductInfo) => {
    const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchProductDetail = async () => {
        setLoading(true);
        try {
            const res = await getProductDetailByProductIdAPI(productId);
            if (res?.data) {
                console.log('👉 Product Detail:', res.data); //  In ra console
                setProductDetail(res.data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchProductDetail();
        }
    }, [productId]);

    return (
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', padding: 24 }}>
            <div style={{ flex: 2, minWidth: 300 }}>
                <CommentSection productId={productId} />
            </div>

            <div style={{ flex: 1, minWidth: 300 }}>
                <h3 style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>Thông số kỹ thuật</h3>
                {loading ? (
                    <Spin />
                ) : productDetail ? (
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="CPU">{productDetail.cpu}</Descriptions.Item>
                        <Descriptions.Item label="RAM">{productDetail.ram}</Descriptions.Item>
                        <Descriptions.Item label="Ổ cứng">{productDetail.storage}</Descriptions.Item>
                        <Descriptions.Item label="GPU">{productDetail.gpu}</Descriptions.Item>
                        <Descriptions.Item label="Màn hình">{productDetail.screen}</Descriptions.Item>
                        <Descriptions.Item label="Pin">{productDetail.battery}</Descriptions.Item>
                        <Descriptions.Item label="Trọng lượng">{productDetail.weight}</Descriptions.Item>
                        <Descriptions.Item label="Chất liệu">{productDetail.material}</Descriptions.Item>
                        <Descriptions.Item label="Hệ điều hành">{productDetail.os}</Descriptions.Item>
                        <Descriptions.Item label="Tính năng đặc biệt">{productDetail.specialFeatures}</Descriptions.Item>
                        <Descriptions.Item label="Cổng kết nối">{productDetail.ports}</Descriptions.Item>
                    </Descriptions>
                ) : (
                    <p>Không có thông tin chi tiết sản phẩm.</p>
                )}
            </div>
        </div>
    );
};
export default ProductInfo;
