import React, { useEffect, useState } from "react";
import "./slider.scss";

interface Slide {
    id: number;
    imageUrl: string;
    title: string;
    redirectUrl?: string;
}

const HomeSlider = ({ slides }: { slides: Slide[] }) => {
    const [visibleSlides, setVisibleSlides] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 700) {
                setVisibleSlides(4); // Mobile
            } else if (window.innerWidth < 1000) {
                setVisibleSlides(2); // Tablet
            } else {
                setVisibleSlides(1); // Desktop
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="slider">
            <div
                className="slider-inner"
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${slides.length}, 1fr)`,
                    gap: "12px",
                    transform: `translateX(0)`,
                }}
            >
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className="slide-item"
                        style={{
                            flex: `0 0 ${100 / visibleSlides}%`,
                            maxWidth: `${100 / visibleSlides}%`,
                        }}
                    >
                        <a href={slide.redirectUrl || "#"}>
                            <img src={slide.imageUrl} alt={slide.title} />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeSlider;
