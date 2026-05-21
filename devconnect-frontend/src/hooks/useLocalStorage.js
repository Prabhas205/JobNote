import { useState } from "react";

function useLocalStorage(key, initialValue) {

    const [storedValue, setStoredValue] = useState(() => {


        try {
            const item = localStorage.getItem(key);

            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('useLocalStorage read error:', error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {

            const valueToStore = value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);
            localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('UseLocalStorage write error:', error);
        }
    };

    const removeValue = () => {

        setStoredValue(null);
        localStorage.removeItem(key);
    };

    return [storedValue, setValue, removeValue];
}


export default useLocalStorage;