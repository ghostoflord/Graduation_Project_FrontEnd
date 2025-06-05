import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, List, Typography, Spin } from 'antd';
import { sendMessageToChatBOT } from '@/services/api';
import './chat.widget.scss';

const { Text } = Typography;

interface Message {
    sender: 'user' | 'bot';
    text: string;
    isError?: boolean;
}

const ChatWidget = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); // trạng thái mở/đóng chat form

    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [messages, open]);

    const sendMessage = async () => {
        const trimmedInput = input.trim();
        if (!trimmedInput) return;

        setMessages((prev) => [...prev, { sender: 'user', text: trimmedInput }]);
        setInput('');
        setLoading(true);

        try {
            const botReply = await sendMessageToChatBOT(trimmedInput);
            const isError = botReply.includes('Xin lỗi, tôi chưa hiểu yêu cầu của bạn');
            setMessages((prev) => [...prev, { sender: 'bot', text: botReply, isError }]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { sender: 'bot', text: '⚠️ Có lỗi xảy ra. Vui lòng thử lại sau.', isError: true },
            ]);
            console.error('ChatBot error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChatGPT = () => alert('Chuyển sang chat GPT');
    const handleChatAdmin = () => alert('Liên hệ admin');

    return (
        <>
            {!open && (
                <div className="chat-toggle-icon" onClick={() => setOpen(true)} title="Mở chat hỗ trợ">
                    💬
                </div>
            )}

            {open && (
                <div className="chat-widget fadeInUp">
                    <div className="chat-header">
                        💬 Chat hỗ trợ
                        <button className="close-btn" onClick={() => setOpen(false)} aria-label="Đóng chat">
                            ✕
                        </button>
                    </div>

                    <div className="chat-body" ref={bodyRef}>
                        <List
                            dataSource={messages}
                            renderItem={(msg, idx) => (
                                <List.Item
                                    key={idx}
                                    className={msg.sender === 'user' ? 'user-msg' : 'bot-msg'}
                                    style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                                >
                                    <Text strong>{msg.sender === 'user' ? 'Bạn:' : 'Bot:'}</Text> {msg.text}

                                    {msg.isError && (
                                        <div className="error-options" style={{ marginTop: 8 }}>
                                            <Button
                                                type="primary"
                                                size="small"
                                                onClick={handleChatGPT}
                                                style={{ marginRight: 8 }}
                                            >
                                                Chuyển sang Chat GPT
                                            </Button>
                                            <Button size="small" onClick={handleChatAdmin}>
                                                Nói chuyện với Admin
                                            </Button>
                                        </div>
                                    )}
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
                            onChange={(e) => setInput(e.target.value)}
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
        </>
    );
};

export default ChatWidget;
