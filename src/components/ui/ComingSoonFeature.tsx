import React from 'react';
import { Construction } from 'lucide-react';

export default function ComingSoonFeature({ title, description }: { title: string, description: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-gray-800 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                <Construction size={32} className="text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">{description}</p>
        </div>
    );
}
