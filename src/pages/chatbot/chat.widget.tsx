import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, List, Typography, Spin } from 'antd';
import { sendMessageToChatBOT } from '@/services/api';
import { MessageOutlined, CloseOutlined } from '@ant-design/icons';
import './chat.widget.scss';

const { Text } = Typography;

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const ChatWidget: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        const trimmedInput = input.trim();
        if (!trimmedInput) return;

        setMessages(prev => [...prev, { sender: 'user', text: trimmedInput }]);
        setInput('');
        setLoading(true);

        try {
            const botReply = await sendMessageToChatBOT(trimmedInput);
            setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                { sender: 'bot', text: '⚠️ Có lỗi xảy ra. Vui lòng thử lại sau.' },
            ]);
            console.error('ChatBot error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`chat-widget ${open ? 'open' : ''}`}>
            {!open && (
                <div className="chat-icon" onClick={() => setOpen(true)} title="Mở chat hỗ trợ">
                    <MessageOutlined />
                </div>
            )}

            {open && (
                <div className="chat-box">
                    <div className="chat-header">
                        💬 Chat hỗ trợ
                        <button className="close-btn" onClick={() => setOpen(false)} title="Đóng chat">
                            <CloseOutlined />
                        </button>
                    </div>

                    <div className="chat-body" ref={bodyRef}>
                        <List
                            dataSource={messages}
                            renderItem={(msg, idx) => (
                                <List.Item key={idx} className={msg.sender === 'user' ? 'user-msg' : 'bot-msg'}>
                                    <Text strong>{msg.sender === 'user' ? 'Bạn:' : 'Bot:'}</Text> {msg.text}
                                </List.Item>
                            )}
                            locale={{ emptyText: loading ? <Spin /> : 'Chưa có tin nhắn' }}
                        />

                        {loading && (
                            <div className="loading">
                                <Spin />
                            </div>
                        )}
                    </div>

                    <div className="chat-footer">
                        <Input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onPressEnter={sendMessage}
                            disabled={loading}
                            placeholder="Nhập tin nhắn..."
                        />
                        <Button type="primary" onClick={sendMessage} loading={loading} disabled={loading}>
                            Gửi
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
