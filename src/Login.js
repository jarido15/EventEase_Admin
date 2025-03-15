import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  const handleLogin = (e) => {
    e.preventDefault();

    // Static credentials
    const staticEmail = "admin";
    const staticPassword = "password123";

    if (email === staticEmail && password === staticPassword) {
      setError("");
      setShowModal(true); // Show the modal on success

      // Persist login state in localStorage
      localStorage.setItem("isLoggedIn", "true");
    } else {
      setError("❌ Invalid email or password.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/dashboard"); // Redirect after closing modal
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md mx-auto backdrop-blur-md bg-opacity-90">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Welcome Back</h2>
        <p className="text-gray-500 text-center mb-8">Sign in to continue</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-600 font-medium">Username</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-300 ease-in-out"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle password visibility
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-300 ease-in-out"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
      </div>

      {/* Modal for Login Success */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-60 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold text-green-600 text-center">✅ Login Successful!</h3>
            <p className="text-gray-700 text-center mt-3">Welcome to your Dashboard!</p>
            <button
              onClick={closeModal}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
