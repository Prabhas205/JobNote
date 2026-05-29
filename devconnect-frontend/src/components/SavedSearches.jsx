// src/components/SavedSearches.jsx
import { useState } from 'react';

const SAVED_KEY = 'devconnect_saved_searches';

function SavedSearches({ currentFilters, onApplySearch }) {
    const [savedSearches, setSavedSearches] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(SAVED_KEY) ?? '[]');
        } catch {
            return [];
        }
    });
    const [showSaved, setShowSaved] = useState(false);

    // ─── Save current search ───
    const saveCurrentSearch = () => {
        const hasFilters = Object.values(currentFilters)
            .some(v => v && v !== 1);
        // check if any filter is active

        if (!hasFilters) {
            alert('Apply some filters first to save a search!');
            return;
        }

        const name = prompt(
            'Name this search:',
            currentFilters.search || 'My Search'
        );
        if (!name) return;

        const newSearch = {
            id: Date.now(),
            name,
            filters: { ...currentFilters },
            savedAt: new Date().toISOString(),
        };

        const updated = [newSearch, ...savedSearches].slice(0, 5);
        // max 5 saved searches
        setSavedSearches(updated);
        localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
        alert(`✅ Search "${name}" saved!`);
    };

    // ─── Delete saved search ───
    const deleteSearch = (id) => {
        const updated = savedSearches.filter(s => s.id !== id);
        setSavedSearches(updated);
        localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    };

    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                {/* Save button */}
                <button
                    onClick={saveCurrentSearch}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm
                     font-medium text-gray-600 border border-gray-200
                     rounded-lg hover:bg-gray-50 transition-colors"
                >
                    🔖 Save Search
                </button>

                {/* View saved */}
                {savedSearches.length > 0 && (
                    <button
                        onClick={() => setShowSaved(!showSaved)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm
                       font-medium text-blue-600 bg-blue-50 rounded-lg
                       hover:bg-blue-100 transition-colors"
                    >
                        📋 Saved ({savedSearches.length})
                    </button>
                )}
            </div>

            {/* Saved searches dropdown */}
            {showSaved && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowSaved(false)}
                    />
                    <div className="absolute top-12 right-0 w-72 bg-white
                          border border-gray-100 rounded-xl shadow-lg
                          z-50 overflow-hidden animate-fade-in">
                        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50">
                            <h3 className="text-sm font-bold text-gray-900">
                                Saved Searches
                            </h3>
                        </div>
                        {savedSearches.map(search => (
                            <div
                                key={search.id}
                                className="flex items-center justify-between px-4 py-3
                           hover:bg-gray-50 border-b border-gray-50
                           transition-colors"
                            >
                                <button
                                    onClick={() => {
                                        onApplySearch(search.filters);
                                        setShowSaved(false);
                                    }}
                                    className="flex-1 text-left"
                                >
                                    <p className="text-sm font-semibold text-gray-900">
                                        {search.name}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {Object.entries(search.filters)
                                            .filter(([k, v]) => v && k !== 'page')
                                            .map(([k, v]) => `${k}: ${v}`)
                                            .join(' · ')}
                                    </p>
                                </button>
                                <button
                                    onClick={() => deleteSearch(search.id)}
                                    className="text-gray-300 hover:text-red-500
                             transition-colors ml-3 text-lg leading-none"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default SavedSearches;