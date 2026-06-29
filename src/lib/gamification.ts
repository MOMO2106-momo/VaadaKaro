export interface Level {
    name: string;
    minPoints: number;
}

export const GAMIFICATION_LEVELS: Level[] = [
    { name: "Novice Citizen", minPoints: 0 },
    { name: "Active Voice", minPoints: 100 },
    { name: "Community Guardian", minPoints: 500 },
    { name: "Civic Leader", minPoints: 1500 },
    { name: "Regional Champion", minPoints: 3000 },
];

export function getLevelFromPoints(points: number): Level {
    for (let i = GAMIFICATION_LEVELS.length - 1; i >= 0; i--) {
        if (points >= GAMIFICATION_LEVELS[i].minPoints) {
            return GAMIFICATION_LEVELS[i];
        }
    }
    return GAMIFICATION_LEVELS[0];
}

export function getNextLevelInfo(points: number) {
    const currentLevel = getLevelFromPoints(points);
    const currentIndex = GAMIFICATION_LEVELS.findIndex(l => l.name === currentLevel.name);

    if (currentIndex === GAMIFICATION_LEVELS.length - 1) {
        return { isMaxLevel: true, nextLevelName: "Max", pointsRequired: 0, progress: 100 };
    }

    const nextLevel = GAMIFICATION_LEVELS[currentIndex + 1];
    const pointsRequired = nextLevel.minPoints;
    const progress = Math.min(100, Math.max(0, ((points - currentLevel.minPoints) / (pointsRequired - currentLevel.minPoints)) * 100));

    return {
        isMaxLevel: false,
        nextLevelName: nextLevel.name,
        pointsRequired,
        progress
    };
}
