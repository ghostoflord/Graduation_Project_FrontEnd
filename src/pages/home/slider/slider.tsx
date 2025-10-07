import React, { useState, useEffect } from "react";
import slide1 from "@/assets/slide1.png";
import slide2 from "@/assets/slide2.png";
import slide3 from "@/assets/slide3.png";
import slide4 from "@/assets/slide4.png";
import "./slider.scss";

interface Slide {
    id: number;
    image: string;
    alt: string;
}

const Slider: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // 👉 mỗi "slide" sẽ là 1 cặp ảnh
    const slides: Slide[][] = [
        [
            { id: 1, image: slide1, alt: "Slider 1" },
            { id: 2, image: slide2, alt: "Slider 2" },
        ],
        [
            { id: 3, image: slide3, alt: "Slider 3" },
            { id: 4, image: slide4, alt: "Slider 4" },
        ],
    ];

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        const timer = setInterval(goToNext, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="slider">
            <div
                className="slider-inner"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slides.map((pair, idx) => (
                    <div key={idx} className="slide">
                        {pair.map((slide) => (
                            <div key={slide.id} className="slide-item">
                                <img src={slide.image} alt={slide.alt} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="nav-buttons">
                <button onClick={goToPrev} className="prev-btn">‹</button>
                <button onClick={goToNext} className="next-btn">›</button>
            </div>

            <div className="dots">
                {slides.map((_, index) => (
                    <span
                        key={index}
                        className={index === currentIndex ? "dot active" : "dot"}
                        onClick={() => setCurrentIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default Slider;
