/**
 * Created by alok on 2/6/16.
 */

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');


var should = chai.should();
var productDiscovery = require('../app/models/impactMapActor');

chai.use(chaiHttp)


describe("Impact Map Actor", function(){

    it("should get all actors of an impact map of a discovery product /getActors", function(done){
        chai.request(app)
            .get('/getActors/Demo Project')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                done();
            })
    });
    it("should add an actor to impact map of a discovery product /addActor", function(done){
        chai.request(app)
            .post('/addActor')
            .send({productName : "Demo Project",
                actor : "Test Case Actor New Sample"})
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                chai.request(app)
                    .get('/getActors/Demo Project')
                    .end(function(err, res){
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('array');
                        done();
                    });

            })
    });

/*    it("should add an actor to impact map of a discovery product /editActor", function(done){
        chai.request(app)
            .post('/addActor')
            .send({productName : "Demo Project",
                actor : "Test Case Actor New Sample"})
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                chai.request(app)
                    .get('/getActors/Demo Project')
                    .end(function(err, res){
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('array');
                        done();
                    });

            })
    });*/
    it("should delete an actor from impact map of a discovery product /deleteActor", function(done){
        chai.request(app)
            .delete('/deleteActor/Demo Project/Test Case Actor New Sample')
            .end(function(err, res){
                res.should.have.status(200);/*
                res.should.be.json;
                res.body.should.be.a('array');*/
                done();
            })

    });
    /* it("should add an actor to impact map of a discovery product /addActor", function(done){

    });*/
});