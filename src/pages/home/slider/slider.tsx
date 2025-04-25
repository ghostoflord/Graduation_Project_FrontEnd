import React, { useState, useEffect } from "react";
import "./slider.scss";

interface Slide {
    id: number;
    image: string;
    alt: string;
}

const Slider: React.FC<{ slides: Slide[] }> = ({ slides }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="slider">
            {slides.map((slide, index) => (
                <img
                    key={slide.id}
                    src={slide.image}
                    alt={slide.alt}
                    className={index === currentIndex ? "active" : ""}
                />
            ))}
        </div>
    );
};

export default Slider;
