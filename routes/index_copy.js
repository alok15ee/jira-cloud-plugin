/*Loading the discovery model*//*
var productDiscovery = require('../app/models/leanGearsDiscovery');*/

module.exports = function (app, addon) {

    // Root route. This route will serve the `atlassian-connect.json` unless the
    // documentation url inside `atlassian-connect.json` is set
    app.get('/', function (req, res) {
        res.format({
            // If the request content-type is text-html, it will decide which to serve up
            'text/html': function () {
                res.redirect('/atlassian-connect.json');
                //res.redirect('http://leangears.com/');

            },
            // This logic is here to make sure that the `atlassian-connect.json` is always
            // served up when requested by the host
            'application/json': function () {
                res.redirect('/atlassian-connect.json');
                //res.redirect('http://leangears.com/');
            }
        });
    });

    app.get('/installed', function (req, res) {
        res.status(200);

    });

    // This is an example route that's used by the default "generalPage" module.
    // Verify that the incoming request is authenticated with Atlassian Connect
    app.get('/hello-world', addon.authenticate(), function (req, res) {
            // Rendering a template is easy; the `render()` method takes two params: name of template
            // and a json object to pass the context in
            res.render('hello-world', {
                title: 'Atlassian Connect'
                //issueId: req.query['issueId']
            });
        }
    );


    app.get('/admin-config', addon.authenticate(), function (req, res) {
            // Rendering a template is easy; the `render()` method takes two params: name of template
            // and a json object to pass the context in
            res.render('admin-config', {
                title: 'Atlassian Connect'
                //issueId: req.query['issueId']
            });
        }
    );


    app.get('/startDiscovery', addon.authenticate(), function(req, res) {
        //console.log(res);
        /*console.log(req.query.param('lic'))*/
        console.log(req.param('lic'))

        res.render('startDiscovery', { title: "" });

        //uncomment this to enable licensing
        /*if(req.param('lic') == 'none'){
            console.log("No license buddy");
            res.render('licenseError', { title: "" });
        }else{
            res.render('startDiscovery', { title: "" });
        }*/
    });


    app.get('/continueDiscovery', addon.authenticate(), function(req, res) {

        console.log("Current User" + req.param('user_id'))
        productDiscovery.find(function (err, data){

            if (err)
                res.send(err)

            var data = JSON.stringify(data);
            var jsonData = JSON.parse(data)
            var productList = [];




            //res.status(200).json(productList);  //Uncomment when doing unit testing
            res.render('continueDiscovery', {continueDiscovery: productList , title: "Here are your products being discovered now:"});

/*
            if(req.param('lic') == 'none'){
                console.log("No license buddy");
                res.render('licenseError', { title: "" });
            }else{
*/

                if (req.param('user_id') == "admin"){
                    for (var i = 0; i < jsonData.length; i++) {
                        var item = {
                            /*"product": {*/
                            "productName": jsonData[i].productName,
                            "user": jsonData[i].discoverer,
                            "shared" : jsonData[i].shared
                            /*},*/
                        };
                        productList.push(item)
                    }
                }else{
                    for (var i = 0; i < jsonData.length; i++) {

                        if (jsonData[i].discoverer == req.param('user_id')){
                            var item = {
                                /*"product": {*/
                                "productName": jsonData[i].productName,
                                "user": jsonData[i].discoverer,
                                "shared" : jsonData[i].shared
                                /*},*/
                            };
                            productList.push(item)
                        }

                    }
                }
                res.render('continueDiscovery', {continueDiscovery: productList , title: "Here are your products being discovered now:"});
            //}

        });
    });




    app.post('/createNewDiscovery',/* addon.authenticate(),*/ function(req, res) {


        productDiscovery.create({
            projectKey : req.body.projectKey,
            productName : req.body.productName,
            endUsers : req.body.endUsers,
            problemsArea: req.body.problemsArea,
            productKind: req.body.productKind,
            problemSoln: req.body.problemSoln,
            competitors: req.body.competitors,
            differentiator: req.body.differentiator,
            discoverer: req.body.user,
            shared: "Private",
            /*done : false*/
        }, function(err, discoveryProduct) {
            if (err)
                res.send(err);

            console.log(discoveryProduct)
            //res.status(200).json(discoveryProduct);
            // get and return all the todos after you create another
            productDiscovery.find(function(err, discoveryProducts) {

                if (err)
                    res.send(err)

                res.json(discoveryProducts);
            });
        });
    });


    app.put('/editDiscovery', function(req, res) {

        productDiscovery.update({productName: req.body.productName},
            {
                endUsers: req.body.endUsers,
                problemsArea: req.body.problemsArea,
                productKind: req.body.productKind,
                problemSoln: req.body.problemSoln,
                competitors: req.body.competitors,
                differentiator: req.body.differentiator
            }, function (err, discoveryProduct) {
                if (err)
                    res.send(err);

                //res.status(200).json(discoveryProduct); //Uncomment during unit testing
                productDiscovery.find({productName: req.body.productName}, function (err, discoveryProducts) {
                    if (err)
                        res.send(err)
                    res.json(discoveryProducts);
                });
            });

    });


    app.delete('/deleteDiscovery/:productName', function(req, res) {

        productDiscovery.find( {productName:req.params.productName}, function ( err, data ) {
            productDiscovery.remove({productName:req.params.productName},function (err, data) {
                res.json(data);
            });
        });
    });

    app.get('/getAllDiscoveryProducts',function(req, res) {

        console.log("Calling to getAllDiscovery");
        console.log(req.body);

        productDiscovery.find(function(err, data) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(data); // return all todos in JSON format
        });

    });



    app.get('/getCurrentDiscovery/:productName',function(req, res) {

        productDiscovery.find({
            productName : req.params.productName
        }, function(err, data) {
            if (err)
                res.send(err);

            console.log(data)
            res.json(data);
        });

    });

    app.get('/getActors/:productName',function(req, res) {

        impactMapActor.find({
            productName : req.params.productName
        }, function(err, data) {
            if (err)
                res.send(err);
            console.log(data)
            res.json(data);
        });

    });


    app.get('/getActivity/:productName',function(req, res) {

        console.log("Getting the activities")
        impactMapActivity.find({
            productName : req.params.productName
        }, function(err, data) {
            if (err)
                res.send(err);
            console.log(data)
            res.json(data);
        });

    });

    app.get('/getFeatures/:productName',function(req, res) {

        console.log("Getting the activities")
        impactMapFeature.find({
            productName : req.params.productName
        }, function(err, data) {
            if (err)
                res.send(err);
            console.log(data)
            res.json(data);
        });

    });

    app.get('/getIssues/:productName/:actor',function(req, res) {

        console.log("Getting the issues")
        impactMapFeature.find({
            productName : req.params.productName,
            actor : req.params.actor
        }, function(err, data) {
            if (err)
                res.send(err);
            console.log(data)
            res.json(data);
        });

    });


    app.get('/getIssuesActivity/:productName/:actor/:activity',function(req, res) {

        console.log("Getting the issues")
        impactMapFeature.find({
            productName : req.params.productName,
            actor : req.params.actor,
            activity : req.params.activity
        }, function(err, data) {
            if (err)
                res.send(err);
            console.log(data)
            res.json(data);
        });

    });



    app.post('/addActor',function(req, res) {

        impactMapActor.find({
            productName : req.body.productName,
            actor : req.body.actor
        }, function(err, data) {
            if (err)
                res.send(err);
            if(data.length == 0){
                impactMapActor.create(
                    {productName: req.body.productName,
                        checked: req.body.checked,
                        actor: req.body.actor

                    }, function(err,data){
                        if (err)
                        //{
                            res.send(err);
                        console.log(err);

                        impactMapActor.find({
                            productName : req.body.productName
                        }, function(err, data) {
                            if (err)
                                res.send(err);

                            console.log("Printing Data" + data)
                            res.json(data);
                        });
                    }
                );
            }else{
                res.send(err);

            }

        });

    });

    app.put('/editActor', function(req, res) {


        impactMapActor.find({
            productName : req.body.productName,
            actor : req.body.newValue
        }, function(err, data) {
            if (err)
                res.send(err);
            if(data.length == 0){
                impactMapActor.update( {productName:req.body.productName, actor:req.body.actor},{actor:req.body.newValue},function ( err, data ) {
                    impactMapActivity.update( {productName:req.body.productName, actor:req.body.actor},{actor:req.body.newValue},{multi:true},function ( err, data ) {
                        impactMapFeature.update( {productName:req.body.productName, actor:req.body.actor},{actor:req.body.newValue},{multi:true},function ( err, data ) {

                            if (err)
                            //{
                                res.send(err);
                            console.log(err);

                            impactMapActor.find({
                                productName : req.body.productName
                            }, function(err, data) {
                                if (err)
                                    res.send(err);

                                res.json(data);
                            });
                        });
                    });
                });
            }else{
                res.send(err);

            }

        });

    });




    app.put('/resetStatus', function(req, res) {

        console.log("Going to reset");
        console.log(req.body.productName);
        console.log(req.body.checked)

        impactMapActor.update( {productName:req.body.productName},{$set: {checked:req.body.checked}},{multi:true},function ( err, data ) {
            impactMapActivity.update( {productName:req.body.productName},{$set: {checked:req.body.checked}},{multi:true},function ( err, data ) {
                 impactMapFeature.update( {productName:req.body.productName},{$set: {checked:req.body.checked}},{multi:true},function ( err, data ) {

            console.log("Editing  for checked status" + data)
            /*impactMapFeature.update({issueKey:req.params.issueKey},function (err, data) {
             res.json(data);
             });*/
                });
           });
        });
    });


    app.put('/setTargetGroupStatus', function(req, res) {

        console.log("setting the target group status");

        console.log("Editing  for checked status target" + req.body.productName);
        console.log("Editing  for checked status target" + req.body.actor);
        console.log("Editing  for checked status target" + req.body.checked);
        impactMapActor.update( {productName:req.body.productName, actor:req.body.actor},{checked:req.body.checked}, function ( err, data ) {
            console.log("Editing  for checked status" + data)
            console.log("Editing  for checked status" + err)
            /*impactMapFeature.update({issueKey:req.params.issueKey},function (err, data) {
             res.json(data);
             });*/
        });
    });


    app.delete('/deleteActor/:productName/:actor', function(req, res) {

        console.log("Delete Actor" +req.params.productName + req.params.actor);
            impactMapActor.remove({productName:req.params.productName, actor:req.params.actor},function (err, data) {
                impactMapActivity.remove({productName:req.params.productName, actor:req.params.actor},function (err, data) {
                    impactMapFeature.remove({productName:req.params.productName, actor:req.params.actor},function (err, data) {

                        if (err)
                        //{
                            res.send(err);
                        console.log("Printing Error" +err);

                        impactMapActor.find({
                            productName : req.params.productName
                        }, function(err, data) {
                            if (err)
                                res.send(err);

                            console.log("Printing Data" + data)
                            res.json(data);
                        });


                    });
                });
            });
    });


    app.post('/addActivity',function(req, res) {

        impactMapActivity.find({
            productName: req.body.productName,
            actor: req.body.actor,
            activity: req.body.activity

        }, function (err, data) {
            if (err)
                res.send(err);
            if (data.length == 0) {
                impactMapActivity.create(
                    {
                        productName: req.body.productName,
                        checked: req.body.checked,
                        actor: req.body.actor,
                        activity: req.body.activity

                    }, function (err, data) {
                        if (err)
                        //{
                            res.send(err);
                        console.log(err);

                        impactMapActivity.find({
                            productName: req.body.productName
                        }, function (err, data) {
                            if (err)
                                res.send(err);

                            console.log("Printing Data" + data)
                            res.json(data);
                        });
                    }
                );
            }

            else {
                res.send(err);

            }

        });
    });



    app.put('/editActivity', function(req, res) {


        impactMapActivity.find({
            productName : req.body.productName,
            actor : req.body.actor,
            activity : req.body.newValue,
        }, function(err, data) {
            if (err)
                res.send(err);


            if(data.length == 0){

                impactMapActivity.update( {productName:req.body.productName, actor:req.body.actor, activity:req.body.activity},{activity:req.body.newValue},function ( err, data ) {
                    impactMapFeature.update( {productName:req.body.productName, actor:req.body.actor, activity:req.body.activity},{activity:req.body.newValue},{multi:true},function ( err, data ) {
                        if (err)
                        //{
                            res.send(err);
                        console.log(err);

                        impactMapActivity.find({
                            productName : req.body.productName
                        }, function(err, data) {
                            if (err)
                                res.send(err);

                            console.log("Printing Data" + data)
                            res.json(data);
                        });
                    });
                });

            }else{
                res.send(err);

            }

        });

    });



    app.delete('/deleteActivity/:productName/:actor/:activity', function(req, res) {

        impactMapActivity.remove({productName:req.params.productName, actor:req.params.actor, activity:req.params.activity},function (err, data){
                impactMapFeature.remove({productName:req.params.productName, actor:req.params.actor, activity:req.params.activity},function (err, data) {
                        if (err)
                        //{
                            res.send(err);
                        console.log(err);

                        impactMapActivity.find({
                            productName : req.params.productName,

                        }, function(err, data) {
                            if (err)
                                res.send(err);

                            console.log("Printing Data" + data)
                            res.json(data);
                        });
                });
            });
    });


    app.put('/editActivityStatus', function(req, res) {

        impactMapActivity.update( {productName:req.body.productName},{$set: {checked:req.body.checked}},{ multi: true},function ( err, data ) {
            console.log("Editing  for checked status" + data)
            /*impactMapFeature.update({issueKey:req.params.issueKey},function (err, data) {
             res.json(data);
             });*/
        });
    });


    app.put('/setBigPictureStatus', function(req, res) {

        impactMapActivity.update( {productName:req.body.productName, actor:req.body.actor, activity:req.body.activity},{checked:req.body.checked}, function ( err, data ) {
            console.log("Editing  for checked status" + data)
            console.log("Editing  for checked status" + err)
            /*impactMapFeature.update({issueKey:req.params.issueKey},function (err, data) {
             res.json(data);
             });*/
        });
    });


    app.post('/addFeature',function(req, res) {

        console.log("I am going to add Feature");

        console.log( req.body.productName)
        console.log( req.body.actor)
        console.log( req.body.activity)
        console.log( req.body.feature)
        console.log( req.body.checked)


            impactMapFeature.create(
                {productName: req.body.productName,
                    actor: req.body.actor,
                    activity: req.body.activity,
                    feature:req.body.feature,
                    issueKey:req.body.issueKey,
                    checked: req.body.checked
                },
               /* { $push: { feature:req.body.feature
                } },
                {upsert:true},*/

            function(err,data){
                console.log(data);
                if (err)
                    res.send(err);

                impactMapFeature.find({
                    productName : req.body.productName
                }, function(err, data) {
                    if (err)
                        res.send(err);
                    res.json(data);
                });

            }
        );

    });

    app.delete('/deleteFeature/:productName/:actor/:activity/:feature', function(req, res) {


            impactMapFeature.remove({productName:req.params.productName, actor:req.params.actor, activity:req.params.activity,feature:req.params.feature},function (err, data) {
                if (err)
                //{
                    res.send(err);
                console.log(err);

                impactMapFeature.find({
                    productName : req.params.productName,

                }, function(err, data) {
                    if (err)
                        res.send(err);

                    console.log("Printing Data" + data)
                    res.json(data);
                });
            });
        });


    app.put('/editFeatureStatus', function(req, res) {

        impactMapFeature.update( {productName:req.body.productName},{$set: {checked:req.body.checked}},{ multi: true},function ( err, data ) {
            console.log("Editing  for checked status" + data)
            /*impactMapFeature.update({issueKey:req.params.issueKey},function (err, data) {
             res.json(data);
             });*/
        });
    });


    app.put('/setProductDetailStatus', function(req, res) {

        console.log("setting the product detail status");

        impactMapFeature.update( {productName:req.body.productName, actor:req.body.actor, activity:req.body.activity, feature:req.body.feature},{checked:req.body.checked}, function ( err, data ) {

        });
    });




    app.put('/addIssueId', function(req, res) {


        impactMapFeature.update( {productName:req.body.productName, actor:req.body.actor, activity:req.body.activity,feature:req.body.feature},{issueKey:req.body.issueKey}, function ( err, data ) {

            /*impactMapFeature.update({issueKey:req.params.issueKey},function (err, data) {
                res.json(data);
            });*/


        });
    });



    app.post('/addToTargetGroup',function(req, res) {

        console.log( req.body.productName)
        console.log( req.body.actor)
        targetGroup.update(
            {productName: req.body.productName},
            { $push: { actor:req.body.actor
            } },
            {upsert:true},
            function(err,data){
                impactMapActor.update( {productName:req.body.productName, actor:req.body.actor},{checked:req.body.checked},{multi:true}, function ( err, data ) {

                if (err)
                    res.send(err);

                targetGroup.find({
                    productName : req.body.productName
                }, function(err, data) {
                    if (err)
                        res.send(err);

                    res.json(data);

                });

            });
         });

    });



    app.delete('/deleteFromTargetGroup/:productName', function(req, res) {


        targetGroup.find( {productName:req.params.productName}, function ( err, data ) {
            console.log("Deleting target group" + data)
            targetGroup.remove({productName:req.params.productName},function (err, data) {
                res.json(data);
            });
        });
    });


    app.get('/getTargetGroup/:productName',function(req, res) {

        console.log("Getting the activities")


        targetGroup.find({
            productName : req.params.productName
        }, function(err, data) {
            if (err)
                res.send(err);
            console.log(data)
            res.json(data);
        });

    });


    app.post('/addToBigPicture',function(req, res) {

        console.log("I am going to add big picture");

        console.log( req.body.productName)
        console.log( req.body.actor)
        console.log( req.body.activity)

        bigPicture.create(
            {productName: req.body.productName,
                actor: req.body.actor,
                activity: req.body.activity
            },
            function(err,data){
                impactMapActivity.update( {productName:req.body.productName, actor: req.body.actor, activity:req.body.activity},{$set: {checked:req.body.checked}},{ multi: true},function ( err, data ) {
                console.log(data);
                if (err)
                    res.send(err);

                bigPicture.find({
                    productName : req.body.productName
                }, function(err, data) {
                    if (err)
                        res.send(err);
                    res.json(data);
                });

                });
            });
    });


    app.delete('/deleteFromBigPicture/:productName', function(req, res) {
        console.log("Deleting target group" + req.params.productName)

        bigPicture.find( {productName:req.params.productName}, function ( err, data ) {
            console.log("Big Picture to delete:" + data)
            bigPicture.remove({productName:req.params.productName},function (err, data) {
                res.json(data);
            });
        });
    });


    app.get('/getBigPicture/:productName',function(req, res) {

        console.log("Getting the bigpicture")


        bigPicture.find({
            productName : req.params.productName
        }, function(err, data) {
            if (err)
                res.send(err);
            console.log(data)
            res.json(data);
        });

    });


    app.post('/addToProductDetails',function(req, res) {


        productDetails.create(
            {productName: req.body.productName,
                actor: req.body.actor,
                activity: req.body.activity,
                feature:req.body.feature
            },

            function(err,data){
                impactMapFeature.update( {productName:req.body.productName, actor:req.body.actor, activity:req.body.activity, feature:req.body.feature},{checked:req.body.checked}, {multi:true},function ( err, data ) {
                console.log(data);
                if (err)
                    res.send(err);

                productDetails.find({
                    productName : req.body.productName
                }, function(err, data) {
                    if (err)
                        res.send(err);
                    res.json(data);
                });

            });
            });
    });



    app.delete('/deleteFromProductDetails/:productName', function(req, res) {


        productDetails.find( {productName:req.params.productName}, function ( err, data ) {
            console.log("Deleting Product Details" + data)
            productDetails.remove({productName:req.params.productName},function (err, data) {
                res.json(data);
            });
        });
    });


    app.get('/getProductDetails/:productName',function(req, res) {

        console.log("Getting the bigpicture")
        productDetails.find({
            productName : req.params.productName
        }, function(err, data) {
            if (err)
                res.send(err);
            console.log(data)
            res.json(data);
        });

    });


