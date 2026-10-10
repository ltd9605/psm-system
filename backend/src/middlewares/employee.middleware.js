export function employeeOnly(req, res, next) {
  if (req.user.userType !== "EMPLOYEE") {
    return res.status(403).json({
      message: "Employee permission required",
    });
  }
  next();
}

export function managerOnly(req, res, next) {
  if (
    req.user.userType !== "EMPLOYEE" ||
    (req.user.role !== "MANAGER" && req.user.role !== "ADMIN")
  ) {
    return res.status(403).json({
      message: "Manager permission required",
    });
  }
  next();
}

export function adminOnly(req, res, next) {
  if (req.user.userType !== "EMPLOYEE" || req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Admin permission required",
    });
  }
  next();
}
