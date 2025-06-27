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
        <h1 className="text-4xl font-bold text-[#6F6F6F] mb-8">My Account</h1>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <Link
            to="/my-account/profile"
            className={`px-6 py-3 text-center cursor-pointer relative transition-all ${
              isActive('/my-account/profile') 
                ? 'text-[#B20000] font-medium' 
                : 'text-[#6F6F6F] hover:text-[#B20000]'
            }`}
          >
            Profile
            {isActive('/my-account/profile') && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B20000]"></div>
            )}
          </Link>

          <Link
            to="/my-account/teams"
            className={`px-6 py-3 text-center cursor-pointer relative transition-all ${
              isActive('/my-account/teams') 
                ? 'text-[#B20000] font-medium' 
                : 'text-[#6F6F6F] hover:text-[#B20000]'
            }`}
          >
            My Teams
            {isActive('/my-account/teams') && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B20000]"></div>
            )}
          </Link>

          {userProfile?.is_admin && (
            <>
              <Link
                to="/my-account/leagues"
                className={`px-6 py-3 text-center cursor-pointer relative transition-all ${
                  isActive('/my-account/leagues') 
                    ? 'text-[#B20000] font-medium' 
                    : 'text-[#6F6F6F] hover:text-[#B20000]'
                }`}
              >
                Manage Leagues
                {isActive('/my-account/leagues') && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B20000]"></div>
                )}
              </Link>

              <Link
                to="/my-account/schools"
                className={`px-6 py-3 text-center cursor-pointer relative transition-all ${
                  isActive('/my-account/schools') 
                    ? 'text-[#B20000] font-medium' 
                    : 'text-[#6F6F6F] hover:text-[#B20000]'
                }`}
              >
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