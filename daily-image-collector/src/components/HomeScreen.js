// src/components/HomeScreen.js

import React from 'react';
import { User, Calendar, Gift, LogOut, Grid, Trophy, Target, Flame, Clock } from 'lucide-react';

const HomeScreen = ({
  user,
  logout,
  drawDailyImage,
  loading,
  todaysClaim, // Legacy compatibility
  userCollection,
  getStreakCount,
  imageDatabase,
  setCurrentView,
  // New 3-draws-per-day props (with defaults)
  dailyDrawsRemaining = 3,
  totalDrawsToday = 0,
  canDraw = () => true,
  getDrawButtonText = () => "🎯 Tirer une Image",
  getTimeUntilReset = null,
  MAX_DRAWS_PER_DAY = 3
}) => {
  // Calculate proper completion based on unique images collected vs total available
  const uniqueCollectedIds = new Set(userCollection.map(item => {
    const itemId = item.id || item.imageID;
    return String(itemId).split('_')[0]; // Remove any suffix to get base ID
  }));
  
  const actualCollectedCount = uniqueCollectedIds.size;
  const completionPercentage = imageDatabase.length > 0 ? Math.round((actualCollectedCount / imageDatabase.length) * 100) : 0;
  
  // Calculate rarity breakdown
  const rarityStats = imageDatabase.reduce((stats, image) => {
    const rarity = image.rarity || 'Common';
    if (!stats[rarity]) {
      stats[rarity] = { total: 0, collected: 0 };
    }
    stats[rarity].total++;
    
    // Check if this image is collected
    const isCollected = userCollection.some(item => {
      const itemId = item.id || item.imageID;
      const templateId = image.id;
      return String(itemId).split('_')[0] === String(templateId) ||
             String(itemId) === String(templateId) ||
             item.name === image.name ||
             item.imageName === image.name;
    });
    
    if (isCollected) {
      stats[rarity].collected++;
    }
    
    return stats;
  }, {});

  // Get time until reset for display (with null check)
  const timeUntilReset = getTimeUntilReset ? getTimeUntilReset() : null;

  // Determine if user can draw (with fallback logic)
  const userCanDraw = () => {
    // If canDraw function is provided, use it
    if (typeof canDraw === 'function') {
      return canDraw();
    }
    // Fallback logic
    if (user?.username === 'admin') {
      return true;
    }
    return dailyDrawsRemaining > 0;
  };

  // Determine draw card status and styling
  const getDrawCardStatus = () => {
    if (user?.username === 'admin') {
      return {
        canDraw: true,
        title: 'Tirage Quotidien 🎲 (Admin)',
        subtitle: 'Mode administrateur - tirages illimités',
        buttonText: '🎯 Tirer une Image',
        statusColor: 'text-red-500',
        statusBg: 'bg-red-100',
        statusIcon: '👑'
      };
    }
    
    if (dailyDrawsRemaining > 0) {
      return {
        canDraw: true,
        title: 'Tirage Quotidien 🎲',
        subtitle: `${dailyDrawsRemaining} tirage${dailyDrawsRemaining > 1 ? 's' : ''} restant${dailyDrawsRemaining > 1 ? 's' : ''}`,
        buttonText: `🎯 Tirer (${dailyDrawsRemaining}/${MAX_DRAWS_PER_DAY})`,
        statusColor: 'text-green-600',
        statusBg: 'bg-green-100',
        statusIcon: '🎯'
      };
    }
    
    return {
      canDraw: false,
      title: 'Tirage Quotidien 🎲',
      subtitle: 'Tous les tirages utilisés aujourd\'hui',
      buttonText: '⏰ Plus de tirages',
      statusColor: 'text-orange-600',
      statusBg: 'bg-orange-100',
      statusIcon: '⏰'
    };
  };

  const drawStatus = getDrawCardStatus();

  return (
    <div
      className="min-h-screen p-2 sm:p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url('https://machicoulis-20250704132620-hostingbucket-machicouli.s3.us-east-1.amazonaws.com/background.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Enhanced Mobile-Friendly Header */}
        <div className="text-center mb-4 sm:mb-8">
          <h1
            className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-2 transform -rotate-1 hover:rotate-0 transition-transform duration-500"
            style={{
              fontFamily: 'Comic Sans MS, cursive, sans-serif',
              textShadow: '2px 2px 0px rgba(0,0,0,0.3)',
              filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))'
            }}
          >
            POCKET MACHICOULIS
          </h1>
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="text-xl sm:text-2xl animate-bounce">🏰</div>
            <p className="text-white text-xs sm:text-sm font-bold bg-black bg-opacity-50 px-2 sm:px-3 py-1 rounded-full">
              Ton aventure continue !
            </p>
            <div className="text-xl sm:text-2xl animate-bounce delay-300">⚔️</div>
          </div>
        </div>

        {/* Enhanced Mobile-Friendly Main Card */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-6 mb-4 sm:mb-6 border-2 sm:border-4 border-yellow-400">
          
          {/* User Header - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full flex-shrink-0">
                <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="flex-1 sm:flex-none text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Salut, {user.username}! 🎮
                  {user.username === 'admin' && <span className="text-red-500 text-xs sm:text-sm ml-2">👑 ADMIN</span>}
                </h2>
              </div>
            </div>
          </div>

          {/* Main Action Cards - Stacked on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Enhanced Daily Draw Card */}
            <div className="bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 rounded-xl p-4 sm:p-6 border-2 border-purple-300 transform hover:scale-105 transition-transform">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full animate-pulse">
                  <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">{drawStatus.title}</h3>
              </div>
              
              {/* Draw Status Display */}
              <div className={`${drawStatus.statusBg} rounded-lg p-3 mb-4`}>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{drawStatus.statusIcon}</span>
                  <span className={`font-bold text-sm ${drawStatus.statusColor}`}>
                    {drawStatus.subtitle}
                  </span>
                </div>
                
                {/* Progress Bar for Non-Admin Users */}
                {user?.username !== 'admin' && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(totalDrawsToday / MAX_DRAWS_PER_DAY) * 100}%` }}
                    ></div>
                  </div>
                )}
                
                {/* Today's Usage Stats */}
                <div className="text-xs text-gray-600">
                  {user?.username === 'admin' ? (
                    'Mode administrateur activé'
                  ) : (
                    `Utilisé aujourd'hui: ${totalDrawsToday}/${MAX_DRAWS_PER_DAY}`
                  )}
                </div>
              </div>

              {/* Draw Button */}
              <button
                onClick={() => {
                  console.log('=== DRAW BUTTON CLICK DEBUG ===');
                  console.log('Can draw:', userCanDraw());
                  console.log('Loading:', loading);
                  console.log('drawDailyImage function:', typeof drawDailyImage);
                  console.log('User:', user);
                  console.log('dailyDrawsRemaining:', dailyDrawsRemaining);
                  console.log('todaysClaim:', todaysClaim);
                  
                  if (!loading && userCanDraw() && drawDailyImage) {
                    console.log('About to call drawDailyImage...');
                    try {
                      drawDailyImage();
                      console.log('drawDailyImage called successfully');
                    } catch (error) {
                      console.error('Error calling drawDailyImage:', error);
                    }
                  } else {
                    console.log('Draw blocked:', { 
                      loading, 
                      canDraw: userCanDraw(), 
                      hasFunction: !!drawDailyImage,
                      blockReason: !loading ? (!userCanDraw() ? 'Cannot draw' : (!drawDailyImage ? 'No function' : 'Unknown')) : 'Loading'
                    });
                  }
                  console.log('=== END DRAW BUTTON DEBUG ===');
                }}
                disabled={loading || !userCanDraw()}
                className={`w-full font-bold py-3 sm:py-4 px-4 rounded-lg transition-all transform shadow-lg flex items-center justify-center text-sm sm:text-base ${
                  userCanDraw() && !loading
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105' 
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                    Tirage en cours...
                  </>
                ) : (
                  drawStatus.buttonText
                )}
              </button>

              {/* Reset Timer */}
              {!userCanDraw() && user?.username !== 'admin' && timeUntilReset && (
                <div className="mt-3 text-center">
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      Réinitialisation dans {timeUntilReset.hours}h {timeUntilReset.minutes}m
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Collection Card */}
            <div className="bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-xl p-4 sm:p-6 border-2 border-blue-300 transform hover:scale-105 transition-transform">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-full animate-pulse">
                  <Grid className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Ta Collection 📚</h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center bg-white bg-opacity-50 p-2 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">Images uniques:</span>
                  <span className="font-bold text-base sm:text-lg text-blue-600">{actualCollectedCount}/{imageDatabase.length} 🎯</span>
                </div>
                
                {/* Today's Draws Progress */}
                <div className="flex justify-between items-center bg-white bg-opacity-50 p-2 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">Tirages aujourd'hui:</span>
                  <span className="font-bold text-base sm:text-lg text-purple-600">
                    {user?.username === 'admin' ? '∞' : `${totalDrawsToday}/${MAX_DRAWS_PER_DAY}`} 🎲
                  </span>
                </div>
                
                <div className="flex justify-between items-center bg-white bg-opacity-50 p-2 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">Série quotidienne:</span>
                  <span className="font-bold text-base sm:text-lg text-orange-600">{getStreakCount()} 🔥</span>
                </div>
                <div className="flex justify-between items-center bg-white bg-opacity-50 p-2 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">Complétion:</span>
                  <span className="font-bold text-base sm:text-lg text-green-600">{completionPercentage}% 🎊</span>
                </div>
                
                {/* Rarity Breakdown */}
                <div className="bg-white bg-opacity-50 p-2 rounded-lg">
                  <div className="text-gray-700 font-medium text-sm mb-2">Découvertes par rareté:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(rarityStats).map(([rarity, stats]) => {
                      const colors = {
                        Common: 'text-gray-600',
                        Rare: 'text-blue-600', 
                        Epic: 'text-purple-600',
                        Legendary: 'text-orange-600'
                      };
                      const emojis = {
                        Common: '⚪',
                        Rare: '🔵',
                        Epic: '🟣', 
                        Legendary: '🟠'
                      };
                      return (
                        <div key={rarity} className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{emojis[rarity]} {rarity}:</span>
                          <span className={`text-xs font-bold ${colors[rarity]}`}>
                            {stats.collected}/{stats.total}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('collection')}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
              >
                📖 Voir ma Collection
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center">
          <button
            onClick={logout}
            className="flex items-center justify-center space-x-2 text-white bg-red-500 hover:bg-red-600 px-3 sm:px-4 py-2 rounded-lg transition-colors transform hover:scale-105"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Quitter</span>
          </button>
        </div>

        {/* Floating Elements - Reduced on Mobile */}
        <div className="hidden sm:block absolute top-20 left-10 text-3xl animate-bounce opacity-60">🛡️</div>
        <div className="hidden sm:block absolute top-32 right-20 text-2xl animate-ping opacity-60">✨</div>
        <div className="hidden sm:block absolute bottom-20 left-20 text-2xl animate-pulse opacity-60">🗡️</div>
        <div className="hidden sm:block absolute bottom-32 right-10 text-3xl animate-bounce delay-500 opacity-60">🏹</div>
        
        {/* Mobile-only simplified floating elements */}
        <div className="sm:hidden absolute top-10 right-4 text-lg animate-bounce opacity-40">✨</div>
        <div className="sm:hidden absolute bottom-10 left-4 text-lg animate-pulse opacity-40">🗡️</div>
      </div>
    </div>
  );
};

export default HomeScreen;