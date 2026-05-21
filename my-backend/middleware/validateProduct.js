const validateProduct = (req, res, next) => {
    const { name, price, category } = req.body;
    const errors = [];


    if (!name) {
        errors.push("name is required");
    } else if (typeof name !== 'string') {
        errors.push("name must be a string");
    } else if (name.trim().length < 2) {
        errors.push("name must be at least 2 characters");
    } else if (name.trim().length > 100) {
        errors.push("name must be less than 100 characters");
    }


    if (price === undefined || price === null) {
        errors.push("price is required");
    } else if (typeof price !== 'number') {
        errors.push("price must be a number - don't send as string");
    } else if (price < 0) {
        errors.push("price must be 0 or greater");
    } else if (price > 100000000) {
        errors.push("price seems unrealistic — max 10,000,000");
    }

    const validCategories = ['Electronics', 'Clothing', 'Food', 'Books', 'General'];
    if (category && !validCategories.includes(category)) {
        errors.push(`category must be one of: ${validCategories.join(', ')}`);
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errorCount: errors.length,
            errors
        });
    }

    req.body.name = name.trim();

    console.log(`Validation passed for: ${req.body.name}`);
    next();
};

export default validateProduct;