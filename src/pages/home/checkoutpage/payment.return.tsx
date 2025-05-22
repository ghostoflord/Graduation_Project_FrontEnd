import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentReturn = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const hasSentRef = useRef(false);

    useEffect(() => {
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const paymentStatus = vnp_ResponseCode === '00' ? 'success' : 'fail';

        const userId = localStorage.getItem('vnp_userId') || searchParams.get('userId');
        const amount = localStorage.getItem('vnp_amount') || searchParams.get('vnp_Amount');
        const paymentRef = localStorage.getItem('vnp_paymentRef') || searchParams.get('vnp_TxnRef');

        if (!userId || !amount || !paymentRef) {
            console.error('Thiếu thông tin thanh toán. Huỷ giao dịch.');
            navigate('/order-fail');
            return;
        }

        const sendPaymentResult = async () => {
            if (hasSentRef.current) return;
            hasSentRef.current = true;

            try {
                const res = await axios.post('http://localhost:8080/api/v1/payment/vnpay/response', {
                    userId,
                    amount,
                    paymentRef,
                    paymentStatus,
                });

                if (res.data.statusCode === 200) {
                    localStorage.removeItem('vnp_userId');
                    localStorage.removeItem('vnp_amount');
                    localStorage.removeItem('vnp_paymentRef');
                    navigate('/order-success');
                } else {
                    console.error('Phản hồi không thành công từ backend:', res.data.message);
                    navigate('/order-fail');
                }
            } catch (err) {
                console.error("Lỗi gửi kết quả thanh toán:", err);
                navigate('/order-fail');
            }
        };

        sendPaymentResult();
    }, [searchParams, navigate]);

    return <div>Đang xử lý kết quả thanh toán...</div>;
};

export default PaymentReturn;
