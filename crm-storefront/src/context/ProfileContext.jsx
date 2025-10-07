import React, { createContext, useContext, useEffect, useState } from 'react';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('Manikant');

  // Load profile data from localStorage on mount
  useEffect(() => {
    const savedProfileImage = localStorage.getItem('profileImage');
    const savedUserName = localStorage.getItem('userName');
    
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
    
    if (savedUserName) {
      setUserName(savedUserName);
    }
  }, []);

  // Save profile image to localStorage
  const updateProfileImage = (imageUrl) => {
    setProfileImage(imageUrl);
    localStorage.setItem('profileImage', imageUrl);
  };

  // Save user name to localStorage
  const updateUserName = (name) => {
    setUserName(name);
    localStorage.setItem('userName', name);
  };

  // Clear profile data (for logout)
  const clearProfile = () => {
    setProfileImage(null);
    setUserName('Manikant');
    localStorage.removeItem('profileImage');
    localStorage.removeItem('userName');
  };

  const value = {
    profileImage,
    userName,
    updateProfileImage,
    updateUserName,
    clearProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
