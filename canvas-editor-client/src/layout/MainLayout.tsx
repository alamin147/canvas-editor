import { Outlet, NavLink } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegFolder } from "react-icons/fa";
import { FiImage } from "react-icons/fi";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import Loader from "@/components/ui/Loader";

const MainLayout = () => {
  const { data, isLoading } = useGetMeQuery(undefined);
  const user = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loader size="lg" text="Loading application..." fullScreen />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg h-16 flex items-center px-6">
        <div className="flex-1 flex items-center">
          <FiImage className="h-8 w-8 text-white mr-2" />
          <h1 className="text-2xl font-bold tracking-tight">Canvas Editor</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-white/25 flex items-center justify-center">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </header>

      {/* Main content with sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="bg-white w-64 shadow-lg flex flex-col border-r border-gray-200">
          <nav className="p-4 flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 pl-2">
              Main Menu
            </p>
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-blue-600 bg-blue-50 font-medium"
                >
                  <IoHomeOutline size={18} className="-mt-1" />
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/projects"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FaRegFolder size={18} className="-mt-0.5" />
                  Projects
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <span className="font-medium text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content - This is where the Outlet will render nested routes */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
