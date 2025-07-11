const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  isMain: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const specificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const dimensionsSchema = new mongoose.Schema({
  length: {
    type: Number,
    required: true,
    min: 0
  },
  width: {
    type: Number,
    required: true,
    min: 0
  },
  height: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    enum: ['cm', 'in', 'mm'],
    default: 'cm'
  }
}, { _id: false });

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  priceModifier: {
    type: Number,
    default: 0
  },
  stockModifier: {
    type: Number,
    default: 0
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  }
}, { _id: true });

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  images: [String],
  isVerified: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  helpfulVotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isHelpful: Boolean
  }]
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative'],
    select: false
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Product brand is required'],
    trim: true,
    maxlength: [100, 'Brand name cannot exceed 100 characters']
  },
  images: {
    type: [imageSchema],
    validate: {
      validator: function(images) {
        return images && images.length > 0;
      },
      message: 'At least one product image is required'
    }
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  minStock: {
    type: Number,
    default: 5,
    min: 0
  },
  maxStock: {
    type: Number,
    default: 1000,
    min: 1
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: dimensionsSchema,
  specifications: [specificationSchema],
  variants: [variantSchema],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isDigital: {
    type: Boolean,
    default: false
  },
  shippingRequired: {
    type: Boolean,
    default: true
  },
  taxable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  reviews: [reviewSchema],
  salesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  wishlistCount: {
    type: Number,
    default: 0,
    min: 0
  },
  metaTitle: {
    type: String,
    trim: true,
    maxlength: 60
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: 160
  },
  publishedAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for availability status
productSchema.virtual('isInStock').get(function() {
  return this.stock > 0;
});

// Virtual for low stock warning
productSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.minStock && this.stock > 0;
});

// Virtual for main image
productSchema.virtual('mainImage').get(function() {
  return this.images.find(img => img.isMain) || this.images[0];
});

// Virtual for profit margin
productSchema.virtual('profitMargin').get(function() {
  if (this.costPrice && this.costPrice > 0) {
    return ((this.price - this.costPrice) / this.price) * 100;
  }
  return 0;
});

// Indexes
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ brand: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ salesCount: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ tags: 1 });

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Set published date for new active products
  if (this.isNew && this.isActive && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Ensure at least one image is marked as main
  if (this.images && this.images.length > 0) {
    const hasMain = this.images.some(img => img.isMain);
    if (!hasMain) {
      this.images[0].isMain = true;
    }
  }
  
  next();
});

// Pre-save middleware to update rating
productSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    this.reviewCount = this.reviews.filter(review => review.isApproved).length;
    
    if (this.reviewCount > 0) {
      const totalRating = this.reviews
        .filter(review => review.isApproved)
        .reduce((sum, review) => sum + review.rating, 0);
      this.rating = Number((totalRating / this.reviewCount).toFixed(1));
    } else {
      this.rating = 0;
    }
  }
  next();
});

// Method to increment view count
productSchema.methods.incrementView = function() {
  this.viewCount += 1;
  return this.save({ validateBeforeSave: false });
};

// Method to add to stock
productSchema.methods.addStock = function(quantity) {
  this.stock += quantity;
  if (this.stock > this.maxStock) {
    this.stock = this.maxStock;
  }
  return this.save();
};

// Method to reduce stock
productSchema.methods.reduceStock = function(quantity) {
  if (this.stock < quantity) {
    throw new Error('Insufficient stock');
  }
  this.stock -= quantity;
  this.salesCount += quantity;
  return this.save();
};

// Method to add review
productSchema.methods.addReview = function(reviewData) {
  this.reviews.push(reviewData);
  return this.save();
};

// Static method to find featured products
productSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ isFeatured: true, isActive: true })
    .populate('category')
    .limit(limit)
    .sort({ createdAt: -1 });
};

// Static method to find by category
productSchema.statics.findByCategory = function(categoryId, options = {}) {
  const { limit = 20, sort = { createdAt: -1 } } = options;
  return this.find({ category: categoryId, isActive: true })
    .populate('category')
    .limit(limit)
    .sort(sort);
};

// Static method to search products
productSchema.statics.search = function(query, options = {}) {
  const { limit = 20, sort = { score: { $meta: 'textScore' } } } = options;
  return this.find(
    { $text: { $search: query }, isActive: true },
    { score: { $meta: 'textScore' } }
  )
    .populate('category')
    .limit(limit)
    .sort(sort);
};

// Static method to find low stock products
productSchema.statics.findLowStock = function() {
  return this.find({
    $expr: { $lte: ['$stock', '$minStock'] },
    stock: { $gt: 0 },
    isActive: true
  }).sort({ stock: 1 });
};

// Static method to find best sellers
productSchema.statics.findBestSellers = function(limit = 10) {
  return this.find({ isActive: true })
    .populate('category')
    .sort({ salesCount: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Product', productSchema);