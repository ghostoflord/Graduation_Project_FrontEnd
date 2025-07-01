import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, List, Typography, Spin } from 'antd';
import { SendOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './chat.with.gpt.scss';
import { sendMessageToChatbot } from '@/services/api';

const { Text } = Typography;

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatWithGPTProps {
    onBack?: () => void;
}

const ChatWithGPT: React.FC<ChatWithGPTProps> = ({ onBack }) => {
    const [input, setInput] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setChatHistory((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await sendMessageToChatbot(input);
            const botMessage: ChatMessage = { role: 'assistant', content: response };
            setChatHistory((prev) => [...prev, botMessage]);
        } catch {
            setChatHistory((prev) => [
                ...prev,
                { role: 'assistant', content: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Auto scroll to bottom when new message
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [chatHistory]);

    return (
        <div className="chat-container">
            <div className="chat-box">
                <div className="chat-header">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={onBack}
                        size="small"
                        className="back-btn"
                    >
                        Quay lại
                    </Button>
                    <Text strong className="chat-title">Trợ lý ảo</Text>
                </div>

                <div className="chat-list" ref={listRef}>
                    {chatHistory.map((item, index) => (
                        <div
                            key={index}
                            className={`chat-bubble ${item.role === 'user' ? 'user' : 'assistant'}`}
                        >
                            <Text>
                                {item.role === 'user' ? 'USER: ' : 'CHATBOT: '} {item.content}
                            </Text>
                        </div>
                    ))}
                    {loading && (
                        <div className="chat-loading">
                            <Spin size="small" />
                        </div>
                    )}
                </div>

                <div className="chat-input">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Nhập tin nhắn..."
                        disabled={loading}
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSend}
                        disabled={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatWithGPT;
