// src/components/CollectionScreen.js

import React, { useMemo, useState } from 'react';
import { Home, BookOpen, Grid3X3 } from 'lucide-react';
import PokedexView from './PokedexView';
import CardSetView from './CardSetView';

const CollectionScreen = ({
  userCollection,
  imageDatabase,
  setCurrentView,
  setSelectedImage,
}) => {
  const [currentSubView, setCurrentSubView] = useState('pokedex'); // 'pokedex' or 'cardset'

  const collectedCount = useMemo(() => {
    return imageDatabase.filter((templateImage) => {
      return userCollection.some(item => {
        const itemId = item.id || item.imageID;
        const templateId = templateImage.id;
        return String(itemId).split('_')[0] === String(templateId) ||
               String(itemId) === String(templateId) ||
               item.name === templateImage.name ||
               item.imageName === templateImage.name;
      });
    }).length;
  }, [userCollection, imageDatabase]);

  return (
    <div 
      className="min-h-screen p-2 sm:p-4 relative"
      style={{
        backgroundImage: `url('https://machicoulis-20250704132620-hostingbucket-machicouli.s3.us-east-1.amazonaws.com/common/machicoulis.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
          {/* Enhanced Mobile-Friendly Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sm:p-6 bg-opacity-95 backdrop-blur-sm">
            <div className="flex flex-col space-y-4">
              {/* Title and Progress */}
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold mb-1">
                  📚 Collection Machicoulis
                </h2>
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
                    <span className="text-sm font-medium">
                      {collectedCount}/{imageDatabase.length} Discovered
                    </span>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
                    <span className="text-sm font-medium">
                      {Math.round((collectedCount / imageDatabase.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Home Button - Always Visible */}
              <div className="flex justify-center sm:justify-end">
                <button
                  onClick={() => setCurrentView('home')}
                  className="flex items-center justify-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-all w-full sm:w-auto"
                >
                  <Home className="h-4 w-4" />
                  <span>Back Home</span>
                </button>
              </div>
            </div>
          </div>

          {/* Submenu */}
          <div className="bg-gray-50 bg-opacity-95 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6">
            <div className="flex justify-center space-x-1">
              <button
                onClick={() => setCurrentSubView('pokedex')}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all ${
                  currentSubView === 'pokedex'
                    ? 'border-b-2 border-purple-500 text-purple-600 bg-white bg-opacity-90'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 hover:bg-opacity-90'
                } rounded-t-lg backdrop-blur-sm`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Pokédex View</span>
              </button>
              <button
                onClick={() => setCurrentSubView('cardset')}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all ${
                  currentSubView === 'cardset'
                    ? 'border-b-2 border-purple-500 text-purple-600 bg-white bg-opacity-90'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 hover:bg-opacity-90'
                } rounded-t-lg backdrop-blur-sm`}
              >
                <Grid3X3 className="h-4 w-4" />
                <span>Card Set View</span>
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4 sm:p-6 bg-white bg-opacity-95 backdrop-blur-sm">
            {currentSubView === 'pokedex' ? (
              <PokedexView
                userCollection={userCollection}
                imageDatabase={imageDatabase}
                setSelectedImage={setSelectedImage}
              />
            ) : (
              <CardSetView
                userCollection={userCollection}
                imageDatabase={imageDatabase}
                setSelectedImage={setSelectedImage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionScreen;