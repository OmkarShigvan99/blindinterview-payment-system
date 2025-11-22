'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Feature {
    id: string;
    shortcut: string;
    icon: string;
    title: string;
    description: string;
    color: string;
}

interface FeatureCardProps {
    feature: Feature;
    isActive: boolean;
    onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, isActive, onClick }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`relative overflow-hidden rounded-xl border cursor-pointer transition-all duration-300 ${
                isActive
                    ? 'border-white/50 shadow-2xl shadow-white/20'
                    : 'border-white/20 hover:border-white/40'
            }`}
            onClick={onClick}
        >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20`} />

            {/* Glass Effect */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

            {/* Content */}
            <div className="relative p-6 text-white">
                {/* Icon and Shortcut */}
                <div className="flex items-center justify-between mb-4">
                    <motion.div
                        animate={isActive ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl"
                    >
                        {feature.icon}
                    </motion.div>
                    <div className="text-xs font-mono bg-black/40 px-2 py-1 rounded border border-white/20">
                        {feature.shortcut}
                    </div>
                </div>

                {/* Title and Description */}
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{feature.description}</p>

                {/* Active Indicator */}
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-full h-full bg-green-400 rounded-full opacity-60"
                        />
                    </motion.div>
                )}
            </div>

            {/* Hover Effect */}
            <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 transition-opacity duration-300`}
                whileHover={{ opacity: 0.1 }}
            />
        </motion.div>
    );
};

export default FeatureCard;
