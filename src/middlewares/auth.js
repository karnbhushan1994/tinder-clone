// Middleware to check if the user is an admin
// This middleware checks if the user is authenticated and has admin privileges
const adminAuth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Verify the token (this is just a placeholder, implement your own logic)
  if (token !== 'valid-token') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
}


// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  const user = req.user; // Assuming user is set in the request object
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}
// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  const user = req.user; // Assuming user is set in the request object
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

module.exports = { adminAuth };