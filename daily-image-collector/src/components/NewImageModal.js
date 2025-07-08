// src/components/NewImageModal.js

import React, { useEffect } from 'react';

const NewImageModal = ({ showNewImage, setShowNewImage, todaysImage, shakeAnimation, setShakeAnimation, isNewCard = false, userCollection = [] }) => {
  useEffect(() => {
    if (showNewImage && todaysImage) {
      const timer = setTimeout(() => {
        setShakeAnimation(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showNewImage, todaysImage, setShakeAnimation]);

  if (!showNewImage || !todaysImage) {
    return null;
  }

  const getRarityConfig = (rarity) => {
    switch (rarity) {
      case 'Legendary':
        return {
          emoji: '👑',
          text: 'LEGENDARY!',
          bgGradient: 'from-yellow-400 via-yellow-500 to-orange-500',
          textGradient: 'from-yellow-400 to-orange-600',
          pingColor: 'bg-yellow-400',
          shadowColor: 'shadow-yellow-500/50'
        };
      case 'Epic':
        return {
          emoji: '💎',
          text: 'EPIC!',
          bgGradient: 'from-purple-400 via-purple-500 to-pink-500',
          textGradient: 'from-purple-400 to-pink-600',
          pingColor: 'bg-purple-400',
          shadowColor: 'shadow-purple-500/50'
        };
      case 'Rare':
        return {
          emoji: '⭐',
          text: 'RARE!',
          bgGradient: 'from-blue-400 via-blue-500 to-indigo-500',
          textGradient: 'from-blue-400 to-indigo-600',
          pingColor: 'bg-blue-400',
          shadowColor: 'shadow-blue-500/50'
        };
      default:
        return {
          emoji: '✨',
          text: 'COMMON',
          bgGradient: 'from-gray-400 via-gray-500 to-gray-600',
          textGradient: 'from-gray-400 to-gray-600',
          pingColor: 'bg-gray-400',
          shadowColor: 'shadow-gray-500/50'
        };
    }
  };

  // Calculate how many copies the user has of this card (excluding the just drawn one)
  const getCardCount = () => {
    if (!todaysImage || !userCollection) return 0;
    
    // Extract base ID (part before underscore) from todaysImage
    const todaysBaseId = todaysImage.id.toString().split('_')[0];
    
    // Exclude the last entry (just drawn card) when counting previous copies
    const collectionWithoutLastCard = userCollection.slice(0, -1);
    
    // Count all previous cards with the same base ID
    return collectionWithoutLastCard.filter(card => {
      const cardBaseId = card.id.toString().split('_')[0];
      return cardBaseId === todaysBaseId;
    }).length;
  };

  // Get the base card ID for display
  const getCardBaseId = () => {
    if (!todaysImage) return '';
    return todaysImage.id.toString().split('_')[0];
  };

  const rarityConfig = getRarityConfig(todaysImage.rarity);
  const cardCount = getCardCount();
  const cardBaseId = getCardBaseId();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center p-2 z-50">
      <div className="relative w-full max-w-6xl h-full max-h-screen flex flex-col overflow-hidden">
        <div className="relative flex-1 flex flex-col min-h-0">
          <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 p-2 rounded-2xl shadow-2xl flex-1 flex flex-col min-h-0">
            <div className="bg-white rounded-xl overflow-hidden shadow-inner flex-1 flex flex-col min-h-0">
              <div className={`absolute inset-0 rounded-xl pointer-events-none animate-ping ${rarityConfig.pingColor} opacity-20`}></div>
              
              <div className="relative bg-gray-900 overflow-hidden flex-1 min-h-0">
                <img src={todaysImage.url} alt="" className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-110 opacity-30 animate-pulse" />
                <img src={todaysImage.url} alt={todaysImage.name} className={`relative w-full h-full object-contain z-10 transition-all duration-1000 ${shakeAnimation ? 'animate-shake' : ''}`} />
                
                {/* Floating particles */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce opacity-70"></div>
                <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                <div className="absolute bottom-6 left-6 w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-300"></div>
                <div className="absolute bottom-4 right-4 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping delay-500"></div>
                
                {/* Epic reveal animation */}
                {shakeAnimation && (
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs animate-pulse">
                    ✨ Epic Reveal! ✨
                  </div>
                )}

                {/* New card indicator */}
                {isNewCard && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                      <div className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                        🆕 NEW!
                      </div>
                    </div>
                  </div>
                )}

                {/* Card base ID indicator */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    ID: {cardBaseId}
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 p-3 text-center bg-gradient-to-b from-white to-gray-50 max-h-56 overflow-y-auto">
                {/* Header section with rarity and name - centered */}
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <div className="text-2xl animate-bounce">{rarityConfig.emoji}</div>
                  <div className="text-center">
                    <h4 className="font-bold text-lg text-gray-800 mb-1">{todaysImage.name}</h4>
                    <div className="flex items-center justify-center space-x-2">
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${rarityConfig.bgGradient} text-white shadow-md`}>
                        {rarityConfig.text}
                      </div>
                      {cardCount >= 0 && (
                        <div className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          x{cardCount + 1}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Card description - always visible and centered */}
                {todaysImage.description && (
                  <div className="mb-3 p-2 bg-gray-50 rounded-lg border-l-4 border-purple-400 text-center">
                    <p className="text-xs text-gray-700 leading-relaxed italic">
                      "{todaysImage.description}"
                    </p>
                  </div>
                )}

                {/* Enhanced Add to Collection button - centered */}
                <div className="text-center">
                  <button 
                    onClick={() => setShowNewImage(false)} 
                    className="relative group bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white font-bold py-2.5 px-5 rounded-full text-sm shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-white"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity -z-10"></div>
                    <span className="relative flex items-center justify-center space-x-2">
                      <span>🎉</span>
                      <span>Add to Collection!</span>
                      <span>✨</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-400 rounded-full opacity-20 animate-ping pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-purple-400 rounded-full opacity-20 animate-ping delay-700 pointer-events-none"></div>
        <div className="absolute top-1/2 -left-10 w-20 h-20 bg-pink-400 rounded-full opacity-15 animate-pulse pointer-events-none"></div>
        <div className="absolute top-1/4 -right-10 w-24 h-24 bg-blue-400 rounded-full opacity-15 animate-pulse delay-1000 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default NewImageModal;