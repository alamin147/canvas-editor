import { Outlet, Link } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5";
import {FaPlus} from "react-icons/fa";
import { PiGearBold } from "react-icons/pi";
import { FaRegFolder } from "react-icons/fa";
import { FiImage } from "react-icons/fi";
const MainLayout = () => {
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
            A
            </div>
          </div>
        </div>
      </header>

      {/* Main content with sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="bg-white w-64 shadow-lg flex flex-col border-r border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 px-4 rounded-lg shadow-md">
             <FaPlus className="h-3 w-3" />
              New Canvas
            </button>
          </div>
          <nav className="p-4 flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 pl-2">Main Menu</p>
            <ul className="space-y-1">
              <li>
                <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-blue-600 bg-blue-50 font-medium">
                    <IoHomeOutline size={18} className='-mt-1' />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/canvas" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    <FiImage size={18} className='-mt-0.5' />
                  Canvas
                </Link>
              </li>
              <li>
                <Link to="/projects" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    <FaRegFolder size={18} className='-mt-0.5' />
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    <PiGearBold size={19} className='-mt-0.5' />
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <span className="font-medium text-sm">AL</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Alamin</p>
                <p className="text-xs text-gray-500">Pro Account</p>
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
