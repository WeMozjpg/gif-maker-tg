const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters'],
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    url: {
      type: String,
      default: null
    },
    alt: {
      type: String,
      default: ''
    }
  },
  icon: {
    type: String,
    trim: true
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0,
    min: 0,
    max: 3
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  productCount: {
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
  seoKeywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  filters: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['range', 'select', 'checkbox', 'color'],
      required: true
    },
    options: [{
      label: String,
      value: String,
      color: String // for color type filters
    }],
    isActive: {
      type: Boolean,
      default: true
    }
  }],
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

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory'
});

// Virtual for products
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category'
});

// Virtual for full path
categorySchema.virtual('fullPath').get(function() {
  // This would be populated in a separate method that traverses up the hierarchy
  return this.name;
});

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parentCategory: 1, isActive: 1 });
categorySchema.index({ level: 1, sortOrder: 1 });
categorySchema.index({ isFeatured: 1, isActive: 1 });
categorySchema.index({ productCount: -1 });

// Pre-save middleware to generate slug
categorySchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Pre-save middleware to set level based on parent
categorySchema.pre('save', async function(next) {
  if (this.isModified('parentCategory')) {
    if (this.parentCategory) {
      try {
        const parent = await this.constructor.findById(this.parentCategory);
        if (parent) {
          this.level = parent.level + 1;
        }
      } catch (error) {
        return next(error);
      }
    } else {
      this.level = 0;
    }
  }
  next();
});

// Method to get category hierarchy path
categorySchema.methods.getHierarchyPath = async function() {
  const path = [this];
  let current = this;
  
  while (current.parentCategory) {
    current = await this.constructor.findById(current.parentCategory);
    if (current) {
      path.unshift(current);
    } else {
      break;
    }
  }
  
  return path;
};

// Method to get all descendants
categorySchema.methods.getDescendants = function() {
  return this.constructor.find({
    $or: [
      { parentCategory: this._id },
      { parentCategory: { $in: this.getAllDescendantIds() } }
    ]
  });
};

// Static method to get root categories
categorySchema.statics.getRootCategories = function() {
  return this.find({ 
    parentCategory: null, 
    isActive: true 
  }).sort({ sortOrder: 1, name: 1 });
};

// Static method to get featured categories
categorySchema.statics.getFeatured = function() {
  return this.find({ 
    isFeatured: true, 
    isActive: true 
  }).sort({ sortOrder: 1, name: 1 });
};

// Static method to get category tree
categorySchema.statics.getCategoryTree = async function() {
  const categories = await this.find({ isActive: true })
    .sort({ level: 1, sortOrder: 1, name: 1 });
  
  const categoryMap = {};
  const rootCategories = [];
  
  // First pass: create category map
  categories.forEach(category => {
    categoryMap[category._id] = {
      ...category.toObject(),
      children: []
    };
  });
  
  // Second pass: build tree structure
  categories.forEach(category => {
    if (category.parentCategory && categoryMap[category.parentCategory]) {
      categoryMap[category.parentCategory].children.push(categoryMap[category._id]);
    } else {
      rootCategories.push(categoryMap[category._id]);
    }
  });
  
  return rootCategories;
};

// Static method to update product counts
categorySchema.statics.updateProductCounts = async function() {
  const Product = mongoose.model('Product');
  
  const counts = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);
  
  // Reset all counts to 0
  await this.updateMany({}, { productCount: 0 });
  
  // Update counts for categories with products
  for (const count of counts) {
    await this.findByIdAndUpdate(count._id, { productCount: count.count });
  }
};

// Static method to search categories
categorySchema.statics.search = function(query) {
  return this.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { seoKeywords: { $in: [new RegExp(query, 'i')] } }
    ],
    isActive: true
  }).sort({ productCount: -1, name: 1 });
};

module.exports = mongoose.model('Category', categorySchema);