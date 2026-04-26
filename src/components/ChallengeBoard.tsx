import React from 'react';
import { Trophy, Users, Zap } from 'lucide-react';
import { SystemCard, SystemButton, LegendaryTitle } from './SystemUI';

export const ChallengeBoard = () => {
    return (
        <SystemCard className="space-y-6">
            <div className="flex justify-between items-center">
                <LegendaryTitle className="text-xl">Competitive Challenges</LegendaryTitle>
                <SystemButton onClick={() => alert("Firebase setup required for real-time challenges!")}>
                    <Zap size={14} className="mr-2"/>
                    Challenge Friend
                </SystemButton>
            </div>
            <div className="text-neutral-500 font-mono text-sm py-12 text-center">
                No active challenges. Set up Firebase to challenge your friends in real-time.
            </div>
        </SystemCard>
    );
};
