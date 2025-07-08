// src/utils/helpers.js

export const getRarityColor = (rarity) => {
  switch (rarity) {
    case 'Common': return 'text-gray-600 bg-gray-100 border-gray-300';
    case 'Rare': return 'text-blue-600 bg-blue-100 border-blue-300';
    case 'Epic': return 'text-purple-600 bg-purple-100 border-purple-300';
    case 'Legendary': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    default: return 'text-gray-600 bg-gray-100 border-gray-300';
  }
};