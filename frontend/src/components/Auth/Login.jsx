import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify'
import { Button, FormInput } from '../Forms/Common/common';
import api from '../../constants/API/axiosInstance';



const Login = () => {
  const navigate = useNavigate();

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
      const { data, status } = await api.post(
        "/users/login",
        formData
      );


      
      if (status === 200) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userType", data.role);
        localStorage.setItem("userEmail", data.email);
        
        toast.success("Login successful!");
        reset();
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(
        "Login Error:",
        error?.response?.data?.error || error.message
      );
      toast.error(
        error?.response?.data?.error || "Login failed. Please try again."
      );
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-pass")
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-500 to-gray-950 flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md animate-fadeInUp">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-500 via-black to-indigo-600 text-white px-8 py-10 text-center">
          <h1 className="text-3xl font-semibold mb-2">Welcome Back</h1>
          <p className="text-blue-100 text-base"> Sign in to continue to your account </p>
        </div>
        {/* Form */}
        <div className="p-8">
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
              type="password"
              placeholder="Enter your password"
              register={register}
              errors={errors}
              validation={{
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" }
              }} />
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              onClick={handleSubmit(onSubmit)} >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
            {/* Forgot Password */}
            <div className="text-center">
              <Button variant="link" onClick={handleForgotPassword} > Forgot your password? </Button>
            </div>
            {/* Signup Link */}
            {/* <div className="pt-6 border-t border-gray-200 text-center text-sm text-gray-600"> Don't have an account?{' '}
              <Button variant="link" onClick={handleSignup} className="inline" > Sign up here </Button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;