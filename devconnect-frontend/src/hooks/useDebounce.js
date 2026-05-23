// src/hooks/useDebounce.js
// WHY: search input fires on every keystroke
// Without debounce — API called on every letter typed
// With debounce — API called only after user stops typing

import { useState, useEffect } from 'react';

function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set timer — update debounced value after delay
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup — cancel timer if value changes before delay
        return () => clearTimeout(timer);
        // If user types 'R', 'e', 'a', 'c', 't' quickly:
        // Each keystroke cancels previous timer
        // Only last value 'React' fires after 500ms
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;