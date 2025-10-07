import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderHistory from '../components/OrderHistory';
import { useCart } from '../context/CartContext';
import { useProfile } from '../context/ProfileContext';

const MyAccount = () => {
  const navigate = useNavigate();
  const { cartItemCount } = useCart();
  const { profileImage, userName, updateProfileImage, updateUserName } = useProfile();
  const [user, setUser] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempUserName, setTempUserName] = useState(userName);
  const [tempProfileImage, setTempProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(profileImage);
  const [imageInputType, setImageInputType] = useState('upload'); // 'upload' or 'url'
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Sync tempUserName when userName changes
  useEffect(() => {
    setTempUserName(userName);
  }, [userName]);

  // Sync imagePreview when profileImage changes
  useEffect(() => {
    setImagePreview(profileImage);
  }, [profileImage]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNameEdit = () => {
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    setIsEditingName(false);
    updateUserName(tempUserName);
    console.log('Saving name:', tempUserName);
  };

  const handleNameCancel = () => {
    setTempUserName(userName); // Reset to original
    setIsEditingName(false);
  };

  const handleImageInputTypeChange = (type) => {
    setImageInputType(type);
    if (type === 'upload') {
      setImageUrl('');
      setImagePreview(null);
    } else {
      setTempProfileImage(null);
      setImagePreview(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImagePreview(e.target.value);
  };

  const handleImageSave = async () => {
    try {
      if (imageInputType === 'upload' && tempProfileImage) {
        // Handle file upload
        const formData = new FormData();
        formData.append('profileImage', tempProfileImage);
        
        // Here you would typically send to backend
        console.log('Uploading profile image:', tempProfileImage);
        console.log('FormData:', formData);
        
        // Update the profile image in context (this will persist)
        const imageUrl = URL.createObjectURL(tempProfileImage);
        updateProfileImage(imageUrl);
        setImagePreview(imageUrl);
      } else if (imageInputType === 'url' && imageUrl) {
        // Handle URL
        console.log('Setting profile image URL:', imageUrl);
        updateProfileImage(imageUrl);
        setImagePreview(imageUrl);
      }
      
      // Reset form
      setTempProfileImage(null);
      setImageUrl('');
      setImageInputType('upload');
    } catch (error) {
      console.error('Error saving profile image:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 text-gray-600 hover:text-blue-600"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        </div>

        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-full h-full flex items-center justify-center ${imagePreview ? 'hidden' : 'flex'}`}>
                <span className="text-white text-3xl font-bold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            
            {/* Image Upload Button */}
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          {/* Name with Edit Functionality */}
          <div className="mb-4">
            {isEditingName ? (
              <div className="flex items-center justify-center space-x-2">
                <input
                  type="text"
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                  className="text-2xl font-semibold text-gray-900 text-center border-b-2 border-blue-500 focus:outline-none focus:border-blue-600"
                  autoFocus
                />
                <button
                  onClick={handleNameSave}
                  className="text-green-600 hover:text-green-700 p-1"
                  title="Save"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={handleNameCancel}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Cancel"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <h2 className="text-2xl font-semibold text-gray-900">{userName}</h2>
                <button
                  onClick={handleNameEdit}
                  className="text-blue-600 hover:text-blue-700 p-1"
                  title="Edit name"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          <p className="text-gray-600">{user.email}</p>
        </div>

        {/* Profile Image Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Image</h3>
          
          {/* Image Input Type Selection */}
          <div className="flex space-x-4 mb-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="imageInputType"
                value="upload"
                checked={imageInputType === 'upload'}
                onChange={() => handleImageInputTypeChange('upload')}
                className="mr-2"
              />
              <span className="text-gray-700">Upload Image</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="imageInputType"
                value="url"
                checked={imageInputType === 'url'}
                onChange={() => handleImageInputTypeChange('url')}
                className="mr-2"
              />
              <span className="text-gray-700">Image URL</span>
            </label>
          </div>

          {/* Upload Image Input */}
          {imageInputType === 'upload' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </p>
            </div>
          )}

          {/* Image URL Input */}
          {imageInputType === 'url' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={handleImageUrlChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Save Button */}
          {(tempProfileImage || imageUrl) && (
            <button
              onClick={handleImageSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Image
            </button>
          )}
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Shipping Addresses Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Shipping Addresses</h3>
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Home Address</p>
                <p className="text-gray-600">123 Maple Street, Anytown, CA 91234</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-blue-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Work Address</p>
                <p className="text-gray-600">456 Oak Avenue, Anytown, CA 91234</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-blue-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>
          <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors">
            Add New Address
          </button>
        </div>

        {/* Payment Methods Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Payment Methods</h3>
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Visa</p>
                <p className="text-gray-600">Ending in 1234</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-blue-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">MasterCard</p>
                <p className="text-gray-600">Ending in 5678</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-blue-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>
          <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors">
            Add New Payment Method
          </button>
        </div>

        {/* Order History Section */}
        <OrderHistory />

        {/* Account Settings Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h3>
          <div className="space-y-4 mb-6">
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-gray-900">Manage Login Credentials</span>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-gray-900">Communication Preferences</span>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-gray-900">Privacy Settings</span>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium">
            Save Changes
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-semibold mb-4">ABOUT</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">ShopOnline Stories</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Press</a></li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h3 className="text-lg font-semibold mb-4">HELP</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Payments</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Shipping</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Cancellation & Returns</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">FAQ</a></li>
              </ul>
            </div>

            {/* Consumer Policy */}
            <div>
              <h3 className="text-xl font-semibold mb-4">CONSUMER POLICY</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Terms of Use</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Security</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Sitemap</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Grievance Redressal</a></li>
              </ul>
            </div>

            {/* Let Us Help You */}
            <div>
              <h3 className="text-lg font-semibold mb-4">LET US HELP YOU</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Your Account</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Return Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">ShopOnline App Download</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">100% Purchase Protection</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Recalls and Product Safety Alert</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">©2025 ShopOnline. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MyAccount;
