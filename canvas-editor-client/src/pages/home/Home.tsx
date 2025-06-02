import { FiImage } from "react-icons/fi";
import { IoBookOutline } from "react-icons/io5";
import { HiPencil } from "react-icons/hi2";
import { IoIosCloudy } from "react-icons/io";
import { FaArrowRightLong } from "react-icons/fa6";

const Home = () => {

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
        <p className="text-gray-600 mt-1">
          Here's an overview of your canvas projects
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">
              Active Projects
            </h3>
            <span className="p-2 bg-blue-50 rounded-lg">
              <IoBookOutline className="h-5 w-5 text-blue-500" />
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-4">12</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Recent Edits</h3>
            <span className="p-2 bg-indigo-50 rounded-lg">
              <HiPencil className="h-4 w-4 text-indigo-500" />
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-4">47</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Storage Used</h3>
            <span className="p-2 bg-purple-50 rounded-lg">
              <IoIosCloudy className="h-4 w-4 text-purple-500" />
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-4">45.2 GB</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-800">Recent Projects</h2>
          <p className="text-gray-500 text-sm">
            Your most recently edited canvas projects
          </p>
        </div>

        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="h-32 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-200 flex items-center justify-center mb-4">
                  <FiImage className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="font-medium text-gray-800">Project {i}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Last edited {i} day{i !== 1 ? "s" : ""} ago
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors">
          <span>View all projects</span>
          <FaArrowRightLong className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Home;
