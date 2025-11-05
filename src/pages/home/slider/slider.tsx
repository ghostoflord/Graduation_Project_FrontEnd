import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getSlidesByTypeAPI } from "@/services/api";
import "./slider.scss";

interface ISlide {
    id: number;
    title: string;
    description?: string;
    imageUrl: string;
    redirectUrl?: string;
    active: boolean;
    orderIndex: number;
    type: string;
}

const Slider: React.FC = () => {
    const [slidesData, setSlidesData] = useState<ISlide[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 500);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSlides = async () => {
            setLoading(true);
            try {
                const res = await getSlidesByTypeAPI("ABOUT");
                if (res.data) {
                    // lọc chỉ slide active và có ảnh
                    const activeSlides = res.data
                        .filter((s: ISlide) => s.active && s.imageUrl)
                        //  sắp xếp theo orderIndex tăng dần
                        .sort((a: ISlide, b: ISlide) => a.orderIndex - b.orderIndex);

                    setSlidesData(activeSlides);
                }
            } catch (error) {
                console.error("Error loading slides:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSlides();
    }, []);


    const groupedSlides = useMemo(() => {
        if (isMobile) return slidesData.map((s) => [s]);
        return slidesData.reduce((acc: ISlide[][], _, i) => {
            if (i % 2 === 0) acc.push(slidesData.slice(i, i + 2));
            return acc;
        }, []);
    }, [slidesData, isMobile]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % groupedSlides.length);
    }, [groupedSlides.length]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + groupedSlides.length) % groupedSlides.length);
    }, [groupedSlides.length]);

    useEffect(() => {
        const timer = setInterval(goToNext, 2000);
        return () => clearInterval(timer);
    }, [goToNext]);


    // 📱 Lắng nghe resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 500);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Loading UI
    if (loading) {
        return <div className="slider-loading">Đang tải slide...</div>;
    }

    if (!slidesData.length) {
        return <div className="slider-empty">Không có slide nào</div>;
    }

    return (
        <div className="slider">
            <div
                className="slider-inner"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {groupedSlides.map((group, idx) => (
                    <div key={idx} className="slide">
                        {group.map((slide) => {
                            const fullUrl = slide.imageUrl.startsWith("http")
                                ? slide.imageUrl
                                : `${import.meta.env.VITE_BACKEND_URL}/upload/slides/${slide.imageUrl}`;
                            return (
                                <div key={slide.id} className="slide-item">
                                    <a href={slide.redirectUrl || "#"} target="_blank" rel="noreferrer">
                                        <img src={fullUrl} alt={slide.title} />
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="nav-buttons">
                <button onClick={goToPrev}>‹</button>
                <button onClick={goToNext}>›</button>
            </div>

            <div className="dots">
                {groupedSlides.map((_, index) => (
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
