import React, { useState, useEffect } from 'react';
import { User, Calendar, Star, Gift, LogOut, Home, Grid } from 'lucide-react';
import imageData from './imageDatabase.json';

const DailyImageCollector = () => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [userCollection, setUserCollection] = useState([]);
  const [todaysClaim, setTodaysClaim] = useState(false);
  const [showNewImage, setShowNewImage] = useState(false);
  const [todaysImage, setTodaysImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // For full view modal
  const [collectionView, setCollectionView] = useState('obtained'); // 'obtained' or 'pokedex'
  const [shakeAnimation, setShakeAnimation] = useState(true); // Control shake animation
  const [isFullscreen, setIsFullscreen] = useState(false); // Control fullscreen mode

  // Import image database from JSON file
  const imageDatabase = imageData.images;

  // Add custom CSS for shake animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
        10% { transform: translateX(-2px) translateY(-1px) rotate(-0.5deg); }
        20% { transform: translateX(2px) translateY(1px) rotate(0.5deg); }
        30% { transform: translateX(-1px) translateY(-2px) rotate(-0.5deg); }
        40% { transform: translateX(1px) translateY(2px) rotate(0.5deg); }
        50% { transform: translateX(-2px) translateY(1px) rotate(-0.5deg); }
        60% { transform: translateX(2px) translateY(-1px) rotate(0.5deg); }
        70% { transform: translateX(-1px) translateY(2px) rotate(-0.5deg); }
        80% { transform: translateX(1px) translateY(-2px) rotate(0.5deg); }
        90% { transform: translateX(-2px) translateY(-1px) rotate(-0.5deg); }
      }
      @keyframes fade-in {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-shake {
        animation: shake 0.8s infinite;
      }
      .animate-fade-in {
        animation: fade-in 1s ease-out;
      }
      .delay-300 {
        animation-delay: 0.3s;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  // Check if user can claim today's image
  useEffect(() => {
    if (user) {
      const today = new Date().toDateString();
      const lastClaim = localStorage.getItem(`lastClaim_${user.username}`);
      setTodaysClaim(lastClaim === today);
    }
  }, [user]);

  const loadUserData = () => {
    if (user) {
      const collection = JSON.parse(localStorage.getItem(`collection_${user.username}`) || '[]');
      setUserCollection(collection);
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return 'text-gray-600 bg-gray-100 border-gray-300';
      case 'Rare': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'Epic': return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'Legendary': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getStreakCount = () => {
    if (!user) return 0;
    return parseInt(localStorage.getItem(`streak_${user.username}`) || '0');
  };

  const updateStreak = () => {
    if (!user) return;
    const today = new Date().toDateString();
    const lastClaim = localStorage.getItem(`lastClaim_${user.username}`);
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    let newStreak = 1;
    if (lastClaim === yesterday) {
      const currentStreak = getStreakCount();
      newStreak = currentStreak + 1;
    }
    
    localStorage.setItem(`streak_${user.username}`, newStreak.toString());
  };

  const login = (username, email) => {
    const userData = { 
      username, 
      email,
      joinDate: new Date().toISOString()
    };
    setUser(userData);
    setCurrentView('home');
  };

  const logout = () => {
    setUser(null);
    setCurrentView('home');
    setUserCollection([]);
    setTodaysClaim(false);
  };

  const drawDailyImage = () => {
    if (todaysClaim || loading) return;

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Check if imageDatabase has images
        if (!imageDatabase || imageDatabase.length === 0) {
          throw new Error('No images available in database');
        }

        // Weighted random selection based on rarity
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

        // Find images of the selected rarity
        const availableImages = imageDatabase.filter(img => img.rarity === selectedRarity);
        
        // If no images of this rarity, try Common as fallback
        if (availableImages.length === 0) {
          console.log(`No ${selectedRarity} images found, falling back to Common`);
          const fallbackImages = imageDatabase.filter(img => img.rarity === 'Common');
          if (fallbackImages.length === 0) {
            throw new Error('No images available for any rarity');
          }
          selectedRarity = 'Common';
          availableImages.push(...fallbackImages);
        }

        // Select random image from available ones
        const selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
        
        if (!selectedImage || !selectedImage.id) {
          throw new Error('Selected image is invalid or missing ID');
        }

        console.log('Selected image:', selectedImage);

        // Add to collection
        const newCollection = [...userCollection, { 
          ...selectedImage, 
          dateObtained: new Date().toISOString(),
          id: `${selectedImage.id}_${Date.now()}`, // Ensure unique ID
          // Make sure URL is preserved correctly
          url: selectedImage.url,
          imageUrl: selectedImage.url, // Add both for compatibility
          name: selectedImage.name,
          imageName: selectedImage.name // Add both for compatibility
        }];
        
        setUserCollection(newCollection);
        localStorage.setItem(`collection_${user.username}`, JSON.stringify(newCollection));
        
        // Update streak and mark as claimed today
        updateStreak();
        const today = new Date().toDateString();
        localStorage.setItem(`lastClaim_${user.username}`, today);
        setTodaysClaim(true);
        setTodaysImage(selectedImage);
        setShakeAnimation(true); // Start shaking
        setShowNewImage(true);
        
        // Stop shaking after 5 seconds
        setTimeout(() => {
          setShakeAnimation(false);
        }, 5000);
        
      } catch (error) {
        console.error('Error drawing daily image:', error);
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }, 1500); // 1.5 second delay for effect
  };

  const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (username.trim()) {
        login(username, email);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <Gift className="mx-auto h-16 w-16 text-purple-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Daily Image Collector</h1>
            <p className="text-gray-600 mt-2">Discover a new image every day!</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-xs text-green-600">Ready to Deploy!</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your username"
                required
              />
            </div>
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                />
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-600 hover:text-purple-700 text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>

          <div className="mt-6 space-y-2">
            <button
              onClick={() => login('demo_user', 'demo@example.com')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Quick Demo Login
            </button>
          </div>
        </div>
      </div>
    );
  };

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-purple-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-800">Welcome, {user.username}!</h2>
                <p className="text-gray-600">Collection: {userCollection.length} images</p>
                <p className="text-gray-600">Daily Streak: {getStreakCount()} days</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-xs text-green-600">
                    {imageDatabase.length} custom images ready
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Gift className="h-8 w-8 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-800">Daily Draw</h3>
              </div>
              
              {!todaysClaim ? (
                <div>
                  <p className="text-gray-600 mb-4">Ready to discover today's image?</p>
                  <button
                    onClick={drawDailyImage}
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Drawing...
                      </>
                    ) : (
                      'Draw Today\'s Image'
                    )}
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">You've already claimed today's image!</p>
                  <div className="flex items-center space-x-2 text-green-600">
                    <Calendar className="h-5 w-5" />
                    <span>Come back tomorrow for a new image</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Grid className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Your Collection</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Images:</span>
                  <span className="font-bold">{userCollection.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Streak:</span>
                  <span className="font-bold">{getStreakCount()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rarest:</span>
                  <span className="font-bold">
                    {userCollection.length > 0 
                      ? userCollection.reduce((prev, curr) => {
                          const rarityOrder = { Common: 1, Rare: 2, Epic: 3, Legendary: 4 };
                          return rarityOrder[curr.rarity] > rarityOrder[prev.rarity] ? curr : prev;
                        }).rarity
                      : 'None'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion:</span>
                  <span className="font-bold">{Math.round((userCollection.length / imageDatabase.length) * 100)}%</span>
                </div>
              </div>
              
              <button
                onClick={() => setCurrentView('collection')}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                View Collection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CollectionScreen = () => {
    // Create a complete Pokédex view with all possible images
    const createPokedexView = () => {
      return imageDatabase.map((templateImage) => {
        // Find matching collected image by comparing template ID with collected image data
        const collectedImage = userCollection.find(item => {
          // Check multiple possible ID formats
          const itemId = item.id || item.imageID;
          const templateId = templateImage.id;
          
          // Convert both to strings for comparison
          return String(itemId).split('_')[0] === String(templateId) || 
                 String(itemId) === String(templateId) ||
                 item.name === templateImage.name ||
                 item.imageName === templateImage.name;
        });
        
        return {
          ...templateImage,
          isCollected: !!collectedImage,
          dateObtained: collectedImage?.dateObtained || null,
          collectedData: collectedImage
        };
      });
    };

    const pokedexEntries = createPokedexView();
    const collectedCount = pokedexEntries.filter(entry => entry.isCollected).length;

    const ObtainedView = () => (
      <>
        {userCollection.length === 0 ? (
          <div className="text-center py-12">
            <Gift className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No images collected yet</h3>
            <p className="text-gray-500">Draw your first daily image to start building your collection!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCollection.map((image, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer relative group"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative">
                  <div className="relative w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                    {/* Blurred background */}
                    <img
                      src={image.url || image.imageUrl}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
                    />
                    {/* Main image */}
                    <img
                      src={image.url || image.imageUrl}
                      alt={image.name || image.imageName}
                      className="relative w-full h-full object-contain z-10"
                      onError={(e) => {
                        console.log('Image failed to load:', image);
                        e.target.src = 'https://picsum.photos/400/300?text=Not+Found';
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded">
                      Click to view
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-800">{image.name || image.imageName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(image.rarity)}`}>
                      {image.rarity}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{image.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-purple-600 font-medium">{image.category}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(image.dateObtained).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );

    const PokedexView = () => (
      <>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {pokedexEntries.map((entry, index) => (
            <div 
              key={entry.id} 
              className={`rounded-lg overflow-hidden shadow-md transition-all ${
                entry.isCollected 
                  ? 'bg-white hover:shadow-lg cursor-pointer transform hover:scale-105' 
                  : 'bg-gray-100 opacity-75'
              }`}
              onClick={() => entry.isCollected && setSelectedImage(entry.collectedData)}
            >
              <div className="relative">
                {entry.isCollected ? (
                  <img
                    src={entry.url}
                    alt={entry.name}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl text-gray-400 mb-1">?</div>
                      <div className="text-xs text-gray-500">Not Found</div>
                    </div>
                  </div>
                )}
                
                {/* Pokédex number */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  #{String(index + 1).padStart(3, '0')}
                </div>
                
                {/* Rarity badge for collected images */}
                {entry.isCollected && (
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(entry.rarity)}`}>
                      {entry.rarity}
                    </span>
                  </div>
                )}
                
                {/* Collected indicator */}
                {entry.isCollected && (
                  <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <h3 className={`font-bold text-sm ${entry.isCollected ? 'text-gray-800' : 'text-gray-400'}`}>
                  {entry.isCollected ? entry.name : '???'}
                </h3>
                <p className={`text-xs mt-1 ${entry.isCollected ? 'text-gray-600' : 'text-gray-400'}`}>
                  {entry.isCollected ? entry.category : 'Unknown'}
                </p>
                {entry.isCollected && entry.dateObtained && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(entry.dateObtained).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {collectedCount === imageDatabase.length && (
          <div className="mt-8 text-center p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
            <Star className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">🎉 Pokédex Complete! 🎉</h3>
            <p className="text-gray-600">Congratulations! You've collected all {imageDatabase.length} images!</p>
          </div>
        )}
      </>
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6">
            {/* Header with view toggle */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {collectionView === 'obtained' ? 'Your Collection' : 'Image Pokédex'}
                </h2>
                <p className="text-gray-600">
                  Collected: {collectedCount}/{imageDatabase.length} ({Math.round((collectedCount / imageDatabase.length) * 100)}%)
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setCollectionView('obtained')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      collectionView === 'obtained'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    📖 Obtained
                  </button>
                  <button
                    onClick={() => setCollectionView('pokedex')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      collectionView === 'pokedex'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    📚 Pokédex
                  </button>
                </div>
                
                <button
                  onClick={() => setCurrentView('home')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Home className="h-5 w-5" />
                  <span>Back to Home</span>
                </button>
              </div>
            </div>

            {/* Content based on view */}
            {collectionView === 'obtained' ? <ObtainedView /> : <PokedexView />}
          </div>
        </div>
      </div>
    );
  };

  // Image detail modal with fullscreen option
  const ImageDetailModal = () => {
    if (!selectedImage) return null;

    // Fullscreen view
    if (isFullscreen) {
      return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Fullscreen image */}
          <img
            src={selectedImage.url || selectedImage.imageUrl}
            alt={selectedImage.name || selectedImage.imageName}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              e.target.src = 'https://picsum.photos/800/400?text=Not+Found';
            }}
          />
          
          {/* Fullscreen controls */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={() => setIsFullscreen(false)}
              className="bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-75 transition-all"
              title="Exit Fullscreen"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9V4.5M15 9h4.5M15 9l5.25-5.25M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 15v4.5M15 15h4.5M15 15l5.25 5.25" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedImage(null)}
              className="bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-75 transition-all"
              title="Close"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Optional: Image info overlay */}
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
            <h3 className="font-bold">{selectedImage.name || selectedImage.imageName}</h3>
            <p className="text-sm opacity-75">{selectedImage.rarity} • {selectedImage.category}</p>
          </div>
        </div>
      );
    }

    // Regular modal view
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="relative bg-gray-900 overflow-hidden">
            {/* Blurred background */}
            <img
              src={selectedImage.url || selectedImage.imageUrl}
              alt=""
              className="absolute inset-0 w-full h-96 object-cover filter blur-lg scale-110 opacity-50"
            />
            {/* Main image */}
            <img
              src={selectedImage.url || selectedImage.imageUrl}
              alt={selectedImage.name || selectedImage.imageName}
              className="relative w-full h-96 object-contain z-10"
              onError={(e) => {
                e.target.src = 'https://picsum.photos/800/400?text=Not+Found';
              }}
            />
            
            {/* Top controls */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => setIsFullscreen(true)}
                className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all z-20"
                title="View Fullscreen"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              </button>
              <button
                onClick={() => setSelectedImage(null)}
                className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all z-20"
                title="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{selectedImage.name || selectedImage.imageName}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRarityColor(selectedImage.rarity)}`}>
                {selectedImage.rarity}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4 text-lg">{selectedImage.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Category:</span>
                <span className="font-medium text-purple-600">{selectedImage.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Rarity:</span>
                <span className="font-medium">{selectedImage.rarity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Obtained:</span>
                <span className="font-medium">{new Date(selectedImage.dateObtained).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time:</span>
                <span className="font-medium">{new Date(selectedImage.dateObtained).toLocaleTimeString()}</span>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsFullscreen(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
                <span>View Fullscreen</span>
              </button>
              <button
                onClick={() => setSelectedImage(null)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // New image modal - EPIC VERSION!
  const NewImageModal = () => {
    // Stop shaking after component mounts
    useEffect(() => {
      if (showNewImage && todaysImage) {
        const timer = setTimeout(() => {
          setShakeAnimation(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }, [showNewImage, todaysImage]);

    return showNewImage && todaysImage ? (
      <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center p-2 z-50">
        <div className="relative w-full max-w-6xl h-full max-h-screen flex flex-col overflow-hidden">
          {/* Epic card reveal animation */}
          <div className="relative flex-1 flex flex-col min-h-0">
            {/* Card container with shake animation */}
            <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 p-2 rounded-2xl shadow-2xl flex-1 flex flex-col min-h-0">
              <div className="bg-white rounded-xl overflow-hidden shadow-inner flex-1 flex flex-col min-h-0">
                {/* Rarity glow effect */}
                <div className={`absolute inset-0 rounded-xl pointer-events-none ${
                  todaysImage.rarity === 'Legendary' ? 'animate-ping bg-yellow-400 opacity-20' :
                  todaysImage.rarity === 'Epic' ? 'animate-ping bg-purple-400 opacity-20' :
                  todaysImage.rarity === 'Rare' ? 'animate-ping bg-blue-400 opacity-20' :
                  'animate-ping bg-gray-400 opacity-20'
                }`}></div>
                
                {/* Image container - responsive height */}
                <div className="relative bg-gray-900 overflow-hidden flex-1 min-h-0">
                  {/* Animated background */}
                  <img
                    src={todaysImage.url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-110 opacity-30 animate-pulse"
                  />
                  {/* Main epic image - conditional shake with proper class */}
                  <img
                    src={todaysImage.url}
                    alt={todaysImage.name}
                    className={`relative w-full h-full object-contain z-10 transition-all duration-1000 ${shakeAnimation ? 'animate-shake' : ''}`}
                  />
                  
                  {/* Floating particles effect */}
                  <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce opacity-70"></div>
                  <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                  <div className="absolute bottom-6 left-6 w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-300"></div>
                  <div className="absolute bottom-4 right-4 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping delay-500"></div>
                  
                  {/* Shake indicator - shows countdown */}
                  {shakeAnimation && (
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs animate-pulse">
                      ✨ Epic Reveal! ✨
                    </div>
                  )}
                </div>
                
                {/* Compact Epic content - fixed height, scrollable if needed */}
                <div className="flex-shrink-0 p-3 text-center bg-gradient-to-b from-white to-gray-50 max-h-48 overflow-y-auto">
                  {/* Compact announcement */}
                  <div className="mb-2">
                    <div className="text-2xl mb-1 animate-bounce">
                      {todaysImage.rarity === 'Legendary' ? '👑' :
                       todaysImage.rarity === 'Epic' ? '💎' :
                       todaysImage.rarity === 'Rare' ? '⭐' : '✨'}
                    </div>
                    <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-1">
                      {todaysImage.rarity === 'Legendary' ? 'LEGENDARY!' :
                       todaysImage.rarity === 'Epic' ? 'EPIC!' :
                       todaysImage.rarity === 'Rare' ? 'RARE!' : 'NEW!'}
                    </h3>
                  </div>
                  
                  {/* Compact image details */}
                  <h4 className="font-bold text-lg text-gray-800 mb-2 truncate">{todaysImage.name}</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                    todaysImage.rarity === 'Legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                    todaysImage.rarity === 'Epic' ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white' :
                    todaysImage.rarity === 'Rare' ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white' :
                    'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                  }`}>
                    {todaysImage.rarity}
                  </span>
                  
                  {/* Compact button */}
                  <button
                    onClick={() => setShowNewImage(false)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-full text-sm shadow-lg transform hover:scale-105 transition-all"
                  >
                    🎉 Add to Collection!
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background effects */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-400 rounded-full opacity-20 animate-ping pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-purple-400 rounded-full opacity-20 animate-ping delay-700 pointer-events-none"></div>
        </div>
      </div>
    ) : null;
  };

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div>
      {currentView === 'home' && <HomeScreen />}
      {currentView === 'collection' && <CollectionScreen />}
      <NewImageModal />
      <ImageDetailModal />
    </div>
  );
};

export default DailyImageCollector;