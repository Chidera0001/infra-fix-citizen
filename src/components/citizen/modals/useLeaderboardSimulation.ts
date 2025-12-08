import { useState, useRef } from 'react';
import {
  triggerConfettiShower,
  triggerConfettiFromElement,
} from '@/utils/confetti';
import type { LeaderboardEntry } from './useLeaderboardData';

interface UseLeaderboardSimulationProps {
  leaderboard: LeaderboardEntry[];
  currentProfileId: string | undefined;
  userCardRef: React.RefObject<HTMLDivElement>;
}

/**
 * Hook for leaderboard simulation (testing animations)
 * To disable: Simply don't use this hook or set ENABLE_SIMULATION = false
 */
const ENABLE_SIMULATION = false; // Set to false to completely disable simulation

export const useLeaderboardSimulation = ({
  leaderboard,
  currentProfileId,
  userCardRef,
}: UseLeaderboardSimulationProps) => {
  const [simulatedRank, setSimulatedRank] = useState<number | null>(null);
  const [simulatedLeaderboard, setSimulatedLeaderboard] = useState<
    LeaderboardEntry[] | null
  >(null);
  const previousRankRef = useRef<number | null>(null);

  // Helper function to create a leaderboard with user at a specific position
  const createLeaderboardAtPosition = (
    targetRank: number,
    userEntry: LeaderboardEntry
  ): LeaderboardEntry[] => {
    const modifiedLeaderboard = [...leaderboard];
    const currentUserIndex = modifiedLeaderboard.findIndex(
      entry => entry.userId === currentProfileId
    );

    if (currentUserIndex >= 0) {
      modifiedLeaderboard.splice(currentUserIndex, 1);
    }

    const insertIndex = Math.min(targetRank - 1, modifiedLeaderboard.length);
    modifiedLeaderboard.splice(insertIndex, 0, {
      ...userEntry,
      rank: targetRank,
    });

    return modifiedLeaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  };

  // Test function to simulate moving from position 5 to #1
  const simulateReachingFirst = () => {
    if (!ENABLE_SIMULATION || !currentProfileId) return;

    const currentUserEntry = leaderboard.find(
      entry => entry.userId === currentProfileId
    );

    if (!currentUserEntry) return;

    const startRank = 5;
    previousRankRef.current = startRank;

    // Set initial position at 5
    const leaderboardAt5 = createLeaderboardAtPosition(5, currentUserEntry);
    setSimulatedLeaderboard(leaderboardAt5);
    setSimulatedRank(5);

    // Animate through positions: 5 -> 4 -> 3 -> 2 -> 1
    const positions = [4, 3, 2, 1];
    const delayBetweenPositions = 600;
    let currentDelay = 800;

    positions.forEach(targetRank => {
      setTimeout(() => {
        const leaderboardAtPosition = createLeaderboardAtPosition(
          targetRank,
          currentUserEntry
        );
        setSimulatedLeaderboard(leaderboardAtPosition);
        setSimulatedRank(targetRank);

        if (targetRank === 1) {
          triggerConfettiShower(4000);
          if (userCardRef.current) {
            setTimeout(() => {
              triggerConfettiFromElement(userCardRef.current!);
            }, 500);
          }
        }
      }, currentDelay);
      currentDelay += delayBetweenPositions;
    });

    // Reset after animation
    setTimeout(() => {
      setSimulatedRank(null);
      setSimulatedLeaderboard(null);
      previousRankRef.current = null;
    }, currentDelay + 2000);
  };

  // Test function to simulate moving down (e.g., from 3rd to 10th)
  const simulateRankDown = () => {
    if (!ENABLE_SIMULATION || !currentProfileId) return;

    const currentUserEntry = leaderboard.find(
      entry => entry.userId === currentProfileId
    );

    if (!currentUserEntry) return;

    const startRank = 3;
    previousRankRef.current = startRank;

    // Set initial position at 3
    const leaderboardAt3 = createLeaderboardAtPosition(3, currentUserEntry);
    setSimulatedLeaderboard(leaderboardAt3);
    setSimulatedRank(3);

    // Animate through positions: 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10
    const positions = [4, 5, 6, 7, 8, 9, 10];
    const delayBetweenPositions = 500;
    let currentDelay = 800;

    positions.forEach(targetRank => {
      setTimeout(() => {
        const leaderboardAtPosition = createLeaderboardAtPosition(
          targetRank,
          currentUserEntry
        );
        setSimulatedLeaderboard(leaderboardAtPosition);
        setSimulatedRank(targetRank);
      }, currentDelay);
      currentDelay += delayBetweenPositions;
    });

    // Reset after animation
    setTimeout(() => {
      setSimulatedRank(null);
      setSimulatedLeaderboard(null);
      previousRankRef.current = null;
    }, currentDelay + 2000);
  };

  return {
    simulatedRank,
    simulatedLeaderboard,
    simulateReachingFirst,
    simulateRankDown,
    previousRankRef,
    isSimulationEnabled: ENABLE_SIMULATION,
  };
};
