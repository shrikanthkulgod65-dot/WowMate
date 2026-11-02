
// Handle errors that occur in the application
export const errorMiddleware = (err, req, res, next) => {
  // Set the HTTP status code
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

// Handle requests to routes that do not exist
export const notFoundMiddleware = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};
