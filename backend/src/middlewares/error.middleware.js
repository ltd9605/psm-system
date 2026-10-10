export function errorHandler(err, req, res, next) {
  console.error(`[Error] ${err.message}`);

  // Check if it's a known operational error we can send safely to client
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
    // In development, you might want to send err.stack as well
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}
