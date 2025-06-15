import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { CloseOutlined, SendOutlined, WechatOutlined } from '@ant-design/icons';
import './chat.widget.scss';
import ChatWithGPT from '../chat/chat.with.gpt';
import { sendMessageToChatBOT } from '@/services/api';
import AskStaffForm from './ask.staff.form';


const ChatToggleIcon = ({ onClick }: { onClick: () => void }) => (
    <div className="chat-toggle-icon" onClick={onClick} role="button" tabIndex={0}>
        <WechatOutlined style={{ fontSize: '30px', color: '#1677ff' }} />
    </div>
);

const ChatWidget = () => {
    const [visible, setVisible] = useState(false);
    const [isGPTMode, setIsGPTMode] = useState(false);
    const [isAskStaffMode, setIsAskStaffMode] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            const res = await sendMessageToChatBOT(userMessage);
            setMessages((prev) => [...prev, { sender: 'bot', text: res }]);
        } catch (error) {
            setMessages((prev) => [...prev, { sender: 'bot', text: 'Lỗi kết nối, vui lòng thử lại sau.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!visible && <ChatToggleIcon onClick={() => setVisible(true)} />}

            {visible && (
                <div className="chat-widget fadeInUp">
                    <div className="chat-header">
                        <span>
                            {isGPTMode
                                ? 'Chat với AI 🤖'
                                : isAskStaffMode
                                    ? 'Liên hệ nhân viên 📞'
                                    : 'Hỗ trợ trực tuyến'}
                        </span>
                        <CloseOutlined onClick={() => setVisible(false)} style={{ cursor: 'pointer' }} />
                    </div>

                    <div className="chat-body">
                        {isGPTMode ? (
                            <ChatWithGPT onBack={() => setIsGPTMode(false)} />
                        ) : isAskStaffMode ? (
                            <AskStaffForm onClose={() => setIsAskStaffMode(false)} />
                        ) : (
                            <>
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={msg.sender === 'user' ? 'user-msg' : 'bot-msg'}>
                                        {msg.text}

                                        {msg.sender === 'bot' &&
                                            msg.text === 'Xin lỗi, tôi chưa hiểu yêu cầu của bạn.' && (
                                                <div className="error-options">
                                                    <button onClick={() => setIsGPTMode(true)}>Hỏi AI</button>
                                                    <button onClick={() => setIsAskStaffMode(true)}>Gặp nhân viên</button>
                                                </div>
                                            )}
                                    </div>
                                ))}

                                {!loading && messages.length === 0 && (
                                    <div className="bot-msg">
                                        Xin chào! Tôi có thể giúp gì cho bạn?
                                        <div className="error-options">
                                            <button onClick={() => setIsGPTMode(true)}>Hỏi AI</button>
                                            <button onClick={() => setIsAskStaffMode(true)}>Gặp nhân viên</button>
                                        </div>
                                    </div>
                                )}

                                {loading && <div className="bot-msg loading">Đang gửi...</div>}
                            </>
                        )}
                    </div>

                    {!isGPTMode && !isAskStaffMode && (
                        <div className="chat-footer">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onPressEnter={handleSend}
                                placeholder="Nhập tin nhắn..."
                                disabled={loading}
                            />
                            <Button
                                icon={<SendOutlined />}
                                type="primary"
                                onClick={handleSend}
                                disabled={loading}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ChatWidget;
