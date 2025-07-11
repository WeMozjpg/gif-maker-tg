const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const addressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  street: {
    type: String,
    required: true,
    trim: true
  },
  apartment: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: 'United States'
  },
  phone: {
    type: String,
    trim: true
  }
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productSnapshot: {
    name: String,
    description: String,
    brand: String,
    sku: String,
    image: {
      url: String,
      alt: String
    }
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  variant: {
    name: String,
    value: String,
    sku: String
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  }
}, { _id: true });

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay', 'bank_transfer', 'cash_on_delivery']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed,
    select: false
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  processedAt: Date,
  failureReason: String
}, { _id: true, timestamps: true });

const trackingSchema = new mongoose.Schema({
  carrier: {
    type: String,
    required: true,
    trim: true
  },
  trackingNumber: {
    type: String,
    required: true,
    trim: true
  },
  trackingUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['label_created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'delivery_attempted', 'exception'],
    default: 'label_created'
  },
  estimatedDeliveryDate: Date,
  actualDeliveryDate: Date,
  events: [{
    status: String,
    description: String,
    location: String,
    timestamp: Date
  }]
}, { _id: true, timestamps: true });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerSnapshot: {
    email: String,
    firstName: String,
    lastName: String,
    phone: String
  },
  items: {
    type: [orderItemSchema],
    validate: {
      validator: function(items) {
        return items && items.length > 0;
      },
      message: 'Order must contain at least one item'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  shippingAddress: {
    type: addressSchema,
    required: true
  },
  billingAddress: {
    type: addressSchema,
    required: true
  },
  shippingMethod: {
    name: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      required: true,
      min: 0
    },
    estimatedDays: {
      type: Number,
      min: 1
    }
  },
  payment: paymentSchema,
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  taxAmount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  shippingCost: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  couponCode: {
    type: String,
    trim: true,
    uppercase: true
  },
  loyaltyPointsUsed: {
    type: Number,
    default: 0,
    min: 0
  },
  loyaltyPointsEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  tracking: trackingSchema,
  notes: {
    customer: {
      type: String,
      trim: true,
      maxlength: 500
    },
    internal: {
      type: String,
      trim: true,
      maxlength: 1000,
      select: false
    }
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  refunds: [{
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    method: {
      type: String,
      enum: ['original_payment', 'store_credit', 'bank_transfer'],
      default: 'original_payment'
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    refundId: String,
    processedAt: Date
  }],
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: {
    type: String,
    trim: true,
    maxlength: 500
  },
  expectedDeliveryDate: Date,
  actualDeliveryDate: Date,
  processingStartedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total items
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order age in days
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for is refundable
orderSchema.virtual('isRefundable').get(function() {
  return ['delivered', 'partially_refunded'].includes(this.status) && 
         this.orderAge <= 30; // 30-day return policy
});

// Virtual for refunded amount
orderSchema.virtual('refundedAmount').get(function() {
  return this.refunds
    .filter(refund => refund.status === 'completed')
    .reduce((total, refund) => total + refund.amount, 0);
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ 'tracking.trackingNumber': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ total: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    this.orderNumber = `LUX-${timestamp}-${random}`;
  }
  next();
});

// Pre-save middleware to update status history
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
    
    // Update status-specific timestamps
    switch (this.status) {
      case 'processing':
        if (!this.processingStartedAt) this.processingStartedAt = new Date();
        break;
      case 'shipped':
        if (!this.shippedAt) this.shippedAt = new Date();
        break;
      case 'delivered':
        if (!this.deliveredAt) this.deliveredAt = new Date();
        this.actualDeliveryDate = new Date();
        break;
      case 'cancelled':
        if (!this.cancelledAt) this.cancelledAt = new Date();
        break;
    }
  }
  next();
});

// Method to calculate loyalty points earned
orderSchema.methods.calculateLoyaltyPoints = function() {
  // 1 point per dollar spent (after discounts)
  const pointsEarned = Math.floor(this.total - this.discountAmount);
  this.loyaltyPointsEarned = pointsEarned;
  return pointsEarned;
};

// Method to add refund
orderSchema.methods.addRefund = function(refundData) {
  const refund = {
    ...refundData,
    refundId: uuidv4()
  };
  this.refunds.push(refund);
  
  // Update order status if fully refunded
  const totalRefunded = this.refundedAmount + refundData.amount;
  if (totalRefunded >= this.total) {
    this.status = 'refunded';
  } else if (totalRefunded > 0) {
    this.status = 'partially_refunded';
  }
  
  return this.save();
};

// Method to update tracking
orderSchema.methods.updateTracking = function(trackingData) {
  if (!this.tracking) {
    this.tracking = {};
  }
  
  Object.assign(this.tracking, trackingData);
  
  if (trackingData.status === 'delivered') {
    this.status = 'delivered';
    this.actualDeliveryDate = new Date();
  }
  
  return this.save();
};

// Method to cancel order
orderSchema.methods.cancel = function(reason, cancelledBy) {
  if (!['pending', 'confirmed'].includes(this.status)) {
    throw new Error('Order cannot be cancelled in current status');
  }
  
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.statusHistory.push({
    status: 'cancelled',
    timestamp: new Date(),
    updatedBy: cancelledBy,
    notes: reason
  });
  
  return this.save();
};

// Static method to find orders by customer
orderSchema.statics.findByCustomer = function(customerId, options = {}) {
  const { limit = 20, status } = options;
  const query = { customer: customerId };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('items.product', 'name slug images')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to find recent orders
orderSchema.statics.findRecent = function(limit = 50) {
  return this.find({})
    .populate('customer', 'firstName lastName email')
    .populate('items.product', 'name slug')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get sales analytics
orderSchema.statics.getSalesAnalytics = async function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $nin: ['cancelled', 'refunded'] }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' },
        totalItems: { $sum: { $sum: '$items.quantity' } }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalItems: 0
  };
};

// Static method to find orders needing attention
orderSchema.statics.findNeedingAttention = function() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  return this.find({
    $or: [
      { status: 'pending', createdAt: { $lt: twentyFourHoursAgo } },
      { status: 'confirmed', processingStartedAt: { $exists: false } },
      { 'payment.status': 'failed' }
    ]
  }).populate('customer', 'firstName lastName email');
};

module.exports = mongoose.model('Order', orderSchema);