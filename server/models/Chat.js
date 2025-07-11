const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderType: {
    type: String,
    enum: ['customer', 'admin', 'system'],
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  originalMessage: String
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  category: {
    type: String,
    enum: ['general', 'order_inquiry', 'product_question', 'technical_support', 'complaint', 'return_refund', 'billing'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'in_progress', 'waiting_customer', 'waiting_agent', 'resolved', 'closed'],
    default: 'open'
  },
  messages: [messageSchema],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  customerSatisfaction: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    submittedAt: Date
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    referrer: String,
    sessionId: String
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  lastMessage: {
    type: Date,
    default: Date.now
  },
  responseTime: {
    firstResponse: Date,
    averageResponse: Number, // in minutes
    lastResponse: Date
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: Date,
  archivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  relatedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  escalationLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 3
  },
  escalatedAt: Date,
  escalatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  escalationReason: String,
  internalNotes: [{
    note: {
      type: String,
      required: true,
      trim: true
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    isPrivate: {
      type: Boolean,
      default: true
    }
  }],
  automatedResponses: [{
    trigger: String,
    response: String,
    sentAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for unread message count
chatSchema.virtual('unreadCount').get(function() {
  return this.messages.filter(msg => !msg.isRead && msg.senderType === 'customer').length;
});

// Virtual for last message preview
chatSchema.virtual('lastMessagePreview').get(function() {
  if (this.messages.length === 0) return '';
  const lastMsg = this.messages[this.messages.length - 1];
  return lastMsg.message.length > 50 ? 
    lastMsg.message.substring(0, 50) + '...' : 
    lastMsg.message;
});

// Virtual for chat duration
chatSchema.virtual('duration').get(function() {
  return Math.floor((this.lastActivity - this.createdAt) / (1000 * 60)); // in minutes
});

// Virtual for is active (recent activity)
chatSchema.virtual('isActive').get(function() {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  return this.lastActivity > thirtyMinutesAgo;
});

// Indexes
chatSchema.index({ customer: 1, createdAt: -1 });
chatSchema.index({ assignedAgent: 1, status: 1 });
chatSchema.index({ status: 1, priority: 1, createdAt: -1 });
chatSchema.index({ category: 1, status: 1 });
chatSchema.index({ lastActivity: -1 });
chatSchema.index({ isArchived: 1, status: 1 });
chatSchema.index({ relatedOrder: 1 });
chatSchema.index({ tags: 1 });

// Pre-save middleware to update lastActivity and lastMessage
chatSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.lastActivity = new Date();
    if (this.messages.length > 0) {
      this.lastMessage = this.messages[this.messages.length - 1].createdAt || new Date();
    }
  }
  next();
});

// Method to add message
chatSchema.methods.addMessage = function(messageData) {
  const message = {
    sender: messageData.sender,
    senderType: messageData.senderType,
    message: messageData.message,
    messageType: messageData.messageType || 'text',
    attachments: messageData.attachments || []
  };
  
  this.messages.push(message);
  this.lastActivity = new Date();
  this.lastMessage = new Date();
  
  // Update status based on sender
  if (messageData.senderType === 'customer' && this.status === 'waiting_customer') {
    this.status = 'in_progress';
  } else if (messageData.senderType === 'admin' && this.status === 'waiting_agent') {
    this.status = 'in_progress';
  }
  
  return this.save();
};

// Method to assign agent
chatSchema.methods.assignAgent = function(agentId) {
  this.assignedAgent = agentId;
  this.status = this.status === 'open' ? 'assigned' : this.status;
  
  // Add system message
  this.messages.push({
    sender: agentId,
    senderType: 'system',
    message: 'Agent has been assigned to this chat',
    messageType: 'system'
  });
  
  return this.save();
};

// Method to escalate chat
chatSchema.methods.escalate = function(escalatedBy, reason) {
  this.escalationLevel += 1;
  this.escalatedAt = new Date();
  this.escalatedBy = escalatedBy;
  this.escalationReason = reason;
  this.priority = this.priority === 'low' ? 'medium' : 
                  this.priority === 'medium' ? 'high' : 'urgent';
  
  // Add system message
  this.messages.push({
    sender: escalatedBy,
    senderType: 'system',
    message: `Chat escalated to level ${this.escalationLevel}. Reason: ${reason}`,
    messageType: 'system'
  });
  
  return this.save();
};

// Method to close chat
chatSchema.methods.close = function(closedBy, reason) {
  this.status = 'closed';
  
  // Add system message
  this.messages.push({
    sender: closedBy,
    senderType: 'system',
    message: `Chat closed. ${reason ? 'Reason: ' + reason : ''}`,
    messageType: 'system'
  });
  
  return this.save();
};

// Method to add internal note
chatSchema.methods.addInternalNote = function(noteData) {
  this.internalNotes.push({
    note: noteData.note,
    addedBy: noteData.addedBy,
    isPrivate: noteData.isPrivate !== false // default to true
  });
  
  return this.save();
};

// Method to mark messages as read
chatSchema.methods.markAsRead = function(userId, messageIds = null) {
  const messagesToUpdate = messageIds ? 
    this.messages.filter(msg => messageIds.includes(msg._id.toString())) :
    this.messages.filter(msg => !msg.isRead);
  
  messagesToUpdate.forEach(msg => {
    msg.isRead = true;
    msg.readAt = new Date();
    msg.readBy.push({
      user: userId,
      readAt: new Date()
    });
  });
  
  return this.save();
};

// Method to calculate response times
chatSchema.methods.calculateResponseTimes = function() {
  const adminMessages = this.messages.filter(msg => msg.senderType === 'admin');
  const customerMessages = this.messages.filter(msg => msg.senderType === 'customer');
  
  if (adminMessages.length === 0) return;
  
  // First response time
  if (!this.responseTime.firstResponse && adminMessages.length > 0) {
    const firstCustomerMsg = customerMessages[0];
    const firstAdminMsg = adminMessages[0];
    
    if (firstCustomerMsg && firstAdminMsg && firstAdminMsg.createdAt > firstCustomerMsg.createdAt) {
      this.responseTime.firstResponse = new Date(firstAdminMsg.createdAt - firstCustomerMsg.createdAt);
    }
  }
  
  // Average response time
  let totalResponseTime = 0;
  let responseCount = 0;
  
  for (let i = 0; i < customerMessages.length; i++) {
    const customerMsg = customerMessages[i];
    const nextAdminMsg = adminMessages.find(msg => msg.createdAt > customerMsg.createdAt);
    
    if (nextAdminMsg) {
      totalResponseTime += nextAdminMsg.createdAt - customerMsg.createdAt;
      responseCount++;
    }
  }
  
  if (responseCount > 0) {
    this.responseTime.averageResponse = Math.floor(totalResponseTime / responseCount / (1000 * 60)); // in minutes
  }
  
  // Last response time
  if (adminMessages.length > 0) {
    this.responseTime.lastResponse = adminMessages[adminMessages.length - 1].createdAt;
  }
};

// Static method to find by customer
chatSchema.statics.findByCustomer = function(customerId, options = {}) {
  const { limit = 20, status } = options;
  const query = { customer: customerId };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('assignedAgent', 'firstName lastName')
    .sort({ lastActivity: -1 })
    .limit(limit);
};

// Static method to find by agent
chatSchema.statics.findByAgent = function(agentId, options = {}) {
  const { limit = 50, status } = options;
  const query = { assignedAgent: agentId };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('customer', 'firstName lastName email')
    .sort({ lastActivity: -1 })
    .limit(limit);
};

// Static method to find unassigned chats
chatSchema.statics.findUnassigned = function() {
  return this.find({ 
    status: 'open',
    assignedAgent: null,
    isArchived: false
  })
    .populate('customer', 'firstName lastName email')
    .sort({ priority: 1, createdAt: 1 }); // urgent first, then oldest first
};

// Static method to find active chats
chatSchema.statics.findActive = function() {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  
  return this.find({
    status: { $in: ['assigned', 'in_progress', 'waiting_customer', 'waiting_agent'] },
    lastActivity: { $gte: thirtyMinutesAgo },
    isArchived: false
  })
    .populate('customer', 'firstName lastName')
    .populate('assignedAgent', 'firstName lastName')
    .sort({ lastActivity: -1 });
};

// Static method to get chat analytics
chatSchema.statics.getAnalytics = async function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalChats: { $sum: 1 },
        resolvedChats: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        },
        averageMessages: { $avg: { $size: '$messages' } },
        averageDuration: { $avg: '$duration' }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalChats: 0,
    resolvedChats: 0,
    averageMessages: 0,
    averageDuration: 0
  };
};

module.exports = mongoose.model('Chat', chatSchema);