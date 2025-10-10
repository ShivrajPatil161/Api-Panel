import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  User,
  LogOut,
  ChevronDown,
  Settings,
  HelpCircle,
  Wallet,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import api from '../../constants/API/axiosInstance';
import logoImage from '../../assets/SD-2.jpg';
import { toast } from 'react-toastify';

const Header = ({ userType }) => {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const userEmail = localStorage.getItem("userEmail") || "";

  // Custom validation function
  const validatePasswordData = (data) => {
    const errors = {};

    // Current password validation
    if (!data.currentPassword || data.currentPassword.trim() === '') {
      errors.currentPassword = 'Current password is required';
    }

    // New password validation
    if (!data.newPassword || data.newPassword.trim() === '') {
      errors.newPassword = 'New password is required';
    } else {
      if (data.newPassword.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters';
      } else if (!/[A-Z]/.test(data.newPassword)) {
        errors.newPassword = 'Password must contain at least one uppercase letter';
      } else if (!/[0-9]/.test(data.newPassword)) {
        errors.newPassword = 'Password must contain at least one number';
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.newPassword)) {
        errors.newPassword = 'Password must contain at least one special character';
      }
    }

    // Confirm password validation
    if (!data.confirmPassword || data.confirmPassword.trim() === '') {
      errors.confirmPassword = 'Please confirm your password';
    } else if (data.newPassword !== data.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }

    // Check if new password is same as current
    if (data.currentPassword && data.newPassword && 
        data.currentPassword === data.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    return errors;
  };

  // Fetch profile dynamically
  const fetchProfile = async () => {
    try {
      if (userType === 'franchise') {
        const res = await api.get('/franchise/profile', {
          params: {
            email: userEmail
          }
        }); 
        setProfileData({
          name: res.data.franchiseName,
          email: res.data.contactPersonEmail,
          walletBalance: res.data.walletBalance,
          initials: res.data.franchiseName
            ? res.data.franchiseName.substring(0, 2).toUpperCase()
            : 'FR'
        });
        localStorage.setItem("customerId",res?.data?.id)
      } else if (userType === 'merchant') {
        const res = await api.get('/merchants/profile', {
          params: {
          email: userEmail
        }
      });
        setProfileData({
          name: res.data.businessName,
          email: res.data.contactPersonEmail,
          walletBalance: res.data.walletBalance,
          initials: res.data.businessName
            ? res.data.businessName.substring(0, 2).toUpperCase()
            : 'ME'
        });
        localStorage.setItem("customerId", res?.data?.id)
        // if merchant belongs to franchise, also store it for conditional rendering
        if (res.data.franchiseId) {
          localStorage.setItem("franchiseId", res.data.franchiseId);
        }
      } else {
        // Admin → no API call
        setProfileData({
          name: 'Admin User',
          email: userEmail,
          initials: 'AD'
        });
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userType]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('customerId');
    localStorage.clear();

    // Force full page reload to reset router and all state
    window.location.href = '/login';
  };

  const handleOpenPasswordModal = () => {
    setShowUserMenu(false);
    setShowPasswordModal(true);
    setPasswordError('');
    setPasswordSuccess('');
    setValidationErrors({});
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setPasswordSuccess('');
    setValidationErrors({});
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError('');
    // Clear validation error for this field
    setValidationErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setValidationErrors({});

    // Validate password data
    const errors = validatePasswordData(passwordData);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/users/change-password', {
        email: userEmail,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setPasswordSuccess('Password changed successfully!');
      setTimeout(() => {
        handleClosePasswordModal();
      }, 2000);
    } catch (error) {
      if (error.response) {
        setPasswordError(error.response.data.error || 'Failed to change password');
      } else {
        setPasswordError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Route → title mapping
  const getPageTitle = () => {
    const path = location.pathname;
    const routeTitles = {
      '/dashboard': 'Dashboard',
      '/dashboard/vendors': 'Vendor List',
      '/dashboard/vendors/add': 'Add Vendor',
      '/dashboard/vendors/rates': 'Vendor Rates',
      '/dashboard/inventory': 'Product List',
      '/dashboard/inventory/inventory': 'Inventory',
      '/dashboard/inventory/pricing': 'Product Pricing',
      '/dashboard/inventory/returns': 'Returns',
      '/dashboard/customers': 'Customer List',
      '/dashboard/customers/onboard': 'Customer Onboarding',
      '/dashboard/customers/admin-approval': 'Merchant Approval',
      '/dashboard/customers/assign-products': 'Product Assignment',
      '/dashboard/others/upload': 'File Upload',
      '/dashboard/others/charges': 'Charge Calculation',
      '/dashboard/reports': 'Reports',
      '/dashboard/payout': 'Payout',
      '/dashboard/credit-card-bill-payment': 'Credit Card'
    };
    return routeTitles[path] || 'Supply Chain Management';
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    if (segments.length <= 1) return null;

    const breadcrumbMap = {
      dashboard: 'Dashboard',
      vendors: 'Vendors',
      products: 'Products',
      inventory: 'Inventory',
      customers: 'Customers',
      transactions: 'Transactions',
      reports: 'Reports',
      add: 'Add',
      rates: 'Rates',
      pricing: 'Pricing',
      inward: 'Inward',
      outward: 'Outward',
      returns: 'Returns',
      onboard: 'Onboard',
      'assign-products': 'Assign Products',
      'admin-approval': 'Approval',
      upload: 'Upload',
      charges: 'Charges'
    };

    return segments.map(seg => breadcrumbMap[seg] || seg).join(' > ');
  };

  return (
    <>
      <header className="ml-15 bg-gray-200 shadow-sm border-b border-gray-200 sticky top-0 z-10">
        
        <div className="flex items-center justify-between px-6 py-2">
          {/* Left Section */}
         <div className='flex'>
            <img 
                         src={logoImage} 
                         alt="Same Day Solution Logo" 
                         className="w-[55px] max-h-[50px] mx-auto rounded-xl mt-1 p-1 mr-2  bg-gray-500  "
                        />
           <div className="flex flex-col">
            
            <h1 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h1>
            {getBreadcrumb() && (
              <nav className="text-sm text-gray-500 mt-1">{getBreadcrumb()}</nav>
            )}
          </div>
         </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Wallet only for merchant/franchise */}
            {(userType === 'merchant' || userType === 'franchise') &&
              profileData?.walletBalance !== undefined && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  <Wallet className="h-5 w-5 text-gray-600" />
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Wallet Balance</p>
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{profileData.walletBalance?.toLocaleString() ?? '0'}
                    </p>
                  </div>
                </div>
              )}

            {/* User dropdown */}
            {profileData && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500  to-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {profileData.initials}
                    </span>
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-semibold text-gray-900">
                      {profileData.name}
                    </p>
                    <p className="text-xs text-gray-500">{profileData.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">
                        {profileData.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {profileData.email}
                      </p>
                    </div>
                    <div className="py-2">
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <User className="h-4 w-4 mr-3" /> Profile Settings
                      </button>
                      <button 
                        onClick={handleOpenPasswordModal}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-3" /> Change Password
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <HelpCircle className="h-4 w-4 mr-3" /> Help & Support
                      </button>
                    </div>
                    <div className="border-t border-gray-200 py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-3" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {showUserMenu && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowUserMenu(false)}
          ></div>
        )}
      </header>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
              <button
                onClick={handleClosePasswordModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handlePasswordSubmit} className="px-6 py-4">
              {/* Current Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                      validationErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {validationErrors.currentPassword && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                      validationErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {validationErrors.newPassword && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.newPassword}</p>
                )}
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-600">Password must contain:</p>
                  <ul className="text-xs text-gray-600 list-disc list-inside space-y-0.5">
                    <li className={passwordData.newPassword.length >= 8 ? 'text-green-600' : ''}>
                      At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(passwordData.newPassword) ? 'text-green-600' : ''}>
                      At least one uppercase letter
                    </li>
                    <li className={/[0-9]/.test(passwordData.newPassword) ? 'text-green-600' : ''}>
                      At least one number
                    </li>
                    <li className={/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? 'text-green-600' : ''}>
                      At least one special character
                    </li>
                  </ul>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                      validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.confirmPassword}</p>
                )}
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{passwordError}</p>
                </div>
              )}

              {/* Success Message */}
              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">{passwordSuccess}</p>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClosePasswordModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;