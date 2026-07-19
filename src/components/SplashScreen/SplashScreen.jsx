import { useEffect } from "react";

function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center text-white">
      <div className="text-7xl mb-6 animate-bounce">🌍</div>

      <h1 className="text-6xl font-bold text-blue-500">
        SpotFonder
      </h1>

      <p className="mt-4 text-xl text-gray-300">
        Explore • Plan • Travel
      </p>

      <div className="mt-10 w-64 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full w-full bg-blue-500 animate-pulse"></div>
      </div>
    </div>
  );
}

export default SplashScreen;