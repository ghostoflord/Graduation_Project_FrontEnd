import React, { useState } from 'react';
import { Input, Button, List, Typography, Spin } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import './chat.with.gpt.scss';
import { sendMessageToChatbot } from '@/services/api';

const { Text } = Typography;

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

const ChatWithGPT = () => {
    const [input, setInput] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setChatHistory(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await sendMessageToChatbot(input);
            const botMessage: ChatMessage = { role: 'assistant', content: response };
            setChatHistory(prev => [...prev, botMessage]);
        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'assistant', content: 'Có lỗi xảy ra. Vui lòng thử lại sau.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                <List
                    dataSource={chatHistory}
                    renderItem={(item, index) => (
                        <List.Item key={index} className={item.role === 'user' ? 'user-message' : 'assistant-message'}>
                            <Text>{item.role === 'user' ? '🧑‍💻' : '🤖'} {item.content}</Text>
                        </List.Item>
                    )}
                />
                {loading && (
                    <div className="loading">
                        <Spin />
                    </div>
                )}
                <div className="chat-input">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập tin nhắn..."
                    />
                    <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>
                        Gửi
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatWithGPT;
