import { createAvatar } from '@dicebear/core';
import { bigSmile } from '@dicebear/collection';

// Generate a DiceBear avatar URL from user ID (consistent for same user)
export const generateAvatarUrl = (userId: string): string => {
  const avatar = createAvatar(bigSmile, {
    seed: userId,
    size: 128,
    backgroundColor: [
      'b6e3f4',
      'c0aede',
      'd1d4f9',
      'ffd5dc',
      'ffdfbf',
      'a8e6cf',
      'ffd3b6',
      'ffaaa5',
      'c7ceea',
      'ffb3ba',
    ],
  });
  return avatar.toDataUri();
};

// Cool username generators
const coolAdjectives = [
  'Swift',
  'Bold',
  'Noble',
  'Brave',
  'Wise',
  'Bright',
  'Sharp',
  'Quick',
  'Mighty',
  'Clever',
  'Fierce',
  'Calm',
  'Wild',
  'Smooth',
  'Rapid',
  'Steady',
  'Vivid',
  'Crisp',
  'Neon',
  'Cosmic',
  'Stellar',
  'Lunar',
  'Solar',
  'Aurora',
  'Thunder',
  'Storm',
  'Blaze',
  'Frost',
  'Shadow',
  'Light',
  'Crystal',
  'Diamond',
];

const coolNouns = [
  'Phoenix',
  'Eagle',
  'Wolf',
  'Lion',
  'Tiger',
  'Dragon',
  'Falcon',
  'Hawk',
  'Panther',
  'Jaguar',
  'Raven',
  'Bear',
  'Shark',
  'Fox',
  'Deer',
  'Elk',
  'Stag',
  'Horse',
  'Stallion',
  'Mare',
  'Bull',
  'Ram',
  'Goat',
  'Sheep',
  'Cat',
  'Dog',
  'Puppy',
  'Kitten',
  'Cub',
  'Calf',
  'Foal',
  'Kit',
];

// Generate a cool username from user ID (deterministic)
export const generateCoolUsername = (userId: string): string => {
  // Use userId as seed for consistent username generation
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash + userId.charCodeAt(i)) | 0;
  }

  const adjIndex = Math.abs(hash) % coolAdjectives.length;
  const nounIndex = Math.abs(hash >> 8) % coolNouns.length;

  return `${coolAdjectives[adjIndex]}${coolNouns[nounIndex]}`;
};

// Get rank icon component
export const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return null;
  }
};
