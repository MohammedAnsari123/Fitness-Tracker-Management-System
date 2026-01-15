import React from 'react';
import { Award, Lock } from 'lucide-react';

const BadgeShowcase = ({ badges }) => {
    const allBadgesDefinitions = [
        { name: 'First Step', description: 'Complete your first workout', icon: '🥇' },
        { name: 'Consistency King', description: 'Reach a 7-day streak', icon: '🔥' },
        { name: 'Heavy Lifter', description: 'Lift over 1000kg in volume', icon: '🏋️' },
        { name: 'Centurion', description: 'Log 100 workouts', icon: '💯' },
        { name: 'Early Bird', description: 'Workout before 8 AM', icon: '🌅' },
    ];

    const hasBadge = (badgeName) => badges?.some(b => b.name === badgeName);

    const getEarnedDetails = (badgeName) => badges?.find(b => b.name === badgeName);

    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Award className="text-purple-600" />
                <span>Achievements</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {allBadgesDefinitions.map((def, idx) => {
                    const earned = hasBadge(def.name);
                    const earnedDate = earned ? new Date(getEarnedDetails(def.name).earnedDate).toLocaleDateString() : null;

                    return (
                        <div
                            key={idx}
                            className={`relative p-4 rounded-xl border-2 text-center transition-all group ${earned
                                    ? 'bg-purple-50 border-purple-200 shadow-sm'
                                    : 'bg-slate-50 border-slate-100 opacity-60 grayscale'
                                }`}
                        >
                            <div className="text-4xl mb-2">{def.icon}</div>
                            <h4 className={`font-bold text-sm ${earned ? 'text-slate-800' : 'text-slate-500'}`}>
                                {def.name}
                            </h4>

                            {!earned && (
                                <div className="absolute top-2 right-2 text-slate-400">
                                    <Lock size={14} />
                                </div>
                            )}

                            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs p-2 rounded-lg -top-12 left-1/2 -translate-x-1/2 w-32 pointer-events-none z-10 shadow-lg">
                                <p>{def.description}</p>
                                {earned && <p className="text-purple-300 mt-1">Earned: {earnedDate}</p>}
                                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 rotate-45"></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {badges?.length === 0 && (
                <p className="text-center text-slate-500 text-sm mt-4">Start working out to unlock achievements!</p>
            )}
        </div>
    );
};

export default BadgeShowcase;
