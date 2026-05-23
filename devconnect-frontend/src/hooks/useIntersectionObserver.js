// src/hooks/useIntersectionObserver.js
// Detects when element enters/leaves viewport
// Used for: lazy loading, infinite scroll, animations

import { useState, useEffect, useRef } from 'react';

function useIntersectionObserver(options = {}) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: options.threshold ?? 0.1,
                rootMargin: options.rootMargin ?? '0px',
            }
        );

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    return [ref, isVisible];
}

export default useIntersectionObserver;

// USAGE:
// const [ref, isVisible] = useIntersectionObserver();
// <div ref={ref}>
//   {isVisible && <ExpensiveComponent />}
// </div>