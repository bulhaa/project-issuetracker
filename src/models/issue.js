let mongoose = require('mongoose');
// let validator = require('validator');

let issueSchema = new mongoose.Schema({
  project: {
    type: String,
    required: true,
  },
  issue_title: {
    type: String,
    required: true,
  },
  issue_text: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
  },
  updated_on: {
    type: Date,
  },
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
  },
  open: {
    type: Boolean,
  },
  status_text: {
    type: String,
  },
});

module.exports = mongoose.model('Issue', issueSchema);