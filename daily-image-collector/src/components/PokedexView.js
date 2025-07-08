// src/components/PokedexView.js

import React, { useMemo } from 'react';
import { Star } from 'lucide-react';
import { getRarityColor } from '../utils/helpers';

const PokedexView = ({
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

  const pokedexEntries = useMemo(() => {
    return imageDatabase.map((templateImage) => {
      const collectedImage = userCollection.find(item => {
        const itemId = item.id || item.imageID;
        const templateId = templateImage.id;
        return String(itemId).split('_')[0] === String(templateId) ||
               String(itemId) === String(templateId) ||
               item.name === templateImage.name ||
               item.imageName === templateImage.name;
      });
      return {
        ...templateImage,
        isCollected: !!collectedImage,
        dateObtained: collectedImage?.dateObtained || null,
        collectedData: collectedImage,
      };
    });
  }, [userCollection, imageDatabase]);

  const collectedCount = useMemo(() => pokedexEntries.filter(entry => entry.isCollected).length, [pokedexEntries]);

  // Group entries by rarity
  const rarityOrder = ['Common', 'Rare', 'Epic', 'Legendary'];
  const groupedByRarity = rarityOrder.reduce((groups, rarity) => {
    groups[rarity] = pokedexEntries.filter(entry => entry.rarity === rarity);
    return groups;
  }, {});

  // Rarity section styling
  const getRaritySectionStyle = (rarity) => {
    const styles = {
      Common: {
        bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
        border: 'border-gray-300',
        title: 'text-gray-700',
        emoji: '⚪'
      },
      Rare: {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
        border: 'border-blue-300',
        title: 'text-blue-700',
        emoji: '🔵'
      },
      Epic: {
        bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
        border: 'border-purple-300',
        title: 'text-purple-700',
        emoji: '🟣'
      },
      Legendary: {
        bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
        border: 'border-orange-300',
        title: 'text-orange-700',
        emoji: '🟠'
      }
    };
    return styles[rarity] || styles.Common;
  };

  const renderCard = (entry, globalIndex) => {
    const rarityEffect = entry.isCollected ? getRarityBorderEffect(entry.rarity) : { border: 'border border-gray-300', glow: 'shadow-sm', animation: '' };
    
    // Calculate count for this card
    const getCardCount = (entry) => {
      if (!entry.isCollected) return 0;
      const baseId = entry.id.toString();
      return userCollection.filter(card => {
        const cardBaseId = card.id.toString().split('_')[0];
        return cardBaseId === baseId;
      }).length;
    };
    
    const cardCount = getCardCount(entry);
    
    return (
      <div
        key={entry.id}
        className={`rounded-lg overflow-hidden transition-all ${
          entry.isCollected 
            ? `bg-white cursor-pointer transform hover:scale-105 ${rarityEffect.border} ${rarityEffect.glow} ${rarityEffect.animation}` 
            : 'bg-gray-100 opacity-75 border border-gray-300'
        }`}
        onClick={() => entry.isCollected && setSelectedImage(entry.collectedData)}
      >
        <div className="relative">
          {entry.isCollected ? (
            <div className="relative">
              <img 
                src={entry.url} 
                alt={entry.name} 
                className={`w-full h-32 object-cover ${
                  entry.rarity === 'Epic' 
                    ? 'filter brightness-110 contrast-110 saturate-125 hue-rotate-15' 
                    : entry.rarity === 'Legendary' 
                    ? 'filter brightness-115 contrast-115 saturate-130 hue-rotate-30' 
                    : ''
                }`}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'; }} 
              />
              
              {/* WoW-style rarity overlay */}
              {entry.rarity === 'Epic' && (
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-purple-600/10 pointer-events-none"></div>
              )}
              {entry.rarity === 'Legendary' && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 via-transparent to-orange-500/15 pointer-events-none"></div>
                  {/* Thunder effect */}
                  <div className="absolute inset-0 pointer-events-none">
                    <svg 
                      className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-8 text-yellow-300 opacity-80" 
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
                      className="absolute top-2 right-2 w-3 h-4 text-yellow-400 opacity-60" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.11 23L16.589 11.84H13.518L15.89 2L8.41 13.16H11.481L11.11 23z"/>
                    </svg>
                    <svg 
                      className="absolute bottom-3 left-3 w-2 h-3 text-yellow-500 opacity-50" 
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
            <div className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-center"><div className="text-4xl text-gray-400 mb-1">?</div><div className="text-xs text-gray-500">Not Found</div></div>
            </div>
          )}
          
          {/* Only keep count badge on image */}
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">#{String(globalIndex + 1).padStart(3, '0')}</div>
          
          {/* Count Badge - only show if count > 1 */}
          {entry.isCollected && cardCount > 1 && (
            <div className="absolute top-2 right-2">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                x{cardCount}
              </div>
            </div>
          )}
          
          {/* Epic/Legendary rarity corner accent */}
          {entry.isCollected && (entry.rarity === 'Epic' || entry.rarity === 'Legendary') && (
            <div className={`absolute top-0 right-0 w-0 h-0 border-l-[20px] border-b-[20px] border-l-transparent ${
              entry.rarity === 'Epic' ? 'border-b-purple-600' : 'border-b-orange-500'
            }`}></div>
          )}
        </div>
        
        {/* Enhanced bottom layout with rarity and card ID */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-bold text-sm ${entry.isCollected ? 'text-gray-800' : 'text-gray-400'} truncate flex-1 mr-2`}>
              {entry.isCollected ? entry.name : '???'}
            </h3>
            {entry.isCollected && (
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                ID:{entry.id}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <p className={`text-xs ${entry.isCollected ? 'text-gray-600' : 'text-gray-400'} truncate flex-1 mr-2`}>
              {entry.isCollected ? entry.category : 'Unknown'}
            </p>
            {entry.isCollected && (
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRarityColor(entry.rarity)}`}>
                {entry.rarity}
              </span>
            )}
          </div>
          
          {entry.isCollected && entry.dateObtained && (
            <p className="text-xs text-gray-500 mt-1">
              {new Date(entry.dateObtained).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="relative min-h-screen"
      style={{
        backgroundImage: `url('https://machicoulis-20250704132620-hostingbucket-machicouli.s3.us-east-1.amazonaws.com/common/sam-suedois.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="space-y-8">
          {rarityOrder.map(rarity => {
            const entries = groupedByRarity[rarity];
            if (entries.length === 0) return null;

            const sectionStyle = getRaritySectionStyle(rarity);
            const collectedInRarity = entries.filter(entry => entry.isCollected).length;
            const globalStartIndex = rarityOrder.slice(0, rarityOrder.indexOf(rarity))
              .reduce((acc, prevRarity) => acc + groupedByRarity[prevRarity].length, 0);

            return (
              <div key={rarity} className={`${sectionStyle.bg} ${sectionStyle.border} border-2 rounded-xl p-4 sm:p-6 bg-opacity-95 backdrop-blur-sm`}>
                {/* Rarity Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{sectionStyle.emoji}</span>
                    <h3 className={`text-xl sm:text-2xl font-bold ${sectionStyle.title}`}>
                      {rarity}
                    </h3>
                  </div>
                  <div className={`${sectionStyle.title} font-semibold text-sm sm:text-base`}>
                    {collectedInRarity}/{entries.length} Collected
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="bg-white bg-opacity-50 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        rarity === 'Common' ? 'bg-gray-500' :
                        rarity === 'Rare' ? 'bg-blue-500' :
                        rarity === 'Epic' ? 'bg-purple-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${(collectedInRarity / entries.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {entries.map((entry, index) => renderCard(entry, globalStartIndex + index))}
                </div>
              </div>
            );
          })}
        </div>

        {collectedCount === imageDatabase.length && (
          <div className="mt-8 text-center p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg bg-opacity-95 backdrop-blur-sm">
            <Star className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">🎉 Pokédex Complete! 🎉</h3>
            <p className="text-gray-600">Congratulations! You've collected all {imageDatabase.length} images!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokedexView;