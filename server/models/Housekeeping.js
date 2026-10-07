const mongoose = require('mongoose');

const housekeepingSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  assignedTo: { type: String, default: 'Unassigned' },
  status: {
    type: String,
    enum: ['Clean', 'Dirty', 'Cleaning', 'Inspected', 'Maintenance'],
    default: 'Dirty',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium',
  },
  lastCleaned: { type: Date },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Housekeeping', housekeepingSchema);
