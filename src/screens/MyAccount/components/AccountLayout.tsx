import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

export function AccountLayout() {
  const location = useLocation();
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B20000]"></div>
      </div>
    );
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#6F6F6F] mb-2">
            Welcome back, {userProfile?.name || 'User'}!
          </h1>
          <p className="text-lg text-[#6F6F6F]">
            Manage your teams, schedules, and account settings
          </p>
        </div>

        {/* Navigation Tabs with Icons */}
        <div className="flex border-b border-gray-200 mb-8">
          <Link
            to="/my-account/teams"
            className={`flex items-center gap-2 px-6 py-3 text-center cursor-pointer relative transition-all ${
              isActive('/my-account/teams') 
                ? 'text-[#B20000] font-medium' 
                : 'text-[#6F6F6F] hover:text-[#B20000]'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            My Teams
            {isActive('/my-account/teams') && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B20000]"></div>
            )}
          </Link>

          <Link
            to="/my-account/profile"
            className={`flex items-center gap-2 px-6 py-3 text-center cursor-pointer relative transition-all ${
              isActive('/my-account/profile') 
                ? 'text-[#B20000] font-medium' 
                : 'text-[#6F6F6F] hover:text-[#B20000]'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
            </svg>
            Account Settings
            {isActive('/my-account/profile') && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B20000]"></div>
            )}
          </Link>

          {userProfile?.is_admin && (
            <>
              <Link
                to="/my-account/leagues"
                className={`flex items-center gap-2 px-6 py-3 text-center cursor-pointer relative transition-all ${
                  isActive('/my-account/leagues') 
                    ? 'text-[#B20000] font-medium' 
                    : 'text-[#6F6F6F] hover:text-[#B20000]'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                </svg>
                Manage Leagues
                {isActive('/my-account/leagues') && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B20000]"></div>
                )}
              </Link>

              <Link
                to="/my-account/schools"
                className={`flex items-center gap-2 px-6 py-3 text-center cursor-pointer relative transition-all ${
                  isActive('/my-account/schools') 
                    ? 'text-[#B20000] font-medium' 
                    : 'text-[#6F6F6F] hover:text-[#B20000]'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/>
                </svg>
                Manage Schools
                {isActive('/my-account/schools') && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B20000]"></div>
                )}
              </Link>
            </>
          )}
        </div>

        {/* Tab Content */}
        <Outlet />
      </div>
    </div>
  );
}