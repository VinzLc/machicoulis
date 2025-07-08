// src/components/CardSetView.js

import React, { useMemo } from 'react';
import { getRarityColor } from '../utils/helpers';

const CardSetView = ({
  userCollection,
  imageDatabase,
  setSelectedImage
}) => {
  // WoW-style rarity border effects
  const getRarityBorderEffect = (rarity) => {
    const effects = {
      Common: {
        border: 'border-2 border-gray-400',
        glow: 'shadow-md',
        animation: ''
      },
      Rare: {
        border: 'border-2 border-blue-500',
        glow: 'shadow-lg shadow-blue-500/30',
        animation: 'hover:shadow-blue-500/50'
      },
      Epic: {
        border: 'border-2 border-purple-600',
        glow: 'shadow-lg shadow-purple-600/30',
        animation: 'hover:shadow-purple-600/50'
      },
      Legendary: {
        border: 'border-2 border-orange-500',
        glow: 'shadow-lg shadow-orange-500/30',
        animation: 'hover:shadow-orange-500/50'
      }
    };
    return effects[rarity] || effects.Common;
  };

  // Group cards by category for display with separators
  const cardsByCategory = useMemo(() => {
    const sets = {};
    
    // Add all template cards from imageDatabase
    imageDatabase.forEach(templateCard => {
      const baseId = templateCard.id.toString();
      sets[baseId] = {
        ...templateCard,
        baseId,
        copies: [],
        count: 0,
        isCollected: false
      };
    });
    
    // Add collected cards and update counts
    userCollection.forEach(card => {
      const baseId = card.id.toString().split('_')[0];
      if (sets[baseId]) {
        sets[baseId].copies.push(card);
        sets[baseId].count++;
        sets[baseId].isCollected = true;
      }
    });
    
    // Group by category and filter out categories with only 1 card
    const groupedByCategory = {};
    Object.values(sets).forEach(cardSet => {
      if (!groupedByCategory[cardSet.category]) {
        groupedByCategory[cardSet.category] = [];
      }
      groupedByCategory[cardSet.category].push(cardSet);
    });
    
    // Filter out categories with only 1 card and sort within categories
    const filteredCategories = {};
    Object.entries(groupedByCategory).forEach(([category, cards]) => {
      if (cards.length > 1) {
        // Sort cards within category by rarity first, then by baseId
        const rarityOrder = { 'Common': 0, 'Rare': 1, 'Epic': 2, 'Legendary': 3 };
        filteredCategories[category] = cards.sort((a, b) => {
          // First sort by rarity (Legendary first, Common last)
          const rarityComparison = rarityOrder[a.rarity] - rarityOrder[b.rarity];
          if (rarityComparison !== 0) {
            return rarityComparison;
          }
          // If same rarity, sort by baseId
          return parseInt(a.baseId) - parseInt(b.baseId);
        });
      }
    });
    
    // Sort categories alphabetically
    const sortedCategories = Object.keys(filteredCategories).sort();
    const result = {};
    sortedCategories.forEach(category => {
      result[category] = filteredCategories[category];
    });
    
    return result;
  }, [userCollection, imageDatabase]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">🎴 Card Set Collection</h3>
        <p className="text-gray-600">View all your collected cards with duplicate counts</p>
      </div>

      <div className="space-y-8">
        {Object.entries(cardsByCategory).map(([category, cardSets]) => {
          const collectedCount = cardSets.filter(card => card.isCollected).length;
          const totalCount = cardSets.length;
          
          return (
            <div key={category} className="space-y-6">
              {/* Category Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📁</div>
                    <h3 className="text-xl sm:text-2xl font-bold">{category}</h3>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
                    <span className="text-sm font-medium">
                      {collectedCount}/{totalCount} Collected
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="bg-white bg-opacity-30 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${(collectedCount / totalCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Cards Grid for this category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cardSets.map((cardSet) => {
                  const rarityEffect = getRarityBorderEffect(cardSet.rarity);
                  
                  return (
                    <div
                      key={cardSet.baseId}
                      className={`rounded-lg overflow-hidden transition-all transform hover:scale-105 cursor-pointer ${
                        cardSet.isCollected 
                          ? `bg-white ${rarityEffect.border} ${rarityEffect.glow} ${rarityEffect.animation}` 
                          : 'bg-gray-100 border-2 border-gray-300 opacity-75'
                      }`}
                      onClick={() => cardSet.isCollected && setSelectedImage(cardSet.copies[0])}
                    >
                      <div className="relative">
                        {cardSet.isCollected ? (
                          <div className="relative">
                            <img 
                              src={cardSet.url} 
                              alt={cardSet.name} 
                              className={`w-full h-48 object-cover ${
                                cardSet.rarity === 'Epic' 
                                  ? 'filter brightness-110 contrast-110 saturate-125 hue-rotate-15' 
                                  : cardSet.rarity === 'Legendary' 
                                  ? 'filter brightness-115 contrast-115 saturate-130 hue-rotate-30' 
                                  : ''
                              }`}
                              onError={(e) => { 
                                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'; 
                              }} 
                            />
                            
                            {/* WoW-style rarity overlay */}
                            {cardSet.rarity === 'Epic' && (
                              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-purple-600/10 pointer-events-none"></div>
                            )}
                            {cardSet.rarity === 'Legendary' && (
                              <>
                                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 via-transparent to-orange-500/15 pointer-events-none"></div>
                                {/* Thunder effect */}
                                <div className="absolute inset-0 pointer-events-none">
                                  <svg 
                                    className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-10 text-yellow-300 opacity-80" 
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M11.11 23L16.589 11.84H13.518L15.89 2L8.41 13.16H11.481L11.11 23z" 
                                          stroke="currentColor" 
                                          strokeWidth="0.5" 
                                          fill="currentColor"
                                    />
                                  </svg>
                                  {/* Additional smaller lightning bolts */}
                                  <svg 
                                    className="absolute top-3 right-3 w-4 h-5 text-yellow-400 opacity-60" 
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M11.11 23L16.589 11.84H13.518L15.89 2L8.41 13.16H11.481L11.11 23z"/>
                                  </svg>
                                  <svg 
                                    className="absolute bottom-4 left-4 w-3 h-4 text-yellow-500 opacity-50" 
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M11.11 23L16.589 11.84H13.518L15.89 2L8.41 13.16H11.481L11.11 23z"/>
                                  </svg>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-6xl text-gray-400 mb-2">?</div>
                              <div className="text-sm text-gray-500 font-medium">Not Discovered</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Card ID */}
                        <div className="absolute top-3 left-3 bg-black bg-opacity-60 text-white text-sm font-bold px-2 py-1 rounded">
                          ID: {cardSet.baseId}
                        </div>
                        
                        {/* Count Badge - only for collected cards */}
                        {cardSet.isCollected && cardSet.count > 0 && (
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                            x{cardSet.count}
                          </div>
                        )}
                        
                        {/* Epic/Legendary rarity corner accent - only for collected cards */}
                        {cardSet.isCollected && (cardSet.rarity === 'Epic' || cardSet.rarity === 'Legendary') && (
                          <div className={`absolute top-0 right-0 w-0 h-0 border-l-[25px] border-b-[25px] border-l-transparent ${
                            cardSet.rarity === 'Epic' ? 'border-b-purple-600' : 'border-b-orange-500'
                          }`}></div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-bold text-lg truncate flex-1 mr-2 ${cardSet.isCollected ? 'text-gray-800' : 'text-gray-400'}`}>
                            {cardSet.isCollected ? cardSet.name : '???'}
                          </h3>
                          {/* Always show rarity badge for both collected and undiscovered cards */}
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRarityColor(cardSet.rarity)}`}>
                            {cardSet.rarity}
                          </span>
                        </div>
                        
                        {/* Collection dates - only for collected cards */}
                        {cardSet.isCollected && cardSet.copies.length > 0 && (
                          <div className="text-xs text-gray-500">
                            <div>First: {new Date(cardSet.copies[0].dateObtained).toLocaleDateString()}</div>
                            {cardSet.count > 1 && (
                              <div>Latest: {new Date(cardSet.copies[cardSet.copies.length - 1].dateObtained).toLocaleDateString()}</div>
                            )}
                          </div>
                        )}
                        
                        {/* Undiscovered status */}
                        {!cardSet.isCollected && (
                          <div className="text-xs text-gray-500 italic">
                            Draw daily images to discover this card!
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(cardsByCategory).length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-gray-600 mb-2">No Cards Collected Yet</h3>
          <p className="text-gray-500">Start drawing daily images to build your collection!</p>
        </div>
      )}
    </div>
  );
};

export default CardSetView;