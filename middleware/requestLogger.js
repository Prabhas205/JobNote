const requestLogger = (req, res, next) => {

    const start = Date.now();

    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);

    res.on('finish', () => {
        const duration = Date.now() - start;

        let statusColor;
        if (res.statusCode >= 500) statusColor = '\x1b[31m';

        else if (res.statusCode >= 400) statusColor = '\x1b[33m';

        else if (res.statusCode >= 200) statusColor = '\x1b[32m';

        const reset = '\x1b[0m';

        console.log(
            `[${timestamp}] ${req.method} ${req.url} -> ` +
            `${statusColor}${res.statusCode}${reset} (${duration}ms)`
        );
    });

    next();
};

export default requestLogger;