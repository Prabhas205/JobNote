// src/components/ScrollToTop.jsx
// Shows a button when user scrolls down — click to go back to top
import { useState, useEffect } from 'react';

function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show button when scrolled more than 300px
            setVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);

        // CLEANUP — remove listener when component unmounts
        return () => window.removeEventListener('scroll', handleScroll);

    }, []); // add listener once on mount

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Don't render if not visible
    if (!visible) return null;

    return (
        <button
            onClick={scrollToTop}
            style={{
                position: 'fixed',
                bottom: '32px',
                right: '32px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                fontSize: '20px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            ↑
        </button>
    );
}

export default ScrollToTop;