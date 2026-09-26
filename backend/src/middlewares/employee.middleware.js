export function employeeOnly(req, res, next) {
    if (req.user.userType !== "EMPLOYEE") {
        return res.status(403).json({
            message: "Employee permission required"
        });
    }

    next();
}