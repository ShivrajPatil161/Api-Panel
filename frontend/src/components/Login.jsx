import React, { useState } from 'react';

export default function Login() {
  const [userType, setUserType] = useState('franchise');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      alert(`Welcome! Logging in as ${userType.charAt(0).toUpperCase() + userType.slice(1)} user: ${formData.email}`);
      setIsLoading(false);
      setFormData({ email: '', password: '' });
    }, 1500);
  };

  const handleForgotPassword = () => {
    const email = prompt('Enter your email address to reset password:');
    if (email) {
      alert(`Password reset link sent to ${email}`);
    }
  };

  const handleSignup = () => {
    alert(`Redirecting to ${userType} registration page...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md animate-fadeInUp">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 text-white px-8 py-10 text-center">
          <h1 className="text-3xl font-semibold mb-2">Welcome Back</h1>
          <p className="text-blue-100 text-base">
            {userType === 'franchise' 
              ? 'Access your franchise dashboard' 
              : 'Access your merchant portal'
            }
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          {/* User Type Selector */}
          <div className="flex gap-3 mb-8">
            <button
              type="button"
              onClick={() => setUserType('franchise')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 border-2 ${
                userType === 'franchise'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              🏢 Franchise
            </button>
            <button
              type="button"
              onClick={() => setUserType('merchant')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 border-2 ${
                userType === 'merchant'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              🏪 Merchant
            </button>
          </div>

          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-4 bg-blue-50 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-4 bg-blue-50 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-base rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Forgot Password */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-blue-500 text-sm font-medium hover:underline transition-all duration-300"
              >
                Forgot your password?
              </button>
            </div>

            {/* Signup Link */}
            <div className="pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={handleSignup}
                className="text-blue-500 font-medium hover:underline transition-all duration-300"
              >
                Sign up here
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}