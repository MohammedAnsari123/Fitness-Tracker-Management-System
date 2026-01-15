import React from 'react';
import { Flame, Calendar } from 'lucide-react';

const StreakCounter = ({ streak }) => {
    const currentStreak = streak?.current || 0;
    const lastLogDate = streak?.lastLogDate ? new Date(streak.lastLogDate).toLocaleDateString() : 'Never';

    return (
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl p-6 shadow-lg transform hover:scale-[1.02] transition-transform">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium opacity-90 mb-1">Current Streak</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-5xl font-bold">{currentStreak}</span>
                        <span className="text-xl mb-1 opacity-90">days</span>
                    </div>
                    <p className="text-xs mt-2 opacity-75 flex items-center gap-1">
                        <Calendar size={12} /> Last valid workout: {lastLogDate}
                    </p>
                </div>
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm animate-pulse">
                    <Flame size={40} className="text-yellow-200" fill="currentColor" />
                </div>
            </div>
        </div>
    );
};

export default StreakCounter;
