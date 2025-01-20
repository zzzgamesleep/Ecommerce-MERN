const LoadingSpinner = () => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-blue-200 rounded-full"></div>
          <div className="w-20 h-20 border-t-2 border-blue-500 animate-spin rounded-full absolute top-0 left-0"></div>
          <div className="sr-only">Loading</div>
        </div>
      </div>
    );
  };
  
  export default LoadingSpinner;
  