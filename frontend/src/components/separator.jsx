import React from "react";

export const Separator = () => {
    return (
        <div className="relative">
            <div className="absolute inset-0 flex items-center text-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-4 text-gray-900 bg-white dark:bg-gray-300">
                    Or
                </span>
            </div>
        </div>
    );
};