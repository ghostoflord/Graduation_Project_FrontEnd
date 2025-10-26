import { useEffect, useState } from 'react';
import { List, Form, Input, Button, message } from 'antd';
import { getCommentsByProductAPI, postCommentAPI } from '@/services/api';
import './comment.section.scss';

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
        avatar: string;
    };
}

const CommentSection = ({ productId }: CommentProps) => {
    const [comments, setComments] = useState<CommentItem[]>([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [visibleCount, setVisibleCount] = useState(3); // 👈 hiển thị 3 bình luận mới nhất ban đầu

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    const fetchComments = async () => {
        try {
            const res = await getCommentsByProductAPI(productId);
            if (res?.data) {
                setComments(res.data.reverse()); // bình luận mới nhất ở đầu
            }
        } catch (error) {
            console.error('Lỗi khi tải bình luận:', error);
        }
    };

    const handleSubmit = async () => {
        if (!userId) return message.warning('Vui lòng đăng nhập để bình luận.');
        if (!content.trim()) return message.warning('Vui lòng nhập nội dung bình luận.');

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

    const visibleComments = comments.slice(0, visibleCount);

    return (
        <div className="comment-section">
            <h3 style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, marginTop: 16 }}>
                Bình luận sản phẩm
            </h3>

            <List
                dataSource={visibleComments}
                itemLayout="horizontal"
                renderItem={(item, index) => (
                    <List.Item
                        style={{
                            borderBottom: index !== visibleComments.length - 1 ? '1px solid #f0f0f0' : 'none',
                        }}
                    >
                        <List.Item.Meta
                            avatar={
                                <img
                                    src={
                                        item.user?.avatar
                                            ? item.user.avatar.startsWith('http')
                                                ? item.user.avatar
                                                : `${import.meta.env.VITE_BACKEND_URL}/upload/avatars/${item.user.avatar}`
                                            : '/default-avatar.png'
                                    }
                                    alt={item.user?.name || 'User'}
                                    className="comment-avatar"
                                />
                            }
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

            {/* Nút “Xem thêm” & “Thu gọn” */}
            {comments.length > 3 && (
                <div style={{ textAlign: 'center', marginTop: 8 }}>
                    {visibleCount < comments.length ? (
                        <Button type="link" onClick={() => setVisibleCount((prev) => prev + 3)}>
                            Xem thêm bình luận cũ
                        </Button>
                    ) : (
                        <Button type="link" onClick={() => setVisibleCount(3)}>
                            Thu gọn bình luận
                        </Button>
                    )}
                </div>
            )}

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
        </div>
    );
};

export default CommentSection;
