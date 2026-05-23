// src/utils/performance.js
// Measure component render time in development

export function measureRender(componentName, fn) {
    if (!import.meta.env.DEV) return fn();
    // only measure in development

    const start = performance.now();
    const result = fn();
    const end = performance.now();

    console.log(`[Perf] ${componentName} rendered in ${(end - start).toFixed(2)}ms`);
    return result;
}

// Web Vitals — measure real user experience
export function reportWebVitals() {
    if ('PerformanceObserver' in window) {

        // Largest Contentful Paint (LCP) — loading performance
        new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                console.log('[Perf] LCP:', entry.startTime.toFixed(0) + 'ms');
                // Good: < 2500ms | Needs work: < 4000ms | Poor: > 4000ms
            });
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID) — interactivity
        new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                console.log('[Perf] FID:', entry.processingStart - entry.startTime + 'ms');
                // Good: < 100ms
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS) — visual stability
        new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                console.log('[Perf] CLS:', entry.value.toFixed(4));
                // Good: < 0.1
            });
        }).observe({ entryTypes: ['layout-shift'] });
    }
}