import { useEffect, useState } from 'react';
import { List, Form, Input, Button, message } from 'antd'; // ✅ Import Comment từ Ant Design
import { getCommentsByProductAPI, postCommentAPI } from '@/services/api';
// import Comment from 'antd/lib/comment'; // ✅ dùng được với Webpack và Vite

const { TextArea } = Input;

interface CommentProps {
    productId: number;
}

interface CommentItem {
    id: number;
    content: string;
    createdAt: string;
    user: {
        name: string;
    };
}

const CommentSection = ({ productId }: CommentProps) => {
    const [comments, setComments] = useState<CommentItem[]>([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    const fetchComments = async () => {
        try {
            const res = await getCommentsByProductAPI(productId);
            console.log('Kết quả từ API:', res);
            if (res?.data) {
                console.log('Danh sách bình luận:', res.data);
                setComments(res.data.reverse());
            }
        } catch (error) {
            console.error('Lỗi khi tải bình luận:', error);
        }
    };

    const handleSubmit = async () => {
        if (!userId) {
            return message.warning('Vui lòng đăng nhập để bình luận.');
        }

        if (!content.trim()) {
            return message.warning('Vui lòng nhập nội dung bình luận.');
        }

        setLoading(true);
        try {
            await postCommentAPI({ userId, productId, content });
            setContent('');
            await fetchComments();
            message.success('Đã gửi bình luận.');
        } catch (error) {
            console.error('Lỗi gửi bình luận:', error);
            message.error('Gửi bình luận thất bại.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [productId]);

    return (
        <div className="comment-section">
            <h3 style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, marginTop: 16 }}>Bình luận sản phẩm</h3>
            <List
                dataSource={comments}
                itemLayout="horizontal"
                renderItem={(item, index) => (
                    <List.Item style={{ borderBottom: index !== comments.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                        <List.Item.Meta
                            title={item.user?.name || 'Ẩn danh'}
                            description={
                                <>
                                    <div>{item.content}</div>
                                    <div style={{ fontSize: 12, color: '#999' }}>
                                        {new Date(item.createdAt).toLocaleString('vi-VN')}
                                    </div>
                                </>
                            }
                        />
                    </List.Item>
                )}
            />


            <Form.Item style={{ marginTop: 16 }}>
                <TextArea
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Viết bình luận..."
                />
                <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                    style={{ marginTop: 8 }}
                >
                    Gửi bình luận
                </Button>
            </Form.Item>
        </div >
    );
};

export default CommentSection;
