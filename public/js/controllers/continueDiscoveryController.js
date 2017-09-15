

/*Directives for connection for impact map*/


angular.module('mainModule').controller('ContinueDiscoveryController' , function($scope, $http, $q, usSpinnerService){



    $scope.productDiscovery = function(productName){


        $scope.productName = productName;
        document.getElementById('continueDiscovery').style.display = "none";
        $http.get('/getCurrentDiscovery/' + $scope.productName).success(function(data){


            $scope.productDiscoveryData = data;

        }).error(function(data){
            console.log('Error: ' + data)
        });

        document.getElementById('productDiscovery').style.display = "block";

    };

    $scope.productEnvision = function(){


        document.getElementById('continueDiscovery').style.display = "none";
        document.getElementById('envision-product').style.display = "block";
        document.getElementById('productDiscovery').style.display = "none";
        document.getElementById('coll-chart').style.display = "none";
    }

    $scope.collChart = function(){

        console.log("Check whose product is this" + $scope.productName)

        $http.get('/getCurrentDiscovery/' + $scope.productName).success(function(data){


            $scope.productDiscoveryData = data;

        }).error(function(data){
            console.log('Error: ' + data)
        });
        getImpactMap();

        document.getElementById('productDiscovery').style.display = "none";
        document.getElementById('envision-product').style.display = "none";
        document.getElementById('coll-chart').style.display = "block";


    };

    $scope.addActor = function(){

        AP.require('dialog', function(dialog){
            dialog.create({
                key: 'actor-content',
                width: '40%',
                height: '30%',
                header: "Add Actor",
                chrome: true,
            });
        });

        AP.require('events', function(events){
            events.once('customEvent', function(){
                var actor = arguments[0];
                actor = actor.trim();
                var data = {
                    productName: $scope.productName,
                    checked: false,
                    actor: actor
                };
                usSpinnerService.spin('spinner-addActor');

                $http.post('/addActor', data)
                    .success(function(data){
                        console.log(data);
                        if(data.length == 0){
                            AP.require("messages", function(messages){
                                //create a message
                                var message = messages.error('','Actor exists, Choose a different actor');
                                setTimeout(function(){
                                    messages.clear(message);
                                }, 2000);
                            });
                        }

                        else{
                            /*$scope.actors = [];

                             for (var actor in data){

                             $scope.actors.push({
                             checked : data[actor].checked,
                             id : data[actor].actor
                             });
                             }*/
                            getImpactMap();
                            AP.require("messages", function(messages){
                                //create a message
                                var message = messages.success('','Actor added');
                                setTimeout(function(){
                                    messages.clear(message);
                                }, 2000);
                            });

                        }

                    }).error(function(data){
                        AP.require("messages", function(messages){
                            //create a message
                            var message = messages.error('','Error in Adding Actor');
                            setTimeout(function(){
                                messages.clear(message);
                            }, 2000);
                        });
                    });

                usSpinnerService.stop('spinner-addActor');
            });
        });

    };

    $scope.addActivity = function(actor){

        var param1=actor;

        AP.require('events', function(events) {
            events.on('getDynamicParams', function() {
                events.emit('loadDyamicParams', param1);
                events.offAll('getDynamicParams');
            });
        });

        AP.require('dialog', function(dialog){
            dialog.create({
                key: 'activity-content',
                width: '40%',
                height: '30%',
                header: "Add Activity",
                chrome: true,

            });
        });

        AP.require('events', function(events){
            events.once('customEvent', function(){

                var activity = arguments[0];
                activity = activity.trim();
                var data = {
                    productName: $scope.productName,
                    actor: actor,
                    activity : activity,
                    checked: false
                };

                usSpinnerService.spin('spinner-addActivity');
                $http.post('/addActivity', data)
                    .success(function(data){


                        if(data.length == 0){
                            AP.require("messages", function(messages){
                                //create a message
                                var message = messages.error('','Activity exists, Choose a different activity');
                                setTimeout(function(){
                                    messages.clear(message);
                                }, 2000);
                            });
                        }else{

                            /*$scope.data = data;
                             $scope.activities = [];

                             for (var activity in data) {

                             $scope.activities.push({
                             text: data[activity].activity,
                             id: data[activity].actor,
                             checked: data[activity].checked
                             });
                             }*/
                            getImpactMap();

                            actor = "";
                            AP.require("messages", function(messages){
                                //create a message
                                var message = messages.success('','Activity added');
                                setTimeout(function(){
                                    messages.clear(message);
                                }, 2000);
                            });

                        }



                    }).error(function(data){

                        AP.require("messages", function(messages){
                            //create a message
                            var message = messages.error('','Error in Adding Activity');
                            setTimeout(function(){
                                messages.clear(message);
                            }, 2000);
                        });
                    });

                usSpinnerService.stop('spinner-addActivity');
            });
        });



    };
    $scope.addFeature = function(actor,impact){

        var param1=actor;
        var param2=impact;
        AP.require('events', function(events) {
            events.on('getDynamicParams', function() {
                events.emit('loadDyamicParams', param1,param2);
                events.offAll('getDynamicParams');
            });
        });

        AP.require('dialog', function(dialog){
            dialog.create({
                key: 'feature-content',
                width: '40%',
                height: '30%',
                header: "Add Feature",
                chrome: true,

            });
        });

        AP.require('events', function(events){
            events.once('customEvent', function(){

                console.log(arguments[0]);
                var feature = arguments[0];
                feature = feature.trim();
                var data = {
                    productName: $scope.productName,
                    actor: actor,
                    activity: impact,
                    feature : feature,
                    checked : false
                };

                $scope.template;
                $scope.templatingSummary;
                usSpinnerService.spin('spinner-addFeature');
                $http.get('/getAdminConfig/').success(function(data){
                    console.log(data);
                    if(data.length == 0){
                        $scope.template = "NO";
                        $scope.templatingSummary = feature;
                    }else{
                        /*$scope.template = data[0].userTemplate;*/
                        $scope.templatingSummary = 'As ' + actor + ' I want '+ feature + ' So that I can ' + impact;
                    }

                    var issueData={
                        "fields": {
                            "project":
                            {
                                "key": $scope.productDiscoveryData[0].projectKey
                            },
                            "summary": $scope.templatingSummary,
                            "description": impact,
                            "issuetype": {
                                "name": "Bug"
                            },
                            "labels": [
                                $scope.productName.replace(/\s/g, ''),
                                actor.replace(/\s/g, ''),
                                impact.replace(/\s/g, '')
                            ],
                        }
                    };


                    AP.require('request', function(request){

                        request({
                            type: "POST",
                            url: "/rest/api/2/issue",
                            dataType: "json",
                            data: JSON.stringify(issueData),
                            contentType: "application/json",

                            success: function (data) {
                                /*status = true;*/

                                data = JSON.parse(data);


                                AP.require("messages", function(messages){
                                    //create a message
                                    var message = messages.success('','Issue Created' /*+ data.key*/ );
                                    setTimeout(function(){
                                        messages.clear(message);
                                    }, 2000);
                                });

                                var data = {
                                    productName: $scope.productName,
                                    actor: actor,
                                    activity: impact,
                                    feature : feature,
                                    issueKey : data.key,
                                    checked : false
                                };



                                $http.post('/addFeature', data)
                                    .success(function(data){
                                        $scope.data = data;
                                        $scope.features = [];

                                        for (var feature in data){

                                            $scope.features.push({
                                                text : data[feature].feature,
                                                key:data[feature].activity,
                                                id : data[feature].actor,
                                                issueId: data[feature].issueKey,
                                                checked: data[feature].checked

                                            });
                                        }

                                        AP.require("messages", function(messages){
                                            //create a message
                                            var message = messages.success('','Feature Added');
                                            setTimeout(function(){
                                                messages.clear(message);
                                            }, 2000);
                                        });

                                    }).error(function(data){
                                        AP.require("messages", function(messages){
                                            //create a message
                                            var message = messages.error('','Error in Adding Feature');
                                            setTimeout(function(){
                                                messages.clear(message);
                                            }, 2000);
                                        });
                                    });

                            },
                            error: function (data) {
                                data = JSON.parse(data);
                                AP.require("messages", function(messages){
                                    //create a message
                                    var message = messages.error('','Error in Creating JIRA Issue');
                                    setTimeout(function(){
                                        messages.clear(message);
                                    }, 2000);
                                });
                            },


                        });

                    });

                }).error(function(data){
                    console.log('Error: ' + data)
                });
                usSpinnerService.stop('spinner-addFeature');

            });
        });

    };


    $scope.discoverProductFeatures = function(){


        usSpinnerService.spin('spinner-discoverProductFeatures');
        document.getElementById('continueDiscovery').style.display = "none";
        document.getElementById('impactMap').style.display = "block";
        document.getElementById('generateProductCanvas').style.display = "none";
        document.getElementById('productCanvas').style.display = "none";
        usSpinnerService.stop('spinner-discoverProductFeatures');

        usSpinnerService.stop('spinner-deleteActor');
        usSpinnerService.stop('spinner-editActor');
        /*usSpinnerService.stop('spinner-addActor');*/
        usSpinnerService.stop('spinner-addActivity');
        usSpinnerService.stop('spinner-deleteActivity');
        usSpinnerService.stop('spinner-editActivity');
        usSpinnerService.stop('spinner-addFeature');
        usSpinnerService.stop('spinner-deleteFeature');

    };

    $scope.generateProductCanvas = function(){

        usSpinnerService.spin('spinner-generateProductCanvas');
        $http.get('/getHypothesis/' +  $scope.productName)
            .success(function(data){

                $scope.data = data;

                $scope.hypothesis;
                for (var value in data){
                    $scope.hypothesis =data[value].hypothesis;
                }


            }).error(function(data){
                console.log('Error in getting Hypothesis' + data)
            });

        $http.get('/getTargetGroup/' + $scope.productName).success(function(data){

            $scope.data = data;
            $scope.targetGroup = [];


            /*How this for loop is working*/

            for (var actor in data){

            }
            items = data[actor].actor;
            for (var item in items){
                $scope.targetGroup.push(items[item]);
            }

            $scope.prograssing = false;


        }).error(function(data){
            console.log('Error: ' + data)
        });

        document.getElementById('continueDiscovery').style.display = "none";
        document.getElementById('impactMap').style.display = "none";
        document.getElementById('productCanvas').style.display = "none";
        document.getElementById('generateProductCanvas').style.display = "block";
        usSpinnerService.stop('spinner-generateProductCanvas');

    };


    $scope.productCanvas = function(){

        usSpinnerService.spin('spinner-productCanvas');
        document.getElementById('continueDiscovery').style.display = "none";
        document.getElementById('impactMap').style.display = "none";
        document.getElementById('generateProductCanvas').style.display = "none";
        document.getElementById('productCanvas').style.display = "block";

        $scope.prograssing1 = true;
        $scope.prograssing2 = true;
        $scope.prograssing2 = true;
        $http.get('/getTargetGroup/' + $scope.productName).success(function(data){

            $scope.data = data;

            $scope.targetGroup = [];
            /*How this for loop is working*/

            for (var actor in data){

            }
            items = data[actor].actor;
            for (var item in items){
                $scope.targetGroup.push(items[item]);
            }
            $scope.prograssing = false;

        }).error(function(data){
            console.log('Error: ' + data)
        });

        $http.get('/getBigPicture/' + $scope.productName).success(function(data){

            $scope.data = data;

            $scope.bigPicture = [];


            for (var value in data){

                $scope.bigPicture.push({
                    key:data[value].activity,
                    id : data[value].actor
                });
            }
            $scope.prograssing2 = false;
        }).error(function(data){
            console.log('Error: ' + data)
        });

        $http.get('/getProductDetails/' + $scope.productName).success(function(data){

            $scope.data = data;

            $scope.productDetails = [];

            for (var value in data){
                $scope.productDetails.push({

                    key:data[value].feature,
                    id : data[value].actor
                });
            }
            $scope.prograssing3 = false;
        }).error(function(data){
            console.log('Error: ' + data)
        });

        $http.get('/getHypothesis/' +  $scope.productName)
            .success(function(data){

                $scope.data = data;

                $scope.hypothesis;
                for (var value in data){

                    $scope.hypothesis =data[value].hypothesis;

                }


            }).error(function(data){
                console.log('Error in getting Hypothesis' + data)
            });

        usSpinnerService.stop('spinner-productCanvas');
    };

    $('input:checkbox').change( fnTest );



// Clicking the Generate Canvas Button should run submit(), pop up displays all checked boxes
    /*$('.generate-canvas-button').click(submit);*/

    /*$(".generate-canvas-button").click(function() {
     alert(this.id);
     });*/

    $scope.defaultTargetGroup = []
    $('#generate-canvas-button').click(submit);
    $('#regenerate-canvas-button').click(submit);





    function fnTest(e) {
        // Set all child checkboxes to the same value
        $(this).prop('checked', $(this).prop('checked')).val();

    };


    function submit(check) {

        usSpinnerService.spin('spinner-1');
        resetStatus();
        var targetGroupActors = [];
        var bigPictureActivity = [];
        var productDetailsFeatures = [];

        var myData = deleteProductCanvas();
        myData.then(function (check) {

            $('input:checkbox:checked').each(function() {


                var name = $(this).attr('name');

                impactMapValues = $( this ).prop('id');
                impactMapActor = $( this ).prop('name');
                var value = document.getElementById(impactMapValues).value;


                if (impactMapActor == "actor-checkbox"){

                    targetGroupActors.push(value);

                }

                if (impactMapActor == "activity-checkbox"){

                    var result = value.split(",")

                    actor_value = result[0]
                    activity_value = result[1]

                    bigPictureActivity.push({
                        key : actor_value,
                        value : activity_value
                    });

                }

                if (impactMapActor == "feature-checkbox"){

                    var result = value.split(",")
                    actor_value = result[0]
                    activity_value = result[1]
                    feature_value = result[2]


                    productDetailsFeatures.push({
                        key : actor_value,
                        value : activity_value,
                        feature : feature_value
                    });


                }

            });


            if (targetGroupActors.length == 0){
                AP.require("messages", function(messages){
                    //create a message
                    var message = messages.error('','Product Canvas cannot be generated without Target Group' /*+ data.key*/ );
                    setTimeout(function(){
                        messages.clear(message);
                    }, 2000);
                });
                usSpinnerService.stop('spinner-1');

            }else{
                generateTargetGroup(targetGroupActors);
                generateBigPicture(bigPictureActivity );
                generateProductDetails(productDetailsFeatures);
                usSpinnerService.stop('spinner-1');


            }

        });

    };

    function deleteProductCanvas(){
        $http.delete('/deleteFromTargetGroup/' + $scope.productName).success(function(data){

        }).error(function(data){
            console.log('Error: ' + data)
        });

        $http.delete('/deleteFromBigPicture/' + $scope.productName).success(function(data){


        }).error(function(data){
            console.log('Error: ' + data)
        });

        return $http.delete('/deleteFromProductDetails/' + $scope.productName).success(function(data){

        }).error(function(data){
            console.log('Error: ' + data)
        });
    }
    function resetStatus(){

        var editData ={

            productName: $scope.productName,
            checked : false,

        };

        $http.put('/resetStatus', editData)
            .success(function(data){
                console.log(data);

            }).error(function(data){
                console.log('Error in changing checked status' + data)
            });
    }

    function generateTargetGroup(actors){

        for (var actor in actors){


            var data ={
                productName: $scope.productName,
                checked : true,
                actor: actors[actor]
            };

            $http.post('/addToTargetGroup', data)
                .success(function(data){


                    $scope.targetGroup = [];

                    for (var item in data){
                        $scope.targetGroup.push(data[item].actor);
                    }

                    AP.require("messages", function(messages){
                        //create a message
                        var message = messages.success('','Target Group added to Product Canvas' /*+ data.key*/ );
                        setTimeout(function(){
                            messages.clear(message);
                        }, 2000);
                    });

                }).error(function(data){
                    AP.require("messages", function(messages){
                        //create a message
                        var message = messages.error('','Error in adding Target Group' /*+ data.key*/ );
                        setTimeout(function(){
                            messages.clear(message);
                        }, 2000);
                    });
                });

        }

    }

    function generateBigPicture(activities){

        for (var key in activities){

            var data ={
                productName: $scope.productName,
                checked : true,
                actor: activities[key].key,
                activity: activities[key].value
            };

            $http.post('/addToBigPicture', data)
                .success(function(data){
                    $scope.data = data;
                    $scope.bigPicture = [];

                    for (var value in data){

                        $scope.bigPicture.push({
                            key:data[value].activity,
                            id : data[value].actor
                        });
                    }
                    AP.require("messages", function(messages){
                        //create a message
                        var message = messages.success('','Big Picture added to Product Canvas' /*+ data.key*/ );
                        setTimeout(function(){
                            messages.clear(message);
                        }, 2000);
                    });

                }).error(function(data){
                    AP.require("messages", function(messages){
                        //create a message
                        var message = messages.error('','Error in adding Big Picture' /*+ data.key*/ );
                        setTimeout(function(){
                            messages.clear(message);
                        }, 2000);
                    });
                });

        }

    }

    function generateProductDetails(features){

        for (var key in features){

            var data ={
                productName: $scope.productName,
                checked : true,
                actor: features[key].key,
                activity: features[key].value,
                feature: features[key].feature
            };

            $http.post('/addToProductDetails', data)
                .success(function(data){

                    AP.require("messages", function(messages){
                        //create a message
                        var message = messages.success('','Product Details added to Product Canvas' /*+ data.key*/ );
                        setTimeout(function(){
                            messages.clear(message);
                        }, 2000);
                    });
                    /*$scope.data = data;
                     console.log(data)
                     $scope.productDetails = [];

                     for (var value in data){
                     $scope.productDetails.push({

                     key:data[value].feature,
                     id : data[value].actor
                     });
                     }
                     */
                }).error(function(data){
                    AP.require("messages", function(messages){
                        //create a message
                        var message = messages.error('','Error in adding Product Details' /*+ data.key*/ );
                        setTimeout(function(){
                            messages.clear(message);
                        }, 2000);
                    });
                });




        }

    }

    $scope.hypothesisButton = "Define Business Hypothesis Goal";
    $scope.editHypothesisButton = "Edit Business Hypothesis Goal";

    $scope.generateHypothesis = function(){

        AJS.dialog2("#hypothesis-dialog").show();

        $("#dialog-hypothesis-close-button").click(function(e) {
            e.preventDefault();
            AJS.dialog2("#hypothesis-dialog").hide();
        });




        $("#hypotheis-dialog-submit").click(function(e) {
            usSpinnerService.spin('spinner-generateHyothesis');

            e.preventDefault();
            var hypothesis = $('#hypothesis').val();

            /*if (hypothesis == "") {
             $('.hypothesis-error').html(AJS.I18n.getText('hypothesis.empty'));
             return;
             }*/

            AJS.dialog2("#hypothesis-dialog").hide();

            var data = {
                productName: $scope.productName,
                hypothesis: hypothesis,

            };

            $http.post('/generateHypothesis', data)
                .success(function(data){

                    AP.require("messages", function(messages){
                        //create a message
                        var message = messages.success('','Hypothesis Goal Generated');
                        setTimeout(function(){
                            messages.clear(message);
                        }, 2000);
                    });

                    $scope.hypothesisButton = $scope.editHypothesisButton;

                }).error(function(data){
                    AP.require("messages", function(messages){
                        //create a message
                        var message = messages.error('','Error in generating Hypothesis Goal');
                        setTimeout(function(){
                            messages.clear(message);
                        }, 2000);
                    });
                });

            usSpinnerService.stop('spinner-generateHyothesis');

        });

    }

    $scope.editHypothesis = function(){
        AJS.dialog2("#hypothesis-edit-dialog").show();

        $("#edit-dialog-hypothesis-close-button").click(function(e) {
            e.preventDefault();
            AJS.dialog2("#hypothesis-edit-dialog").hide();
        });




        $("#edit-hypothesis-dialog-submit").click(function(e) {
            usSpinnerService.spin('spinner-editHyothesis');
            e.preventDefault();
            var hypothesis = $('#edit-hypothesis').val();


            /*if (hypothesis == "") {
             $('.hypothesis-error').html(AJS.I18n.getText('hypothesis.empty'));
             return;
             }*/

            AJS.dialog2("#hypothesis-edit-dialog").hide();

            var data = {
                productName: $scope.productName,
                hypothesis: hypothesis,

            };

            $http.put('/editHypothesis', data)
                .success(function(data){

                    AP.require("messages", function(messages){
                        //create a message
                        var message = messages.success('','Hypothesis Goal Edited');
                        setTimeout(function(){
                            messages.clear(message);
                        }, 2000);
                    });

                }).error(function(data){
                    AP.require("messages", function(messages){
                        //create a message
                        var message = messages.error('','Error in editing Hypothesis Goal');
                        setTimeout(function(){
                            messages.clear(message);
                        }, 2000);
                    })
                });

            usSpinnerService.stop('spinner-editHyothesis');

        });
    }


    // Hides the dialog



    var productNameId;

    $(".dialog-show-button-product-delete").click(function() {
        AJS.dialog2("#product-delete-dialog").show();

        productNameId = AJS.$(this).attr("product-id");


    });

    $("#dialog-delete-product-close-button").click(function(e) {
        e.preventDefault();
        AJS.dialog2("#product-delete-dialog").hide();
    });

    $(".dialog-product-delete-submit-button").click(function(e) {
        e.preventDefault();

        $('.deleteError').html("");
        $scope.deleteDiscovery = $('#deleteDiscovery').val();

        console.log("Deleting discovery" + productNameId);


        if($scope.deleteDiscovery == "DELETE" ){


            $http.delete('/deleteDiscovery/' + productNameId).success(function(data){
                window.location.reload();

            }).error(function(data){

                console.log('Error: ' + data)
            });
        }

        else if(deleteDiscovery == "" ){

            $('.deleteError').html('Please type DELETE');
            return;


        }
        else{
            $('.deleteError').html('Please type DELETE');
            return;
        }

    });



    $(".dialog-product-vision-edit-button").click(function() {

        AJS.dialog2(".product-vision-dialog").show();

    });
    $(".dialog-close-button-product-vision").click(function(e) {
        e.preventDefault();
        AJS.dialog2(".product-vision-dialog").hide();
    });

    $(".SubmitProductVisionFirst").click(function(e) {
        e.preventDefault();

        var data = {

            productName : $scope.productName,
            endUsers : $('#editEndUsersFirst').val(),
            problemsArea : $('#editProblemsAreaFirst').val(),
            productKind : $('#editProductKindFirst').val(),
            problemSoln : $('#editProblemSolutionFirst').val(),
            competitors : $('#editCompetitorsFirst').val(),
            differentiator : $('#editDifferntitaorFirst').val()

        };

        $http.put('/editDiscovery' , data).success(function(data){
            $scope.productDiscoveryData = data;


        }).error(function(data){
            console.log('Error: ' + data)
        });

        console.log(data)

        AJS.dialog2(".product-vision-dialog").hide();

    });
    $(".SubmitProductVision").click(function(e) {
        e.preventDefault();

        var data = {

            productName : $scope.productName,
            endUsers : $('#editEndUsers').val(),
            problemsArea : $('#editProblemsArea').val(),
            productKind : $('#editProductKind').val(),
            problemSoln : $('#editProblemSolution').val(),
            competitors : $('#editCompetitors').val(),
            differentiator : $('#editDifferntitaor').val()

        };

        $http.put('/editDiscovery' , data).success(function(data){

            $scope.productDiscoveryData = data;

        }).error(function(data){

            console.log('Error: ' + data)
        });

        console.log(data)

        AJS.dialog2(".product-vision-dialog").hide();

    });



    $scope.deleteActor = function(actor){


        AP.require('dialog', function(dialog){
            dialog.create({
                key: 'delete-actor-content',
                width: '40%',
                height: '30%',
                chrome: true,
            });
        });

        AP.require('events', function(events){
            events.once('customEvent', function(){

                usSpinnerService.spin('spinner-deleteActor');
                $http.delete('/deleteActor/' + $scope.productName + '/' + actor).success(function(data){

                    getImpactMap();

                    /*$scope.data = data;
                     $scope.actors = [];

                     console.log(data)

                     for (var actor in data){

                     console.log(data[actor].checked)
                     console.log(data[actor].actor)

                     $scope.actors.push({
                     checked : data[actor].checked,
                     id : data[actor].actor
                     });
                     }

                     console.log($scope.actors)*/

                    AP.require("messages", function(messages){
                        //create a message
                        var message = messages.success('','Actor deleted');
                        setTimeout(function(){
                            messages.clear(message);
                        }, 2000);
                    });

                }).error(function(data){

                    AP.require("messages", function(messages){
                        //create a message
                        var message = messages.error('','Actor cannot be deleted');
                        setTimeout(function(){
                            messages.clear(message);
                        }, 2000);
                    });
                });

                usSpinnerService.stop('spinner-deleteActor');
            });
        });

    }
    $scope.deleteActivity = function(actor,activity){

        AP.require('dialog', function(dialog){
            dialog.create({
                key: 'delete-activity-content',
                width: '40%',
                height: '30%',
                chrome: true,
            });
        });

        AP.require('events', function(events){
            events.once('customEvent', function(){

                $http.delete('/deleteActivity/' + $scope.productName + '/' + actor + '/' + activity).success(function(data){
                    $scope.data = data;
                    $scope.activities = [];

                    for (var activity in data) {

                        $scope.activities.push({
                            text: data[activity].activity,
                            id: data[activity].actor,
                            checked: data[activity].checked

                        });
                    }
                    AP.require("messages", function(messages){
                        //create a message
                        var message = messages.success('','Activity deleted');
                        setTimeout(function(){
                            messages.clear(message);
                        }, 2000);
                    });

                }).error(function(data){

                    AP.require("messages", function(messages){
                        //create a message
                        var message = messages.error('','Activity cannot be deleted');
                        setTimeout(function(){
                            messages.clear(message);
                        }, 2000);
                    });
                });
            });
        });
    }
    $scope.deleteFeature = function(actor,activity,feature){


        AP.require('dialog', function(dialog){
            dialog.create({
                key: 'delete-feature-content',
                width: '40%',
                height: '30%',
                chrome: true,
            });
        });

        AP.require('events', function(events){
            events.once('customEvent', function(){

                usSpinnerService.start('spinner-deleteFeature');
                $http.delete('/deleteFeature/' + $scope.productName + '/' + actor + '/' + activity + '/' + feature).success(function(data){

                    /*window.location.reload()*/

                    $scope.data = data;
                    $scope.features = [];

                    console.log($scope.data)
                    for (var feature in data){

                        $scope.features.push({
                            text : data[feature].feature,
                            key:data[feature].activity,
                            id : data[feature].actor,
                            issueId:data[feature].issueKey,
                            checked: data[feature].checked

                        });
                    }

                    AP.require("messages", function(messages){
                        //create a message
                        var message = messages.success('','Feature deleted');
                        setTimeout(function(){
                            messages.clear(message);
                        }, 2000);
                    });

                }).error(function(data){

                    AP.require("messages", function(messages){
                        //create a message
                        var message = messages.error('','Feature cannot be deleted');
                        setTimeout(function(){
                            messages.clear(message);
                        }, 2000);
                    });
                });
                usSpinnerService.stop('spinner-deleteFeature');
            });
        });

    }

    $scope.editActor = function(actor){


        var param1 = actor
        AP.require('events', function(events) {
            events.on('getDynamicParams', function() {
                events.emit('loadDyamicParams', param1);
                events.offAll('getDynamicParams');
            });
        });

        AP.require('dialog', function(dialog){
            dialog.create({
                key: 'edit-actor-content',
                width: '40%',
                height: '30%',
                chrome: true,
                header: 'Edit Actor'
            });
        });

        AP.require('events', function(events){
            events.once('customEvent', function(){

                var updatedActor = arguments[0];
                updatedActor = updatedActor.trim()
                var data = {
                    productName: $scope.productName,
                    actor: actor,
                    newValue: updatedActor
                };

                usSpinnerService.spin('spinner-editActor');
                $http.put('/editActor' , data).success(function(data){

                    if(data.length == 0){
                        AP.require("messages", function(messages){
                            //create a message
                            var message = messages.error('','Actor exists, Choose a different actor');
                            setTimeout(function(){
                                messages.clear(message);
                            }, 2000);
                        });
                    }else{

                        getImpactMap();

                        $http.get('/getIssues/'+ $scope.productName + '/' + updatedActor).success(function(data){
                            for(var key in data){

                                var issueData={
                                    "fields": {
                                        "labels": [
                                            $scope.productName.replace(/\s/g, ''),
                                            updatedActor.replace(/\s/g, ''),
                                            data[key].activity.replace(/\s/g, '')
                                        ]
                                    }
                                };

                                AP.require('request', function(request){

                                    request({
                                        type: "PUT",
                                        url: "/rest/api/2/issue/"+data[key].issueKey ,
                                        dataType: "json",
                                        data: JSON.stringify(issueData),
                                        contentType: "application/json",

                                        success: function (data) {
                                            /*status = true;*/
                                            console.log(data)
                                            data = JSON.parse(data);


                                            /*AP.require("messages", function(messages){
                                             //create a message
                                             var message = messages.success('','Issue Created' /!*+ data.key*!/ );
                                             setTimeout(function(){
                                             messages.clear(message);
                                             }, 2000);
                                             });*/

                                        },
                                        error: function (data) {
                                            data = JSON.parse(data);
                                            /*AP.require("messages", function(messages){
                                             //create a message
                                             var message = messages.error('','Error in Editing JIRA Issue');
                                             setTimeout(function(){
                                             messages.clear(message);
                                             }, 2000);
                                             });*/
                                        },


                                    });

                                });

                            }

                        }).error(function(data){

                        });
                        AP.require("messages", function(messages){
                            //create a message
                            var message = messages.success('','Actor Edited');
                            setTimeout(function(){
                                messages.clear(message);
                            }, 2000);
                        });

                    }


                }).error(function(data){

                    AP.require("messages", function(messages){
                        //create a message
                        var message = messages.error('','Actor cannot be edited');
                        setTimeout(function(){
                            messages.clear(message);
                        }, 2000);
                    });
                });
                usSpinnerService.stop('spinner-editActor');
            });
        });

    }
    $scope.editActivity = function(actor,activity){

        var param1= activity;
        AP.require('events', function(events) {
            events.on('getDynamicParams', function() {
                events.emit('loadDyamicParams', param1);
                events.offAll('getDynamicParams');
            });
        });

        AP.require('dialog', function(dialog){
            dialog.create({
                key: 'edit-activity-content',
                width: '40%',
                height: '30%',
                chrome: true,
                header: 'Edit Activity'
            });
        });

        AP.require('events', function(events){
            events.once('customEvent', function(){

                var updatedActivity = arguments[0];
                updatedActivity = updatedActivity.trim()
                var data = {
                    productName: $scope.productName,
                    actor: actor,
                    activity: activity,
                    newValue: updatedActivity
                };
                usSpinnerService.spin('spinner-editActivity');
                $http.put('/editActivity' , data).success(function(data){

                    if(data.length == 0){
                        AP.require("messages", function(messages){
                            //create a message
                            var message = messages.error('','Activity exists, Choose a different activity');
                            setTimeout(function(){
                                messages.clear(message);
                            }, 2000);
                        });
                    }else{

                        $scope.data = data;
                        $scope.activities = [];
                        getImpactMap();

                        $http.get('/getIssuesActivity/'+ $scope.productName + '/' + actor + '/' + updatedActivity).success(function(data){

                            for(var key in data){

                                var issueData={
                                    "fields": {
                                        "labels": [
                                            $scope.productName.replace(/\s/g, ''),
                                            data[key].actor.replace(/\s/g, ''),
                                            updatedActivity.replace(/\s/g, ''),
                                        ]
                                    }
                                };

                                AP.require('request', function(request){

                                    request({
                                        type: "PUT",
                                        url: "/rest/api/2/issue/"+data[key].issueKey ,
                                        dataType: "json",
                                        data: JSON.stringify(issueData),
                                        contentType: "application/json",

                                        success: function (data) {
                                            /*status = true;*/
                                            console.log(data)
                                            data = JSON.parse(data);


                                            /*AP.require("messages", function(messages){
                                             //create a message
                                             var message = messages.success('','Issue Created' /!*+ data.key*!/ );
                                             setTimeout(function(){
                                             messages.clear(message);
                                             }, 2000);
                                             });*/

                                        },
                                        error: function (data) {
                                            data = JSON.parse(data);
                                            /*AP.require("messages", function(messages){
                                             //create a message
                                             var message = messages.error('','Error in Editing JIRA Issue');
                                             setTimeout(function(){
                                             messages.clear(message);
                                             }, 2000);
                                             });*/
                                        },


                                    });

                                });

                            }

                        }).error(function(data){

                        });
                        AP.require("messages", function(messages){
                            //create a message
                            var message = messages.success('','Activity edited');
                            setTimeout(function(){
                                messages.clear(message);
                            }, 2000);
                        });

                    }


                }).error(function(data){

                    AP.require("messages", function(messages){
                        //create a message
                        var message = messages.error('','Activity cannot be edited');
                        setTimeout(function(){
                            messages.clear(message);
                        }, 2000);
                    });
                });
                usSpinnerService.stop('spinner-editActivity');
            });
        });
    }



    function getImpactMap(){

        $http.get('/getActors/' + $scope.productName).success(function(data){


            $scope.data = data;
            $scope.actors = [];

            $scope.actors = [];
            for (var actor in data){

                console.log(data[actor].checked)
                console.log(data[actor].actor)

                $scope.actors.push({
                    checked : data[actor].checked,
                    id : data[actor].actor
                });
            }

        }).error(function(data){
            console.log('Error: ' + data)
        });


        $http.get('/getActivity/' + $scope.productName).success(function(data){


            $scope.data = data;
            $scope.activities = [];

            for (var activity in data) {

                $scope.activities.push({
                    text: data[activity].activity,
                    id: data[activity].actor,
                    checked: data[activity].checked

                });
            }

        }).error(function(data){
            console.log('Error: ' + data)
        });


        $http.get('/getFeatures/' + $scope.productName).success(function(data){

            $scope.data = data;
            $scope.features = [];

            for (var feature in data){

                $scope.features.push({
                    text : data[feature].feature,
                    key:data[feature].activity,
                    id : data[feature].actor,
                    issueId:data[feature].issueKey,
                    checked: data[feature].checked


                });
            }


        }).error(function(data){
            console.log('Error: ' + data)
        });

    };


})
    .directive('createConnections', function($interval) {
        return {
            restrict: 'EA',
            link: function(scope, element, attrs) {

                element.connections({ from:'div.new-div' }).length;
                /*element.connections(attrs).length;*/
                var connections = angular.element('connection, inner');
                $interval(function() { connections.connections('update') }, 10);
            }
        };
    })
    .directive('updateConnections', function($interval) {
        return {
            restrict: 'EA',

            link: function(scope, element, attrs) {

                attrs.$observe('actorId', function(value) {

                    /* value =" '"+ "div." + value + "' ";
                     console.log("Connection value:" + value)*/

                    element.connections({ from: 'div.'+ value}).length;
                    element.connections(attrs).length;
                    var connections = angular.element('connection, inner');
                    $interval(function() { connections.connections('update') }, 10);
                });


            }
        };
    })
    .directive('featureConnection', function($interval) {
        return {
            restrict: 'EA',

            link: function(scope, element, attrs) {

                attrs.$observe('activityId', function(value) {

                    element.connections({ from: 'div.'+ value}).length;
                    element.connections(attrs).length;
                    var connections = angular.element('connection, inner');
                    $interval(function() { connections.connections('update') }, 10);
                });


            }
        };
    })
    .directive('allCheckboxesBroadcast', function($interval) {
        return {
            restrict: 'A',
            controller: function($scope) {

                $scope.checkAll = function (model,id) {

                    if (model == true){
                        $scope.$broadcast('allCheckboxes',id,  true);
                    }else{
                        $scope.$broadcast('allCheckboxes',id,  false);
                    }

                }

            }
        };
    })
    .directive('activityCheckboxesBroadcast', function($interval) {
        return {
            restrict: 'A',
            controller: function($scope) {

                $scope.checkAll = function (model,id, actorId) {

                    if (model == true){
                        $scope.$broadcast('allFeatureCheckboxes',actorId,id,  true);
                    }else{
                        $scope.$broadcast('allFeatureCheckboxes',actorId,id,  false);
                    }

                }

            }
        };
    })
    .directive('allCheckboxesListeners', function($interval) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                attrs.$observe('actorId', function(value) {


                    scope.$on('allCheckboxes', function(event, id,shouldCheckAllCheckboxes) {

                        actorId = 'actor' + id;
                        if (value == actorId){

                            element.find('input').prop('checked', shouldCheckAllCheckboxes);
                            $scope.$broadcast('featureCheckboxesListeners', actorId, true);
                        }

                    });

                });

            }
        };
    })
    .directive('featureCheckboxesListeners', function($interval) {

        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                attrs.$observe('checkboxActivityId', function(value1) {


                    var parts = value1.split('-', 2);
                    scope.$on('allCheckboxes', function(event,actorId, shouldCheckAllCheckboxes) {

                        actorId = 'actor' + actorId;

                        if (parts[1] == actorId){

                            element.find('input').prop('checked', shouldCheckAllCheckboxes);
                        }
                    });

                });


            }
        };

    })
    .directive('featureCheckboxesListenersActivity', function($interval) {

        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                attrs.$observe('checkboxActivityId', function(value1) {


                    var parts = value1.split('-', 2);

                    scope.$on('allFeatureCheckboxes', function(event,actorId,activityId, shouldCheckAllCheckboxes) {

                        actorId = 'actor' + actorId;
                        activityId = 'activity' + activityId

                        if (parts[1] == actorId && parts[0] == activityId){

                            element.find('input').prop('checked', shouldCheckAllCheckboxes);
                        }
                    });

                });


            }
        };

    });


