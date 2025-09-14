
import React from 'react';
import UserProfile from '@/components/Profile/UserProfile';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 sm:py-8 pb-20">
        <UserProfile />
      </div>
    </div>
  );
};

export default Profile;
