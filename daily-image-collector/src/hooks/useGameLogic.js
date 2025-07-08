// src/hooks/useGameLogic.js - FIXED VERSION

import { useState, useEffect, useCallback } from 'react';
import imageData from '../imageDatabase.json';

const imageDatabase = imageData.images;

export const useGameLogic = () => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [userCollection, setUserCollection] = useState([]);
  const [todaysClaim, setTodaysClaim] = useState(false);
  const [showNewImage, setShowNewImage] = useState(false);
  const [todaysImage, setTodaysImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [collectionView, setCollectionView] = useState('obtained');
  const [shakeAnimation, setShakeAnimation] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // NEW: 3 draws per day state
  const [dailyDrawsRemaining, setDailyDrawsRemaining] = useState(3);
  const [totalDrawsToday, setTotalDrawsToday] = useState(0);
  const [drawsResetTime, setDrawsResetTime] = useState(null);

  // Maximum draws per day
  const MAX_DRAWS_PER_DAY = 3;

  const loadUserData = useCallback(() => {
    if (user) {
      const collection = JSON.parse(localStorage.getItem(`collection_${user.username}`) || '[]');
      setUserCollection(collection);
    }
  }, [user]);

  // NEW: Initialize daily draws system
  const initializeDailyDraws = useCallback(() => {
    if (!user) return;
    
    const today = new Date().toDateString();
    const savedData = localStorage.getItem(`dailyDraws_${user.username}`);
    
    console.log('Initializing draws for date:', today);
    console.log('Saved data:', savedData);
    
    if (savedData) {
      try {
        const { date, drawsUsed } = JSON.parse(savedData);
        
        if (date === today) {
          // Same day - restore progress
          console.log('Same day, restoring progress. Draws used:', drawsUsed);
          setTotalDrawsToday(drawsUsed);
          setDailyDrawsRemaining(MAX_DRAWS_PER_DAY - drawsUsed);
          // Don't set todaysClaim based on drawsUsed anymore - use new system
        } else {
          // New day - reset draws
          console.log('New day detected, resetting draws');
          resetDailyDraws();
        }
      } catch (error) {
        console.error('Error parsing saved data:', error);
        resetDailyDraws();
      }
    } else {
      // First time - initialize
      console.log('No saved data, initializing fresh');
      resetDailyDraws();
    }
    
    // Set reset time to next midnight
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    setDrawsResetTime(tomorrow);
  }, [user]);

  // NEW: Reset daily draws function
  const resetDailyDraws = useCallback(() => {
    console.log('Resetting daily draws');
    setTotalDrawsToday(0);
    setDailyDrawsRemaining(MAX_DRAWS_PER_DAY);
    setTodaysClaim(false);
    
    // Save to localStorage
    if (user) {
      const today = new Date().toDateString();
      localStorage.setItem(`dailyDraws_${user.username}`, JSON.stringify({
        date: today,
        drawsUsed: 0
      }));
    }
  }, [user]);

  // NEW: Save daily draw progress
  const saveDailyDrawProgress = useCallback((drawsUsed) => {
    if (!user) return;
    
    const today = new Date().toDateString();
    const dataToSave = {
      date: today,
      drawsUsed: drawsUsed
    };
    console.log('Saving daily draw progress:', dataToSave);
    localStorage.setItem(`dailyDraws_${user.username}`, JSON.stringify(dataToSave));
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserData();
      initializeDailyDraws(); // NEW: Initialize draw system
      
      // Keep existing legacy logic for backward compatibility but don't let it block draws
      if (user.username === 'admin') {
        setTodaysClaim(false);
      }
      // Remove the todaysClaim logic that was blocking multiple draws
    }
  }, [user, loadUserData, initializeDailyDraws]);

  // NEW: Check for daily reset periodically
  const checkDailyReset = useCallback(() => {
    if (!user) return;
    
    const now = new Date();
    const today = now.toDateString();
    const savedData = localStorage.getItem(`dailyDraws_${user.username}`);
    
    if (savedData) {
      try {
        const { date } = JSON.parse(savedData);
        
        // If date changed, reset draws
        if (date !== today) {
          console.log('Daily reset detected');
          resetDailyDraws();
        }
      } catch (error) {
        console.error('Error checking daily reset:', error);
      }
    }
  }, [user, resetDailyDraws]);

  // NEW: Check for reset every minute
  useEffect(() => {
    if (user) {
      const interval = setInterval(checkDailyReset, 60000);
      return () => clearInterval(interval);
    }
  }, [user, checkDailyReset]);

  const getStreakCount = useCallback(() => {
    if (!user) return 0;
    return parseInt(localStorage.getItem(`streak_${user.username}`) || '0');
  }, [user]);

  const updateStreak = useCallback(() => {
    if (!user) return;
    const today = new Date().toDateString();
    const lastClaim = localStorage.getItem(`lastClaim_${user.username}`);
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    let newStreak = (lastClaim === yesterday) ? getStreakCount() + 1 : 1;
    localStorage.setItem(`streak_${user.username}`, newStreak.toString());
  }, [user, getStreakCount]);

  const login = (username, email) => {
    const userData = { username, email, joinDate: new Date().toISOString() };
    setUser(userData);
    setCurrentView('home');
  };

  const logout = () => {
    setUser(null);
    setCurrentView('home');
    setUserCollection([]);
    setTodaysClaim(false);
    // NEW: Reset draw state on logout
    setDailyDrawsRemaining(3);
    setTotalDrawsToday(0);
    setDrawsResetTime(null);
  };

  // FIXED: Enhanced drawDailyImage with proper 3-draws-per-day logic
  const drawDailyImage = useCallback(() => {
    console.log('=== DRAW DAILY IMAGE CALLED ===');
    console.log('User:', user?.username);
    console.log('dailyDrawsRemaining:', dailyDrawsRemaining);
    console.log('totalDrawsToday:', totalDrawsToday);
    console.log('loading:', loading);
    console.log('todaysClaim (legacy):', todaysClaim);
    
    // NEW: Primary check - use the new draw system
    if (user?.username !== 'admin' && dailyDrawsRemaining <= 0) {
      console.log('No draws remaining today (new system)');
      alert('No draws remaining today!');
      return;
    }
    
    // Remove the legacy todaysClaim check that was blocking draws
    // if (todaysClaim && user?.username !== 'admin') return; // REMOVED!
    
    if (loading) {
      console.log('Already loading, returning');
      return;
    }
    
    console.log('Starting draw process...');
    setLoading(true);
    
    setTimeout(() => {
      try {
        if (!imageDatabase || imageDatabase.length === 0) {
          throw new Error('No images available in database');
        }
        
        console.log('Selecting image from database of', imageDatabase.length, 'images');
        
        const weights = { Common: 50, Rare: 30, Epic: 15, Legendary: 5 };
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        const random = Math.random() * totalWeight;
        
        let currentWeight = 0;
        let selectedRarity = 'Common';
        for (const [rarity, weight] of Object.entries(weights)) {
          currentWeight += weight;
          if (random <= currentWeight) {
            selectedRarity = rarity;
            break;
          }
        }

        let availableImages = imageDatabase.filter(img => img.rarity === selectedRarity);
        if (availableImages.length === 0) {
            availableImages = imageDatabase.filter(img => img.rarity === 'Common');
            if(availableImages.length === 0) throw new Error('No images available');
        }

        const drawnImage = availableImages[Math.floor(Math.random() * availableImages.length)];
        console.log('Selected image:', drawnImage);
        
        const newCollection = [...userCollection, { 
          ...drawnImage, 
          dateObtained: new Date().toISOString(),
          id: `${drawnImage.id}_${Date.now()}`,
          imageUrl: drawnImage.url,
          imageName: drawnImage.name
        }];
        
        setUserCollection(newCollection);
        localStorage.setItem(`collection_${user.username}`, JSON.stringify(newCollection));
        
        // NEW: Update draw counts (skip for admin)
        if (user?.username !== 'admin') {
          const newDrawsUsed = totalDrawsToday + 1;
          const newDrawsRemaining = MAX_DRAWS_PER_DAY - newDrawsUsed;
          
          console.log('Updating draw counts:', { newDrawsUsed, newDrawsRemaining });
          
          setTotalDrawsToday(newDrawsUsed);
          setDailyDrawsRemaining(newDrawsRemaining);
          saveDailyDrawProgress(newDrawsUsed);
          
          // Keep existing legacy logic
          updateStreak();
          const today = new Date().toDateString();
          localStorage.setItem(`lastClaim_${user.username}`, today);
          
          // Only set todaysClaim to true if we've used all draws
          if (newDrawsRemaining === 0) {
            setTodaysClaim(true);
          }
        }
        
        setTodaysImage(drawnImage);
        setShakeAnimation(true);
        setShowNewImage(true);
        
        setTimeout(() => setShakeAnimation(false), 5000);
        
        console.log('Draw completed successfully!');
      } catch (error) {
        console.error('Error drawing daily image:', error);
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }, 1500);
  }, [loading, userCollection, user, updateStreak, dailyDrawsRemaining, totalDrawsToday, saveDailyDrawProgress, todaysClaim]);

  // NEW: Check if user can draw
  const canDraw = useCallback(() => {
    const result = user?.username === 'admin' || dailyDrawsRemaining > 0;
    console.log('canDraw called:', { username: user?.username, dailyDrawsRemaining, result });
    return result;
  }, [user, dailyDrawsRemaining]);

  // NEW: Get dynamic button text
  const getDrawButtonText = useCallback(() => {
    if (user?.username === 'admin') {
      return '🎯 Tirer une Image (Illimité)';
    }
    
    if (dailyDrawsRemaining === 0) {
      return '⏰ Plus de tirages';
    }
    
    return `🎯 Tirer (${dailyDrawsRemaining}/${MAX_DRAWS_PER_DAY})`;
  }, [user, dailyDrawsRemaining]);

  // NEW: Get time until reset
  const getTimeUntilReset = useCallback(() => {
    if (!drawsResetTime) return null;
    
    const now = new Date();
    const diff = drawsResetTime - now;
    
    if (diff <= 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  }, [drawsResetTime]);

  return {
    // Existing exports
    user,
    currentView,
    setCurrentView,
    userCollection,
    todaysClaim,
    showNewImage,
    setShowNewImage,
    todaysImage,
    loading,
    selectedImage,
    setSelectedImage,
    collectionView,
    setCollectionView,
    shakeAnimation,
    setShakeAnimation,
    isFullscreen,
    setIsFullscreen,
    imageDatabase,
    login,
    logout,
    drawDailyImage,
    getStreakCount,
    
    // NEW: 3-draws-per-day exports
    dailyDrawsRemaining,
    totalDrawsToday,
    drawsResetTime,
    canDraw,
    getDrawButtonText,
    getTimeUntilReset,
    MAX_DRAWS_PER_DAY
  };
};