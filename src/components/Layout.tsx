import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { AnnouncementBar } from "./AnnouncementBar";

export function Layout() {
  return (
    <div className="bg-white w-full">
      <AnnouncementBar />
      <Header />
      <Outlet />
    </div>
  );
}