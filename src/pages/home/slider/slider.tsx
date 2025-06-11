import React, { useState, useEffect } from "react";
import logo from "@/assets/logo.jpg";
import banner from "@/assets/banner.png";
import bannerone from "@/assets/bannerone.jpg";
import "./slider.scss";

interface Slide {
    id: number;
    image: string;
    alt: string;
}

const Slider: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides: Slide[] = [
        { id: 1, image: logo, alt: "Banner 1" },
        { id: 2, image: banner, alt: "Banner 2" },
        { id: 3, image: bannerone, alt: "Banner 3" },
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
                {slides.map((slide) => (
                    <div key={slide.id} className="slide">
                        <img src={slide.image} alt={slide.alt} />
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
