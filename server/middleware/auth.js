const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'luxury-secret-key');
    
    // Find user and check if still exists and is active
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account has been deactivated' 
      });
    }
    
    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({ 
        success: false, 
        message: 'Account is temporarily locked due to multiple failed login attempts' 
      });
    }
    
    // Attach user to request object
    req.user = user;
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token has expired' 
      });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }
  
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  
  next();
};

// Middleware to check if user is manager or admin
const requireManager = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }
  
  if (!['admin', 'manager'].includes(req.user.role)) {
    return res.status(403).json({ 
      success: false, 
      message: 'Manager access required' 
    });
  }
  
  next();
};

// Middleware to check if user owns resource or is admin
const requireOwnershipOrAdmin = (resourceKey = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    // Admin can access anything
    if (req.user.role === 'admin' || req.user.role === 'manager') {
      return next();
    }
    
    // Check ownership based on the resource key
    const resourceId = req.params[resourceKey] || req.body[resourceKey] || req.query[resourceKey];
    
    if (req.user._id.toString() !== resourceId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }
    
    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      req.user = null;
      return next();
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'luxury-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (user && user.isActive && !user.isLocked) {
      req.user = user;
    } else {
      req.user = null;
    }
    
    next();
    
  } catch (error) {
    // Don't fail on optional auth errors
    req.user = null;
    next();
  }
};

// Middleware to check specific permissions
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    // Admin has all permissions
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Define role-based permissions
    const rolePermissions = {
      manager: [
        'view_orders',
        'update_orders',
        'view_customers',
        'view_products',
        'update_products',
        'view_analytics',
        'manage_chat'
      ],
      customer: [
        'view_own_orders',
        'create_orders',
        'view_products',
        'create_reviews',
        'use_chat'
      ]
    };
    
    const userPermissions = rolePermissions[req.user.role] || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ 
        success: false, 
        message: `Permission '${permission}' required` 
      });
    }
    
    next();
  };
};

// Rate limiting middleware for sensitive operations
const rateLimitSensitive = (windowMs = 15 * 60 * 1000, maxAttempts = 3) => {
  const attempts = new Map();
  
  return (req, res, next) => {
    const key = req.ip + (req.user ? req.user._id : '');
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old attempts
    if (attempts.has(key)) {
      const userAttempts = attempts.get(key).filter(attempt => attempt > windowStart);
      attempts.set(key, userAttempts);
    }
    
    const currentAttempts = attempts.get(key) || [];
    
    if (currentAttempts.length >= maxAttempts) {
      return res.status(429).json({
        success: false,
        message: 'Too many attempts. Please try again later.',
        retryAfter: Math.ceil((currentAttempts[0] + windowMs - now) / 1000)
      });
    }
    
    // Record this attempt
    currentAttempts.push(now);
    attempts.set(key, currentAttempts);
    
    next();
  };
};

// Middleware to validate API key for external integrations
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key required'
    });
  }
  
  // Validate against environment variable or database
  const validApiKey = process.env.API_KEY;
  
  if (apiKey !== validApiKey) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key'
    });
  }
  
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireManager,
  requireOwnershipOrAdmin,
  optionalAuth,
  requirePermission,
  rateLimitSensitive,
  validateApiKey
};