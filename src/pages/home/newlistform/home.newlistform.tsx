import React, { useState } from "react";
import "./home.newlistform.scss";

const NewsletterForm = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Cảm ơn bạn đã đăng ký: ${email}`);
        setEmail("");
    };

    return (
        <div className="newsletter-form">
            <h3>Đăng ký nhận tin khuyến mãi</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Đăng ký</button>
            </form>
        </div>
    );
};

export default NewsletterForm;
