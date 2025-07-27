import { useEffect, useState } from 'react';

function StreakCounter({ streak }) {
    return (
        <div className="flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 shadow">
            <div className="mr-3">
                <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
 <path 
fillRule="evenodd" 
 d="M11.707 4.293a1 1 0 010 1.414L9.414 8l2.293 2.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
/>
<path 
 fillRule="evenodd" 
 d="M4 8a1 1 0 011-1h6a1 1 0 110 2H5a1 1 0 01-1-1z" 
clipRule="evenodd" 
                    />
<path 
                  fillRule="evenodd" 
                d="M8 16a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L5.707 8.293a1 1 0 00-1.414 1.414L7.586 12l-3.293 3.293a1 1 0 101.414 1.414L9 13.414V17a1 1 0 102 0v-3.586l2.293 2.293a1 1 0 001.414-1.414L10.414 12l3.293-3.293a1 1 0 00-1.414-1.414L11 10.586V7z"                     clipRule="evenodd" 
                    />
                </svg>
            </div>
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Current Streak</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-yellow-400">
                    {streak || 0} {streak === 1 ? 'day' : 'days'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Keep solving to maintain your streak!
                </p>
            </div>
        </div>
    );
}

export default StreakCounter;