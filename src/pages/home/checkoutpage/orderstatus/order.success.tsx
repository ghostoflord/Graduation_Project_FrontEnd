import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

const OrderSuccess = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: 50 }}>
            <h2> Đặt hàng thành công!</h2>
            <p>Cảm ơn bạn đã mua hàng.</p>
            <Button type="primary" onClick={handleGoHome} style={{ marginTop: 20 }}>
                Về trang chủ
            </Button>
        </div>
    );
};

export default OrderSuccess;

