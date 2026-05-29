// src/components/SearchInput.jsx
// Advanced search with autocomplete + history dropdown

import useSearch from '../hooks/useSearch.js';

function SearchInput({ onSearch, placeholder = 'Search jobs, skills...' }) {
    const {
        query,
        setQuery,
        suggestions,
        showDropdown,
        setShowDropdown,
        history,
        clearHistory,
        removeFromHistory,
        handleSearch,
        handleSuggestionClick,
        inputRef,
    } = useSearch(onSearch);

    const showHistory = !query && history.length > 0;
    const showSuggestions = query && suggestions.length > 0;
    const showDropdownAny = showDropdown && (showHistory || showSuggestions);

    return (
        <div className="relative w-full" ref={inputRef}>

            {/* Search Input */}
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    🔍
                </span>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                        if (e.key === 'Escape') setShowDropdown(false);
                    }}
                    placeholder={placeholder}
                    className="w-full pl-11 pr-10 py-3 border border-gray-200
                     rounded-xl text-sm outline-none focus:border-blue-500
                     focus:ring-2 focus:ring-blue-100 bg-white
                     transition-all duration-200"
                />

                {/* Clear button */}
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            onSearch('');
                            setShowDropdown(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2
                       text-gray-400 hover:text-gray-600 text-lg
                       transition-colors leading-none"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {showDropdownAny && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white
                        border border-gray-100 rounded-xl shadow-lg z-50
                        overflow-hidden animate-fade-in">

                    {/* Search History */}
                    {showHistory && (
                        <div>
                            <div className="flex items-center justify-between
                              px-4 py-2 border-b border-gray-50">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Recent Searches
                                </span>
                                <button
                                    onClick={clearHistory}
                                    className="text-xs text-red-400 hover:text-red-600
                             font-medium transition-colors"
                                >
                                    Clear all
                                </button>
                            </div>
                            {history.map((term, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between px-4 py-2.5
                             hover:bg-gray-50 cursor-pointer group
                             transition-colors duration-150"
                                >
                                    <button
                                        onClick={() => handleSuggestionClick(term)}
                                        className="flex items-center gap-3 flex-1 text-left"
                                    >
                                        <span className="text-gray-400 text-sm">🕒</span>
                                        <span className="text-sm text-gray-700">{term}</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFromHistory(term);
                                        }}
                                        className="text-gray-300 hover:text-gray-500 opacity-0
                               group-hover:opacity-100 transition-all ml-2"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Skill Suggestions */}
                    {showSuggestions && (
                        <div>
                            <div className="px-4 py-2 border-b border-gray-50">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Suggestions
                                </span>
                            </div>
                            {suggestions.map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5
                             hover:bg-blue-50 text-left transition-colors duration-150"
                                >
                                    <span className="text-blue-400 text-sm">🔍</span>
                                    <span className="text-sm text-gray-700">
                                        {/* Highlight matching part */}
                                        <span className="font-semibold text-blue-600">
                                            {suggestion.substring(0, query.length)}
                                        </span>
                                        {suggestion.substring(query.length)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Search current query */}
                    {query && (
                        <button
                            onClick={() => handleSearch()}
                            className="w-full flex items-center gap-3 px-4 py-3
                         bg-blue-50 hover:bg-blue-100 text-left
                         transition-colors duration-150 border-t border-gray-50"
                        >
                            <span className="text-blue-500 text-sm">🔍</span>
                            <span className="text-sm font-medium text-blue-700">
                                Search for "<strong>{query}</strong>"
                            </span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchInput;