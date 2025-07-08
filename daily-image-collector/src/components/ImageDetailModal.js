// src/components/ImageDetailModal.js

import React from 'react';
import { getRarityColor } from '../utils/helpers';

const ImageDetailModal = ({ selectedImage, setSelectedImage, isFullscreen, setIsFullscreen }) => {
  if (!selectedImage) return null;

  const handleClose = () => {
    setIsFullscreen(false); // Always exit fullscreen when closing
    setSelectedImage(null);
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <img
          src={selectedImage.url || selectedImage.imageUrl}
          alt={selectedImage.name || selectedImage.imageName}
          className="max-w-full max-h-full object-contain"
          onError={(e) => { e.target.src = 'https://picsum.photos/800/400?text=Not+Found'; }}
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <button onClick={() => setIsFullscreen(false)} className="bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-75 transition-all" title="Exit Fullscreen">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9V4.5M15 9h4.5M15 9l5.25-5.25M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 15v4.5M15 15h4.5M15 15l5.25 5.25" /></svg>
          </button>
          <button onClick={handleClose} className="bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-75 transition-all" title="Close">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
          <h3 className="font-bold">{selectedImage.name || selectedImage.imageName}</h3>
          <p className="text-sm opacity-75">{selectedImage.rarity} • {selectedImage.category}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="relative bg-gray-900 overflow-hidden">
          <img src={selectedImage.url || selectedImage.imageUrl} alt="" className="absolute inset-0 w-full h-96 object-cover filter blur-lg scale-110 opacity-50" />
          <img
            src={selectedImage.url || selectedImage.imageUrl}
            alt={selectedImage.name || selectedImage.imageName}
            className="relative w-full h-96 object-contain z-10"
            onError={(e) => { e.target.src = 'https://picsum.photos/800/400?text=Not+Found'; }}
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            <button onClick={() => setIsFullscreen(true)} className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all z-20" title="View Fullscreen">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" /></svg>
            </button>
            <button onClick={handleClose} className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all z-20" title="Close">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{selectedImage.name || selectedImage.imageName}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRarityColor(selectedImage.rarity)}`}>{selectedImage.rarity}</span>
          </div>
          <p className="text-gray-600 mb-4 text-lg">{selectedImage.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Category:</span><span className="font-medium text-purple-600">{selectedImage.category}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Rarity:</span><span className="font-medium">{selectedImage.rarity}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Obtained:</span><span className="font-medium">{new Date(selectedImage.dateObtained).toLocaleDateString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Time:</span><span className="font-medium">{new Date(selectedImage.dateObtained).toLocaleTimeString()}</span></div>
          </div>
          <div className="flex space-x-3 mt-6">
            <button onClick={() => setIsFullscreen(true)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" /></svg>
              <span>View Fullscreen</span>
            </button>
            <button onClick={handleClose} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetailModal;