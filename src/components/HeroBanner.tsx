import { ReactNode } from "react";

interface HeroBannerProps {
  image: string;
  imageAlt: string;
  height?: string;
  children: ReactNode;
}

export function HeroBanner({ image, imageAlt, height = "604px", children }: HeroBannerProps) {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[604px]" style={{ height: undefined }}>
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