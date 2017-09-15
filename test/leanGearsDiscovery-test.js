/**
 * Created by alok on 23/5/16.
 */

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');


var should = chai.should();
var productDiscovery = require('../app/models/leanGearsDiscovery');

chai.use(chaiHttp)


describe('ProductDiscovery', function() {
    it('should list ALL discoveries on /continueDiscovery GET', function(done){
        chai.request(app)
            .get('/continueDiscovery')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                done();
            })
    });
    it('should create a discovery on /startDiscovery POST', function(done){
        chai.request(app)
            .post('/createNewDiscovery')
            .send({projectKey : "TEST",
                productName : "TEST PRODUCT",
                endUsers : "TEST USERS",
                problemsArea: "TEST PROBLEMS",
                productKind: "TEST PRODUCT KIND",
                problemSoln: "TEST PROBLEM SOLUTION",
                competitors: "TEST COMPETITORS",
                differentiator: "TEST DIFFERENTIATOR",
                discoverer: "TEST USER",
                shared: "Private"})
            .end(function(err, res){
                res.should.have.status(200);
                //res.should.be.json;
                //res.body.should.be.a('object');

                res.body.should.be.a('object');
                res.body.should.have.property('projectKey');
                res.body.should.have.property('productName');
                res.body.should.have.property('_id');
                res.body.projectKey.should.equal('TEST');
                res.body.productName.should.equal('TEST PRODUCT');
                done();
            });
    });
    it('should edit a discovery on /editDiscovery PUT', function(done){
        chai.request(app)
            .put('/editDiscovery')
            .send({
                productName : "TEST PRODUCT",
                endUsers : "TEST USERS EDITED",
                problemsArea: "TEST PROBLEMS EDITED",
                productKind: "TEST PRODUCT KIND EDITED",
                problemSoln: "TEST PROBLEM SOLUTION EDITED",
                competitors: "TEST COMPETITORS EDITED",
                differentiator: "TEST DIFFERENTIATOR EDITED",
                discoverer: "TEST USER EDITED",
                shared: "Private"})
            .end(function(err, res){
                res.should.have.status(200);
                //res.body.should.be.a('object');
                done();
            });
    });
    it('should delete a discovery on /deleteDiscovery DELETE', function(done){
        chai.request(app)
            .delete('/deleteDiscovery/TEST PRODUCT')
            .end(function(err, res){
                res.should.have.status(200);
                chai.request(app)
                    .get('/continueDiscovery')
                    .end(function(err, res){
                       res.should.have.status(200);
                        done();
                    });
            })

    });
    /*it('should list a SINGLE blob on /blob/<id> GET');
     it('should add a SINGLE blob on /blobs POST');
     it('should update a SINGLE blob on /blob/<id> PUT');
     it('should delete a SINGLE blob on /blob/<id> DELETE');*/
});

