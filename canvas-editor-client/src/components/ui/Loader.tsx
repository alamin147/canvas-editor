import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const spinnerClass = `${sizeClasses[size]} inline-block rounded-full border-solid border-blue-600 border-t-transparent animate-spin`;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
        <div className={spinnerClass}></div>
        {text && <p className="mt-4 text-gray-700 font-medium">{text}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={spinnerClass}></div>
      {text && <p className="mt-2 text-gray-600 font-medium">{text}</p>}
    </div>
  );
};

export default Loader;
