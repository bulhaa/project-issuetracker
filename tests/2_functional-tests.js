const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    this.timeout(5000);

    test('Create an issue with every field: POST request to /api/issues/{project}', function (done) {
      const issue = {
            issue_title: 'issue_title_kmidh',
            issue_text: 'issue_text_diski',
            created_by: 'created_by sdim',
            assigned_to: 'assigned_to_sfss',
            status_text: 'status_text sss',
        }
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/test')
        .send(issue)
        .end(function (err, res) {
          const json = JSON.parse(res.text);
          assert.equal(res.status, 200);

          Object.keys(issue).forEach(el => {
            assert.equal(json[el], issue[el])
          });
          done();
        });
    });

    test('Create an issue with only required fields: POST request to /api/issues/{project}', function (done) {
        const issue = {
              issue_title: 'issue_title_kmidh',
              issue_text: 'issue_text_diski',
              created_by: 'created_by sdim',
          }
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/test')
          .send(issue)
          .end(function (err, res) {
            const json = JSON.parse(res.text);
            assert.equal(res.status, 200);

            Object.keys(issue).forEach(el => {
              assert.equal(json[el], issue[el])
            });
            done();
          });
      });

    test('Create an issue with missing required fields: POST request to /api/issues/{project}', function (done) {
        const issue = {
              issue_title: 'issue_title_kmidh',
              issue_text: 'issue_text_diski',
          }
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/test')
          .send(issue)
          .end(function (err, res) {
            const json = JSON.parse(res.text);
            assert.equal(res.status, 200);
            assert.deepEqual(json, { error: 'required field(s) missing' });
            done();
          });
      });

    test('View issues on a project: GET request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/test')
        .end(function (err, res) {
            assert.equal(res.status, 200);
            const json = JSON.parse(res.text);
          assert.isString(json[0].issue_title);
          done();
        });
    });

    test('View issues on a project with one filter: GET request to /api/issues/{project}', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/issues/test?open=true')
          .end(function (err, res) {
              assert.equal(res.status, 200);
              const json = JSON.parse(res.text);
            assert.isString(json[0].issue_title);
            done();
          });
      });

    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/issues/test?open=true&assigned_to=assigned_to_sfss')
          .end(function (err, res) {
              assert.equal(res.status, 200);
              const json = JSON.parse(res.text);
            assert.isString(json[0].issue_title);
            done();
          });
      });

    test('Update one field on an issue: PUT request to /api/issues/{project}', function (done) {
        // get current issue_title
        chai
          .request(server)
          .keepOpen()
          .get(`/api/issues/test`)
          .end(function (err, res) {

            // try update it
            const json = JSON.parse(res.text);
            const oldIssueTitle = json[0].issue_title;
            const id = json[0]._id;
            chai
              .request(server)
              .keepOpen()
              .put('/api/issues/test')
              .send({
                  _id: id,
                  issue_title: oldIssueTitle + 'd',
              })
              .end(function (err, res) {
                  const json = JSON.parse(res.text);
                assert.equal(res.status, 200);
                assert.deepEqual(json, { result: 'successfully updated', _id: id });
                done();
              });
          });
    });

    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
        // get current issue_title
        chai
          .request(server)
          .keepOpen()
          .get(`/api/issues/test`)
          .end(function (err, res) {

            // try update it
            const json = JSON.parse(res.text);
            const oldIssueTitle = json[0].issue_title;
            const oldIssueText = json[0].issue_title;
            const id = json[0]._id;
            chai
              .request(server)
              .keepOpen()
              .put('/api/issues/test')
              .send({
                  _id: id,
                  issue_title: oldIssueTitle + 'd',
                  issue_text: oldIssueText + 'd',
              })
              .end(function (err, res) {
                  const json = JSON.parse(res.text);
                assert.equal(res.status, 200);
                assert.deepEqual(json, { result: 'successfully updated', _id: id });
                done();
              });
          });
    });

    test('Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/test')
          .send({
          })
          .end(function (err, res) {
              const json = JSON.parse(res.text);
            assert.equal(res.status, 200);
            assert.deepEqual(json, { "error": "missing _id" });
            done();
          });
    });

    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
        // get current issue_title
        chai
          .request(server)
          .keepOpen()
          .get(`/api/issues/test`)
          .end(function (err, res) {
    
            // try update it
            const json = JSON.parse(res.text);
            const oldIssueTitle = json[0].issue_title;
            const oldIssueText = json[0].issue_title;
            const id = json[0]._id;
            chai
              .request(server)
              .keepOpen()
              .put('/api/issues/test')
              .send({
                  _id: id,
              })
              .end(function (err, res) {
                  const json = JSON.parse(res.text);
                assert.equal(res.status, 200);
                assert.deepEqual(json, { "error": "no update field(s) sent", "_id": id });
                done();
              });
          });
    });

    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {
        const id = 'skdik'
        
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/test')
          .send({
              _id: id,
          })
          .end(function (err, res) {
              const json = JSON.parse(res.text);
            assert.equal(res.status, 200);
            assert.deepEqual(json, { "error": "could not update", "_id": id });
            done();
          });
    });

    test('Delete an issue: DELETE request to /api/issues/{project}', function (done) {
        // get current issue_title
        chai
          .request(server)
          .keepOpen()
          .get(`/api/issues/test`)
          .end(function (err, res) {
    
            // try update it
            const json = JSON.parse(res.text);
            const oldIssueTitle = json[0].issue_title;
            const oldIssueText = json[0].issue_title;
            const id = json[0]._id;
            chai
              .request(server)
              .keepOpen()
              .delete('/api/issues/test')
              .send({
                  _id: id,
              })
              .end(function (err, res) {
                  const json = JSON.parse(res.text);
                assert.equal(res.status, 200);
                assert.deepEqual(json, { "result": "successfully deleted", "_id": id });
                done();
              });
          });
    });

    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done) {
        const id = 'skdik'
        chai
          .request(server)
          .keepOpen()
          .delete('/api/issues/test')
          .send({
              _id: id,
          })
          .end(function (err, res) {
              const json = JSON.parse(res.text);
            assert.equal(res.status, 200);
            assert.deepEqual(json, { "error": "could not delete", "_id": id });
            done();
          });
    });

    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done) {
        chai
          .request(server)
          .keepOpen()
          .delete('/api/issues/test')
          .send({
          })
          .end(function (err, res) {
              const json = JSON.parse(res.text);
            assert.equal(res.status, 200);
            assert.deepEqual(json, { "error": "missing _id" });
            done();
          });
    });
  
});
