import { ReactNode } from "react";

interface HeroBannerProps {
  image: string;
  imageAlt: string;
  containerClassName?: string;
  children: ReactNode;
}

export function HeroBanner({ image, imageAlt, containerClassName = "h-[604px]", children }: HeroBannerProps) {
  return (
    <div className={`relative w-full ${containerClassName}`}>
      <img
        className="w-full h-full object-cover"
        alt={imageAlt}
        src={image}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}