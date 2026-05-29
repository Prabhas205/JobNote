// src/hooks/useSearch.js
// Advanced search with debounce + suggestions + history

import { useState, useEffect, useCallback, useRef } from 'react';
import useDebounce from './useDebounce.js';

const SEARCH_HISTORY_KEY = 'devconnect_search_history';
const MAX_HISTORY = 8;

function useSearch(onSearch) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [history, setHistory] = useState(() => {
        // Load saved history from localStorage on mount
        try {
            const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const debouncedQuery = useDebounce(query, 400);
    const inputRef = useRef(null);

    // Popular skills for suggestions
    const POPULAR_SKILLS = [
        'React', 'Node.js', 'MongoDB', 'Express', 'JavaScript',
        'TypeScript', 'Python', 'AWS', 'Docker', 'GraphQL',
        'Vue.js', 'Angular', 'PostgreSQL', 'Redis', 'Kubernetes',
        'Java', 'Spring Boot', 'Flutter', 'React Native', 'Next.js',
    ];

    // ─── Generate suggestions from query ───
    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setSuggestions([]);
            return;
        }

        const filtered = POPULAR_SKILLS
            .filter(skill =>
                skill.toLowerCase().startsWith(debouncedQuery.toLowerCase()) &&
                skill.toLowerCase() !== debouncedQuery.toLowerCase()
            )
            .slice(0, 5);
        // only show top 5 suggestions

        setSuggestions(filtered);
    }, [debouncedQuery]);

    // ─── Save search to history ───
    const saveToHistory = useCallback((term) => {
        if (!term.trim()) return;

        setHistory(prev => {
            const updated = [
                term,
                ...prev.filter(h => h.toLowerCase() !== term.toLowerCase()),
                // remove duplicate if exists
            ].slice(0, MAX_HISTORY);
            // keep only last 8 searches

            localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    // ─── Clear history ───
    const clearHistory = useCallback(() => {
        setHistory([]);
        localStorage.removeItem(SEARCH_HISTORY_KEY);
    }, []);

    // ─── Remove one history item ───
    const removeFromHistory = useCallback((term) => {
        setHistory(prev => {
            const updated = prev.filter(h => h !== term);
            localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    // ─── Handle search submit ───
    const handleSearch = useCallback((term = query) => {
        if (!term.trim()) return;
        saveToHistory(term.trim());
        setShowDropdown(false);
        setQuery(term);
        onSearch(term.trim());
    }, [query, saveToHistory, onSearch]);

    // ─── Handle suggestion click ───
    const handleSuggestionClick = useCallback((suggestion) => {
        setQuery(suggestion);
        handleSearch(suggestion);
    }, [handleSearch]);

    // ─── Close dropdown on outside click ───
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return {
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
        debouncedQuery,
    };
}

export default useSearch;