'use strict';
const mongoose = require('mongoose')
const Database = require('../src/database');
const IssueModel = require('../src/models/issue');
const moment = require('moment')

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let filters = {
        project: project,
      }

      const fields = ['_id', 'project', 'issue_title', 'issue_text', 'created_on', 'updated_on', 'created_by', 'assigned_to', 'open', 'status_text', ]
      fields.forEach(field => {
        if(req.query[field])
          filters[field] = req.query[field]
      })

      IssueModel.find(filters)
      .then((doc) => res.json(doc)).catch((err) => console.error(err));
    })
    
    .post(function (req, res){
      let project = req.params.project;
      const obj = {
        project: project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: moment(),
        updated_on: null,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        open: true,
        status_text: req.body.status_text || '',
      }
      
      const issue = new IssueModel(obj).save()
      .then((doc) => {
        obj._id = doc._id
        res.json(obj);
      }).catch((err) => res.json({ error: 'required field(s) missing' }));
    })
    
    .put(function (req, res){
      let project = req.params.project;

      if(!req.body._id)
        return res.json({ error: 'missing _id' })

      IssueModel.findOne({_id: req.body._id})
      .then((doc) => {
        let updateFieldsFound = false
        const fields = ['project', 'issue_title', 'issue_text', 'created_on', 'updated_on', 'created_by', 'assigned_to', 'open', 'status_text', ]
        fields.forEach(field => {
          if(req.body[field]){
            updateFieldsFound = true
            doc[field] = req.body[field]
          }
        })

        if(!updateFieldsFound)
          return res.json({ error: 'no update field(s) sent', '_id': req.body._id })

        doc.updated_on = moment()

        doc.save()
        .then((doc) => {
          res.json({  result: 'successfully updated', '_id': doc._id })
        }).catch((err) => console.error(err));
      }).catch((err) => {
        console.error(err)
        return res.json({ error: 'could not update', '_id': req.body._id })
      });
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;

      if(!req.body._id)
        return res.json({ error: 'missing _id' })

      IssueModel.findOne({_id: req.body._id})
      .then((doc) => {

        doc.deleteOne()
        .then((doc) => {
          res.json({  result: 'successfully deleted', '_id': req.body._id })
        }).catch((err) => console.error(err));
      }).catch((err) => {
        console.error(err)
        return res.json({ error: 'could not delete', '_id': req.body._id })
      });
      
    });
    
};
