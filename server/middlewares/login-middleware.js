const validateLogin = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    }
    catch (err) {
        const status = 404;
        const message = "Fill the inpust properly -lm";
        const extraDetails = err.errors[0].message;
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
};

export default validateLogin;