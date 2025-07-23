import React, { useEffect, useState, useMemo } from 'react';
import { Users, Wifi, Moon, Sun, BellRing, Settings, LogOut, MessageSquare } from 'lucide-react'; // Added more icons
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthstore';
import SidebarSkeleton from './skeletons/SidebarSkeleton'; 
import {Link} from 'react-router-dom'; // Import Link for navigation 

function Sidebar() {
  const { getUsers, users, selectedUser, setSelectedUser, isUserLoading } = useChatStore();
  const { onlineUsers, authUser, logout } = useAuthStore(); // Added authUser and logout

  // State for UI enhancements
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // For desktop collapse
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // For mobile drawer
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  // Assuming you have a theme state in a global store or context
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
  // const { theme, toggleTheme, notificationSound, toggleNotificationSound } = useSettingsStore(); 

  useEffect(() => {
    getUsers();
    // Listener for window resize to control isSidebarCollapsed and isMobile
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 1024); // Collapse on screens smaller than lg
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMobileSidebarOpen(false); // Close mobile sidebar on desktop
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially
    return () => window.removeEventListener('resize', handleResize);
  }, [getUsers]);

  // Memoize filtered and sorted users for performance
  const filteredAndSortedUsers = useMemo(() => {
    let currentUsers = users;

    // 1. Filter by online status
    if (showOnlineOnly) {
      currentUsers = currentUsers.filter(user => onlineUsers.includes(user._id));
    }

    // 2. Filter by search term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentUsers = currentUsers.filter(user =>
        user.fullName.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.username.toLowerCase().includes(lowerCaseSearchTerm) // Assuming username exists
      );
    }

    // 3. Sort: online users first, then alphabetically
    return [...currentUsers].sort((a, b) => {
      const aIsOnline = onlineUsers.includes(a._id);
      const bIsOnline = onlineUsers.includes(b._id);

      if (aIsOnline && !bIsOnline) return -1;
      if (!aIsOnline && bIsOnline) return 1;

      return a.fullName.localeCompare(b.fullName);
    });
  }, [users, onlineUsers, showOnlineOnly, searchTerm]);


  if (isUserLoading) {
    return <SidebarSkeleton />;
  }

  // --- Dynamic Styling based on theme ---
  const themeClasses = theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800';
  const borderClasses = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const hoverBgClasses = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
  const activeBgClasses = theme === 'dark' ? 'bg-gray-800 ring-gray-600' : 'bg-gray-100 ring-gray-300';
  const textColorClasses = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const onlineDotColor = 'bg-green-500'; // Stays consistent

  // Calculate online users excluding self
  const actualOnlineUsersCount = onlineUsers.filter(id => id !== authUser?._id).length;


  return (
    <aside
      className={`
        h-full 
        ${isSidebarCollapsed ? 'w-20' : 'w-full lg:w-72'} 
        ${themeClasses} 
        ${borderClasses} 
        border-r 
        flex flex-col 
        transition-all duration-300 ease-in-out 
        rounded-r-2xl shadow-xl 
        overflow-hidden
      `}
      style={{
        background: theme === 'dark'
          ? 'linear-gradient(to bottom, #1a202c, #2d3748)'
          : 'linear-gradient(to bottom, #f9fafb, #edf2f7)'
      }}
    >
      {/* Header Section */}
      <div className={` pb-3 ${borderClasses} border-b flex items-center justify-between`}>
        {!isSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(true)}
            className="btn btn-ghost btn-circle btn-sm lg:hidden text-gray-400 hover:text-gray-200"
            aria-label="Collapse sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
        )}
        {isSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="btn btn-ghost btn-circle btn-sm hidden lg:block text-gray-400 hover:text-gray-200"
            aria-label="Expand sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        )}
      </div>

      {/* Search and Filters Section */}
      {!isSidebarCollapsed && (
        <div className={`p-5 pt-3 ${borderClasses} border-b`}>
          <input
            type="text"
            placeholder="Search contacts..."
            className={`input input-bordered w-full rounded-lg input-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-700 placeholder-gray-400'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="mt-3 flex items-center justify-between">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className={`checkbox checkbox-sm ${theme === 'dark' ? 'checkbox-primary' : 'checkbox-accent'}`}
              />
              <span className={`text-sm font-medium ${textColorClasses}`}>Show online only</span>
            </label>
            <div className="flex items-center gap-1">
              <span className={`text-xs ${textColorClasses}`}>
                ({actualOnlineUsersCount} online)
              </span>
              <Wifi className={`size-4 ${actualOnlineUsersCount > 0 ? 'text-green-400' : 'text-gray-500'}`} />
            </div>
          </div>
        </div>
      )}
      {isSidebarCollapsed && (
        <div className="p-3 text-center">
          <button
            className={`btn btn-ghost btn-sm btn-circle tooltip tooltip-right ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}
            onClick={() => setShowOnlineOnly(!showOnlineOnly)}
          >
            <Wifi className={`size-5 ${showOnlineOnly ? 'text-green-400' : 'text-gray-500'}`} />
          </button>
        </div>
      )}


      {/* User List */}
      <div className="flex-1 overflow-y-auto w-full py-3 scrollbar-hide"> {/* scrollbar-hide from custom CSS */}
        {filteredAndSortedUsers.length > 0 ? (
          filteredAndSortedUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3 relative
                ${hoverBgClasses} transition-all duration-200 ease-in-out
                ${selectedUser?._id === user._id ? activeBgClasses : ''}
                group focus:outline-none focus:ring-2 focus:ring-offset-2 
                ${theme === 'dark' ? 'focus:ring-offset-gray-900 focus:ring-indigo-500' : 'focus:ring-offset-white focus:ring-indigo-400'}
                rounded-lg mx-auto mb-1 transform transition-transform duration-150
                ${isSidebarCollapsed ? 'justify-center w-16' : 'px-5'}
              `}
              style={!isSidebarCollapsed ? { transform: 'translateX(0)' } : {}} // Reset transform if not collapsed
              onMouseEnter={(e) => {
                if (isSidebarCollapsed) {
                  e.currentTarget.style.transform = 'scale(1.1)'; // Slight hover effect when collapsed
                }
              }}
              onMouseLeave={(e) => {
                if (isSidebarCollapsed) {
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {/* Avatar and Online Status */}
              <div className={`relative ${isSidebarCollapsed ? 'mx-auto' : ''}`}>
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full shadow-md transform group-hover:scale-105 transition-transform duration-200"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className={`absolute bottom-0 right-0 size-3 ${onlineDotColor} 
                    rounded-full ring-2 ${theme === 'dark' ? 'ring-gray-900' : 'ring-white'} animate-pulse`}
                  />
                )}
              </div>

              {/* User info - only visible when not collapsed */}
              {!isSidebarCollapsed && (
                <div className="text-left flex-1 min-w-0">
                  <div className="font-semibold truncate text-lg">
                    {user.fullName}
                  </div>
                  <div className={`text-sm ${onlineUsers.includes(user._id) ? 'text-green-400' : textColorClasses}`}>
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              )}
            </button>
          ))
        ) : (
          <div className={`text-center py-4 ${textColorClasses} text-sm transition-opacity duration-300`}>
            {searchTerm ? "No contacts found." : "No online users."}
          </div>
        )}
      </div>

      {/* Footer Section: User Profile, Settings, Logout */}
      <div className={`p-4 ${borderClasses} border-t flex flex-col gap-2`}>
        {authUser && (
          <button
            className={`
              w-full p-2 flex items-center gap-3
              ${hoverBgClasses} transition-colors duration-200
              rounded-lg
              ${isSidebarCollapsed ? 'justify-center' : ''}
            `}
          >
            <div className="relative">
              <img
                src={authUser.profilePic || "/avatar.png"}
                alt={authUser.fullName}
                className="size-10 object-cover rounded-full border-2 border-indigo-500"
              />
              {onlineUsers.includes(authUser._id) && (
                <span
                  className={`absolute bottom-0 right-0 size-2.5 ${onlineDotColor} 
                  rounded-full ring-1.5 ${theme === 'dark' ? 'ring-gray-900' : 'ring-white'}`}
                />
              )}
            </div>
            {!isSidebarCollapsed && (
              <Link to={"/profile"} className="flex-1 text-left min-w-0">
              <div className="flex-1 text-left min-w-0">
                <div className="font-medium truncate text-base">{authUser.fullName}</div>
                <div className={`text-xs ${textColorClasses}`}>My Profile</div>
              </div>
              </Link>
            )}
          </button>
        )}

        <div className={`flex ${isSidebarCollapsed ? 'flex-col items-center gap-1' : 'justify-around items-center'}`}>
          <button
            className={`btn btn-ghost btn-circle tooltip ${isSidebarCollapsed ? 'tooltip-right' : ''} ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} // Replace with actual toggleTheme
          >
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button> 
          <Link to={"/settings"}>   
          <button
            className={`btn btn-ghost btn-circle tooltip ${isSidebarCollapsed ? 'tooltip-right' : ''} ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}
          >
            <Settings className="size-5" />
          </button>
          </Link> 
          <button
            className={`btn btn-ghost btn-circle tooltip ${isSidebarCollapsed ? 'tooltip-right' : ''} ${theme === 'dark' ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-gray-200'}`}
            data-tip="Logout"
            onClick={logout}
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

