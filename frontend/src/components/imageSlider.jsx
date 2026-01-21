import { useState } from "react";

export default function ImageSlider(props) {
    const images = props.images || [];
    const [activeIndex, setActiveIndex] = useState(0);
    return (
        <div className="w-full  flex flex-col items-center">
            <img src={images[activeIndex]} className="w-[400px] h-[400px] object-contain" />  
            <div className="w-full flex flex-row justify-center gap-4 mt-4">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        className={`w-16 h-16 object-contain border-2 cursor-pointer ${
                            index === activeIndex ? "border-blue-500" : "border-transparent"
                        }`}
                        onClick={() => setActiveIndex(index)}
                    />
                ))}         

        </div>
        </div>
            
            
            )}