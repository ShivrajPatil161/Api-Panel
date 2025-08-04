import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

// Reusable Input Component
const FormInput = ({ label, name, type = "text",  placeholder,  register,  errors,  validation}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      id={name}
      placeholder={placeholder}
      {...register(name, validation)}
      className="w-full px-4 py-4 bg-blue-50 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
    />
    {errors[name] && (
      <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
    )}
  </div>
);

// Reusable Button Component
const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  type = "button",
  className = ""
}) => {
  const baseClasses = "font-semibold text-base rounded-xl transition-all duration-300";
  const variants = {
    primary: "w-full py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none",
    link: "text-blue-500 text-sm font-medium hover:underline"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Main Login Component
const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Function to determine userType based on email
  const getUserTypeFromEmail = (email) => {
    const emailLower = email.toLowerCase();
    if (emailLower.includes('admin')) return 'admin';
    if (emailLower.includes('franchise')) return 'franchise';
    if (emailLower.includes('merchant')) return 'merchant';
    return 'merchant'; // default
  };

  const onSubmit = async (data) => {
    try {
      // Determine userType from email
      const userType = getUserTypeFromEmail(data.email);

      // Set auth token and userType in localStorage
      localStorage.setItem('authToken', "dasdcad");
      localStorage.setItem('userType', userType);

      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1500));

      alert(`Welcome! Logging in as ${userType}: ${data.email}`);

      // Reset form and navigate
      reset();
      navigate("/dashboard");

    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    const email = prompt('Enter your email address to reset password:');
    if (email) {
      alert(`Password reset link sent to ${email}`);
    }
  };

  const handleSignup = () => {
    alert('Redirecting to registration page...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-500 to-gray-950 flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md animate-fadeInUp">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-500 via-black to-indigo-600 text-white px-8 py-10 text-center">
          <h1 className="text-3xl font-semibold mb-2">Welcome Back</h1>
          <p className="text-blue-100 text-base">
            Sign in to continue to your account
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Email Field */}
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email (admin/franchise/merchant)"
              register={register}
              errors={errors}
              validation={{
                required: "Email is required",
                // pattern: {
                //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                //   message: "Invalid email address"
                // }
              }}
            />

            {/* Password Field */}
            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              register={register}
              errors={errors}
              // validation={{
              //   required: "Password is required",
              //   minLength: {
              //     value: 6,
              //     message: "Password must be at least 6 characters"
              //   }
              // }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              onClick={handleSubmit(onSubmit)}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Forgot Password */}
            <div className="text-center">
              <Button
                variant="link"
                onClick={handleForgotPassword}
              >
                Forgot your password?
              </Button>
            </div>

            {/* Signup Link */}
            <div className="pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Button
                variant="link"
                onClick={handleSignup}
                className="inline"
              >
                Sign up here
              </Button>
            </div>
          </div>

          {/* User Type Info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              💡 Tip: Include 'admin', 'franchise', or 'merchant' in your email to set user type
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;