// src/components/LazyImage.jsx
// Lazy loads images with blur-up effect

import { useState, useRef, useEffect } from 'react';

function LazyImage({
    src,
    alt,
    width = '100%',
    height = '100%',
    fallback = '🏢',
    style = {},
}) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [visible, setVisible] = useState(false);
    const imgRef = useRef(null);

    // Intersection Observer — only load when image enters viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                    // stop observing once visible
                }
            },
            { threshold: 0.1 }
            // trigger when 10% of image is visible
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
        // cleanup on unmount
    }, []);

    return (
        <div
            ref={imgRef}
            style={{
                width,
                height,
                background: '#f3f4f6',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                ...style,
            }}
        >
            {/* Show image once visible in viewport */}
            {visible && !error && src && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: loaded ? 1 : 0,
                        // fade in when loaded
                        transition: 'opacity 0.3s ease',
                        position: 'absolute',
                        inset: 0,
                    }}
                />
            )}

            {/* Placeholder — emoji if no image or error */}
            {(!loaded || error || !src) && (
                <span style={{ fontSize: '32px' }}>{fallback}</span>
            )}
        </div>
    );
}

export default LazyImage;