//Admin Config

    app.post('/setAdminConfig',function(req, res) {

        adminConfig.create(
            {userTemplate: req.body.userTemplate

            },
            function(err,data){
                console.log(data);
                if (err)
                    res.send(err);

                adminConfig.find({
                    productName : req.body.productName
                }, function(err, data) {
                    if (err)
                        res.send(err);
                    res.json(data);
                });
            }
        );
    });


    app.get('/getAdminConfig',function(req, res) {
        adminConfig.find(
            function(err,data){
                console.log(data);
                if (err)
                    res.send(err);

                adminConfig.find({
                    productName : req.body.productName
                }, function(err, data) {
                    if (err)
                        res.send(err);
                    res.json(data);
                });
            }
        );
    });


    app.delete('/resetConfig', function(req, res) {



        adminConfig.remove(function (err, data) {
            res.json(data);
        });
    });


    //Generate Hypothesis
    app.post('/generateHypothesis',function(req, res) {
        console.log("I am going to set admin Config");
        hypothesis.create(
            {productName: req.body.productName,
             hypothesis: req.body.hypothesis,
            },
            function(err,data){
                console.log(data);
                if (err)
                    res.send(err);

                hypothesis.find({
                    productName : req.body.productName
                }, function(err, data) {
                    if (err)
                        res.send(err);
                    res.json(data);
                });
            }
        );
    });


    app.get('/getHypothesis/:productName',function(req, res) {

        console.log("Getting hypothesis");
        hypothesis.find({
            productName : req.params.productName
        }, function(err, data) {
            if (err)
                res.send(err);
            console.log(data)
            res.json(data);
        });
    });

    app.put('/editHypothesis', function(req, res) {

            hypothesis.update( {productName:req.body.productName},{hypothesis:req.body.hypothesis}, function ( err, data ) {
                console.log(data);
                if (err)
                    res.send(err);

                hypothesis.find({
                    productName : req.body.productName
                }, function(err, data) {
                    if (err)
                        res.send(err);
                    res.json(data);
                });

        });
    });



    app.get('/dialogActor.html', function (req, res) {
            res.render('dialogActor.hbs', {
                baseUrl: req.context.hostBaseUrl
            });
        }
    );

    app.get('/dialogActivity.html', function (req, res) {
            res.render('dialogActivity.hbs', {
                baseUrl: req.context.hostBaseUrl
            });
        }
    );

    app.get('/dialogFeature.html', function (req, res) {
            res.render('dialogFeature.hbs', {
                baseUrl: req.context.hostBaseUrl
            });
        }
    );

    app.get('/deleteActorDialog.html', function (req, res) {
            res.render('deleteActorDialog.hbs', {
                baseUrl: req.context.hostBaseUrl
            });
        }
    );

    app.get('/deleteActivityDialog.html', function (req, res) {
            res.render('deleteActivityDialog.hbs', {
                baseUrl: req.context.hostBaseUrl
            });
        }
    );

    app.get('/deleteFeatureDialog.html', function (req, res) {
            res.render('deleteFeatureDialog.hbs', {
                baseUrl: req.context.hostBaseUrl
            });
        }
    );

    app.get('/editActorDialog.html', function (req, res) {
            res.render('editActorDialog.hbs', {
                baseUrl: req.context.hostBaseUrl
            });
        }
    );


    app.get('/editActivityDialog.html', function (req, res) {
            res.render('editActivityDialog.hbs', {
                baseUrl: req.context.hostBaseUrl
            });
        }
    );

    app.get('/previewVisionDialog.html', function (req, res) {
            res.render('previewVisionDialog.hbs', {
                baseUrl: req.context.hostBaseUrl
            });
        }
    );


    // app/routes.js

    // Add any additional route handlers you need for views or REST resources here...


    // load any additional files you have in routes and apply those to the app
    {
        var fs = require('fs');
        var path = require('path');
        var files = fs.readdirSync("routes");
        var productDiscovery = require('../app/models/leanGearsDiscovery');
        var impactMapActor = require('../app/models/impactMapActor');
        var impactMapActivity = require('../app/models/impactMapActivity');
        var impactMapFeature = require('../app/models/impactMapFeature');

        var bigPicture =  require('../app/models/ProductCanvas/bigPicture');
        var productDetails =  require('../app/models/ProductCanvas/productDetails');
        var targetGroup =  require('../app/models/ProductCanvas/targetGroup');
        var adminConfig = require('../app/models/admin/adminConfig');

        var hypothesis = require('../app/models/hypothesis');

        for(var index in files) {
            var file = files[index];
            if (file === "index.js") continue;
            // skip non-javascript files
            if (path.extname(file) != ".js") continue;

            var routes = require("./" + path.basename(file));

            if (typeof routes === "function") {
                routes(app, addon);
            }
        }
    }
};


