function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 text-white py-10">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-bold text-blue-500">
          🌍 SpotFonder
        </h2>

        <p className="mt-4 text-gray-400">
          AI Powered Smart Travel Planner
        </p>

        <div className="flex justify-center gap-8 mt-8 text-gray-300">

          <a href="#">Home</a>

          <a href="#">About</a>

          <a href="#">Contact</a>

          <a href="#">Privacy</a>

        </div>

        <p className="mt-10 text-gray-500">
          © 2026 SpotFonder. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;