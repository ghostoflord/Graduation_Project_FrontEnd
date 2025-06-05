import { useState } from 'react';
import { Input, Button, List, Typography, Card } from 'antd';
import axios from 'axios';
import './chat.bot.scss';

export const ChatBot = () => {
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        if (!input.trim()) return;
        setMessages([...messages, { sender: 'user', text: input }]);

        const res = await axios.post('http://localhost:8080/api/v1/manual-chat', { message: input });
        setMessages((prev) => [...prev, { sender: 'bot', text: res.data }]);
        setInput('');
    };

    return (
        <Card title="💬 Chat hỗ trợ" className="chatbot-container">
            <List
                dataSource={messages}
                renderItem={(msg) => (
                    <List.Item className={msg.sender === 'user' ? 'user-msg' : 'bot-msg'}>
                        <Typography.Text strong>{msg.sender === 'user' ? 'Bạn' : 'Bot'}:</Typography.Text> {msg.text}
                    </List.Item>
                )}
            />
            <Input.Group compact>
                <Input
                    style={{ width: 'calc(100% - 80px)' }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onPressEnter={sendMessage}
                />
                <Button type="primary" onClick={sendMessage}>
                    Gửi
                </Button>
            </Input.Group>
        </Card>
    );
};
