import { ReactNode } from "react";

interface HeroBannerProps {
  image: string;
  imageAlt: string;
  height?: string;
  children: ReactNode;
}

export function HeroBanner({ image, imageAlt, height = "604px", children }: HeroBannerProps) {
  return (
    <div className="relative w-full" style={{ height }}>
      <img
        className="w-full h-full object-cover"
        alt={imageAlt}
        src={image}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}