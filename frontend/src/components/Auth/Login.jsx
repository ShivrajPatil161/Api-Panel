import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify'
import { Button, FormInput } from '../Forms/Common/common';
import api from '../../constants/API/axiosInstance';
import { Eye, EyeOff } from 'lucide-react';
import logoImage from '../../assets/SD.jpg';



const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (formData) => {
    try {
      const { data, status } = await api.post("/users/login", formData);

      if (status === 200) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userType", data.role);
        localStorage.setItem("userEmail", data.email);

        if (data.role === "ADMIN" || data.role === "SUPER_ADMIN") {
          // save permissions only for admins
          localStorage.setItem("permissions", JSON.stringify(data.permissions));
        } else {
          localStorage.removeItem("permissions"); // cleanup
        }

        toast.success("Login successful!");
        reset();
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error?.response?.data?.error || error.message);
      toast.error(error?.response?.data?.error || "Login failed. Please try again.");
    }

  };

  const handleForgotPassword = () => {
    navigate("/forgot-pass")
  };

  // Handle Enter key press
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !isSubmitting) {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-500 to-gray-950 flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl flex animate-fadeInUp">
        
        {/* Left Side - Logo Section */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-r from-[#141921] to-[#303a47] items-center justify-center p-12">
          <div className="text-center">
            <img 
              src={logoImage} 
              alt="Same Day Solution Logo" 
              className="w-fit max-w-xs mx-auto mix-blend-lighten  "
            />
            {/* You can add additional text or branding here if needed */}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-500 via-black to-indigo-600 text-white px-8 py-10 text-center">
            <h1 className="text-3xl font-semibold mb-2">Welcome Back</h1>
            <p className="text-blue-100 text-base"> Sign in to continue to your account </p>
          </div>
          
          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} onKeyPress={handleKeyPress}>
              <div className="space-y-6">
                {/* Email Field */}
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  register={register}
                  errors={errors}
                  validation={{
                    required: "Email is required",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" }
                  }} />
                
                {/* Password Field */}
                <FormInput
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  register={register}
                  errors={errors}
                  validation={{
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  }}
                  rightIcon={ 
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  }/>
                
                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="primary">
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>
                
                {/* Forgot Password */}
                <div className="text-center">
                  <Button variant="link" onClick={handleForgotPassword} > Forgot your password? </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;