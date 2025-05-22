import { Link } from "react-router-dom";

export function AnnouncementBar() {
  return (
    <div className="w-full h-[38px] bg-black">
      <div className="max-w-[1920px] mx-auto h-full flex items-center justify-center">
        <div className="font-normal text-white text-base text-center leading-6">
          <span className="tracking-[0.08px]">
            Summer 2025 leagues registration is now open!&nbsp;&nbsp;
          </span>
          <Link to="/leagues" className="tracking-[var(--m3-body-large-letter-spacing)] leading-[var(--m3-body-large-line-height)] underline font-m3-body-large font-[number:var(--m3-body-large-font-weight)] text-[length:var(--m3-body-large-font-size)]">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}