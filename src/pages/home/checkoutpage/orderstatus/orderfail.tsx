import React from 'react';
import { Button } from 'antd';
import { FrownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './order-fail.scss';

const OrderFail = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="order-fail-container">
            <div className="order-fail-card">
                <div className="icon-wrap">
                    <FrownOutlined className="fail-icon" />
                </div>
                <h2>Thanh toán thất bại</h2>
                <p>Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ.</p>
                <Button
                    size="large"
                    className="retry-btn"
                    onClick={handleGoHome}
                >
                    Về trang chủ
                </Button>
            </div>
        </div>
    );
};

export default OrderFail;
