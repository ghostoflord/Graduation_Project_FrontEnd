import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import './order-success.page.scss';

const OrderSuccess = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="order-success-page">
            <div className="success-card">
                <CheckCircleOutlined className="success-icon" />
                <h2>Đặt hàng thành công!</h2>
                <p>Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.</p>
                <Button
                    size="large"
                    className="home-btn"
                    onClick={handleGoHome}
                >
                    Về trang chủ
                </Button>
            </div>
        </div>
    );
};

export default OrderSuccess;
