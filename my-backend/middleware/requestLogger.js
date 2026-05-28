const requestLogger = (req, res, next) => {
    if (req.method === 'HEAD') {
        return next();
    }
    const start = Date.now();
    const timestamp = new Date()
        .toISOString()
        .replace('T', ' ')
        .slice(0, 19);

    res.on('finish', () => {
        const duration = Date.now() - start;

        let color;
        if (res.statusCode >= 500) color = '\x1b[31m';
        else if (res.statusCode >= 400) color = '\x1b[33m';
        else color = '\x1b[32m';

        const reset = '\x1b[0m';
        console.log(
            `[${timestamp}] ${req.method} ${req.url} → ` +
            `${color}${res.statusCode}${reset} (${duration}ms)`
        );
    });

    next();
};

export default requestLogger;