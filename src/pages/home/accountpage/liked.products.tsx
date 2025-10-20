import { useEffect, useState } from 'react';
import { Card, List, Typography, message, Spin, Image } from 'antd';
import { getLikedProductsAPI } from '@/services/api';
import { Link } from 'react-router-dom';
import { slugify } from '@/utils/slugify';

const { Title, Text } = Typography;

interface ILike {
    likeId: number;
    userId: number;
    userName: string;
    productId: number;
    productName: string;
    productThumbnail: string;
    productDescription: string;
    productPrice: number;
}

interface LikedProductsProps {
    userId: number;
}

function LikedProducts({ userId }: LikedProductsProps) {
    const [likes, setLikes] = useState<ILike[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                setLoading(true);
                const res = await getLikedProductsAPI(userId);
                setLikes(res.data);
            } catch (err) {
                message.error('Không thể tải danh sách sản phẩm đã thích!');
            } finally {
                setLoading(false);
            }
        };

        fetchLikes();
    }, [userId]);

    return (
        <Card>
            {loading ? (
                <Spin />
            ) : (
                <List
                    dataSource={likes}
                    renderItem={(item) => (
                        <List.Item key={item.likeId}>
                            <List.Item.Meta
                                avatar={
                                    <Image
                                        width={80}
                                        src={`${import.meta.env.VITE_BACKEND_URL}/upload/products/${item.productThumbnail}`}
                                        alt={item.productName}
                                    />
                                }
                                title={
                                    <Link to={`/product/${slugify(item.productName)}-${item.productId}`}>
                                        <Text strong>{item.productName}</Text>
                                    </Link>
                                }
                                description={
                                    <>
                                        <Text type="secondary">Mã sản phẩm: {item.productId}</Text>
                                        <br />
                                        <Text style={{ whiteSpace: 'pre-line' }}>{item.productDescription}</Text>
                                        <br />
                                        <Text strong style={{ color: '#f5222d' }}>
                                            Giá tiền: {Number(item.productPrice).toLocaleString('vi-VN')}₫
                                        </Text>
                                        <br />
                                        <Text type="secondary">Người thích: {item.userName}</Text>
                                    </>
                                }
                            />
                        </List.Item>
                    )}
                />
            )}
        </Card>
    );
}

export default LikedProducts;
