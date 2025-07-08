// src/App.js

import React, { useEffect, useState } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { Amplify } from 'aws-amplify';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import awsExports from './aws-exports';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import CollectionScreen from './components/CollectionScreen';
import NewImageModal from './components/NewImageModal';
import ImageDetailModal from './components/ImageDetailModal';
import './styles/animations.css'; // Import the animations

Amplify.configure(awsExports);

const DailyImageCollector = () => {
  const [authUser, setAuthUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isCardNew, setIsCardNew] = useState(false);

  const {
    user,
    login,
    logout: gameLogout,
    currentView,
    setCurrentView,
    userCollection,
    todaysClaim,
    drawDailyImage,
    loading,
    getStreakCount,
    imageDatabase,
    showNewImage,
    setShowNewImage,
    todaysImage,
    shakeAnimation,
    setShakeAnimation,
    selectedImage,
    setSelectedImage,
    isFullscreen,
    setIsFullscreen,
    // New properties for 3 draws per day
    dailyDrawsRemaining,  // How many draws left today (0-3)
    totalDrawsToday,      // How many draws used today (0-3)
    drawsResetTime,       // When draws reset (next midnight)
    canDraw,              // Function to check if user can draw
    getDrawButtonText,    // Function to get dynamic button text
    getTimeUntilReset,    // Function to get time until reset
    MAX_DRAWS_PER_DAY     // Maximum draws per day (3)
  } = useGameLogic();

  // Check authentication state on app load
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const cognitoUser = await getCurrentUser();
      console.log('Authenticated user found:', cognitoUser);
      setAuthUser(cognitoUser);
      
      // Auto-login with Cognito user data
      const username = cognitoUser.username;
      const email = cognitoUser.signInDetails?.loginId || '';
      login(username, email);
    } catch (error) {
      console.log('No authenticated user found');
      setAuthUser(null);
    }
    setIsAuthLoading(false);
  };

  // Check if the current card is new for the user when todaysImage changes
  useEffect(() => {
    if (todaysImage && userCollection) {
      // Extract base ID (part before underscore) from todaysImage
      const todaysBaseId = todaysImage.id.toString().split('_')[0];
      
      // Exclude the last entry (just drawn card) when checking if it's new
      const collectionWithoutLastCard = userCollection.slice(0, -1);
      
      // Check if user had any card with this base ID before drawing this one
      const userHadCard = collectionWithoutLastCard.some(card => {
        const cardBaseId = card.id.toString().split('_')[0];
        return cardBaseId === todaysBaseId;
      });
      
      console.log('=== Card Check Debug ===');
      console.log('todaysImage:', todaysImage);
      console.log('todaysImage full ID:', todaysImage.id);
      console.log('todaysImage base ID:', todaysBaseId);
      console.log('userCollection length:', userCollection.length);
      console.log('collection without last card:', collectionWithoutLastCard.map(card => card.id.toString().split('_')[0]));
      console.log('userHadCard before:', userHadCard);
      console.log('Setting isCardNew to:', !userHadCard);
      console.log('dailyDrawsRemaining:', dailyDrawsRemaining);
      console.log('totalDrawsToday:', totalDrawsToday);
      console.log('drawsResetTime:', drawsResetTime);
      console.log('========================');
      setIsCardNew(!userHadCard);
    }
  }, [todaysImage, userCollection, dailyDrawsRemaining, totalDrawsToday]);

  // Enhanced login function that handles both Cognito and demo users
  const handleLogin = async (username, email) => {
    // For admin users, skip Cognito authentication
    if (username === 'admin') {
      login(username, email);
      setAuthUser({ username, email, isAdminUser: true });
      return;
    }

    // For real users, they should already be authenticated through Cognito
    // This function is called after successful Cognito auth
    login(username, email);
  };

  // Enhanced logout function
  const handleLogout = async () => {
    try {
      // Only sign out from Cognito if it's not an admin user
      if (authUser && !authUser.isAdminUser) {
        await signOut();
      }
      setAuthUser(null);
      gameLogout();
    } catch (error) {
      console.error('Error signing out:', error);
      // Force logout even if Cognito signout fails
      setAuthUser(null);
      gameLogout();
    }
  };

  // Check if the current card is new for the user
  const isNewCard = () => {
    return isCardNew;
  };

  // Show loading screen while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-white mb-4"></div>
          <p className="text-white text-xl font-bold">Chargement de Pocket Machicoulis...</p>
        </div>
      </div>
    );
  }

  // Show login screen if no authenticated user and no game user
  if (!authUser && !user) {
    return <LoginScreen login={handleLogin} />;
  }

  return (
    <div>
      {currentView === 'home' && (
        <HomeScreen
          user={user}
          logout={handleLogout}
          drawDailyImage={drawDailyImage}
          loading={loading}
          todaysClaim={todaysClaim}
          userCollection={userCollection}
          getStreakCount={getStreakCount}
          imageDatabase={imageDatabase}
          setCurrentView={setCurrentView}
          // All new 3-draws-per-day props
          dailyDrawsRemaining={dailyDrawsRemaining}
          totalDrawsToday={totalDrawsToday}
          drawsResetTime={drawsResetTime}
          canDraw={canDraw}
          getDrawButtonText={getDrawButtonText}
          getTimeUntilReset={getTimeUntilReset}
          MAX_DRAWS_PER_DAY={MAX_DRAWS_PER_DAY}
        />
      )}
      {currentView === 'collection' && (
        <CollectionScreen
          userCollection={userCollection}
          imageDatabase={imageDatabase}
          setCurrentView={setCurrentView}
          setSelectedImage={setSelectedImage}
        />
      )}
      <NewImageModal
        showNewImage={showNewImage}
        setShowNewImage={setShowNewImage}
        todaysImage={todaysImage}
        shakeAnimation={shakeAnimation}
        setShakeAnimation={setShakeAnimation}
        isNewCard={isNewCard()}
        userCollection={userCollection}
      />
      <ImageDetailModal
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
      />
    </div>
  );
};

export default DailyImageCollector;