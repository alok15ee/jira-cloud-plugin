
var moduleRef = angular.module('mainModule', ['ngLoadingSpinner']);

moduleRef.directive('uniqueProductname', function($http) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind('input propertychange', function (e) {
                ngModel.$loading = true;


                $http.get("/getCurrentDiscovery/" + element.val()).success(function(data) {


                    if(data.length == 1){

                        ngModel.$loading = false;
                        ngModel.$setValidity('unique', !data);
                    }else{
                        ngModel.$loading = true;
                        ngModel.$setValidity('unique', data);
                    }


                });
            });
        }
    };
})


moduleRef.controller('demo', function($scope , $http, $location){


    $scope.result = 'YES';

    $scope.doClick = function (result) {

        if (result == "NO"){
            document.getElementById('startDiscovery').style.display = "none";
            document.getElementById('createNewDiscoveryExistingForm').style.display = "block";
        }
        else{
            document.getElementById('startDiscovery').style.display = "none";
            document.getElementById('createNewDiscoveryForm').style.display = "block";
        }

    };

    $scope.cancelClick = function (form) {

        angular.copy({}, form);
        document.getElementById('createNewDiscoveryForm').style.display = "none";
        document.getElementById('createNewDiscoveryExistingForm').style.display = "none";
        document.getElementById('startDiscovery').style.display = "block";
    };


    AP.getUser(function(user){
        // all the code that uses user is invoked from here
        // e.g. you may put it together with other data in a context object
        var context = {
            user: user
        };
        findUser(context);
    });
    function findUser(context) {

        $scope.preview =function(user){

            param1=$scope.user.productName
            param2=$scope.user.endUsers
            param3=$scope.user.problemsArea
            param4=$scope.user.productKind,
                param5=$scope.user.problemSoln
            param6=$scope.user.competitors
            param7=$scope.user.differentiator
            param8=$scope.user.discoverer
            AP.require('events', function(events) {
                events.on('getDynamicParams', function() {
                    events.emit('loadDyamicParams', param1,param2,param3,param4,param5,param6,param7,param8);
                    events.offAll('getDynamicParams');
                });
            });

            AP.require('dialog', function(dialog){
                dialog.create({
                    key: 'preview-vision-dialog',
                    size: 'medium',
                    /*width: '40%',
                    height: '30%',*/
                    header: "Preview Product Vision",
                    submitText:"Start Discovery",
                    chrome: true,
                });
            });

            AP.require('events', function(events){
                events.once('customEvent', function(){

                    $scope.createNewDiscovery(user);

                });
            });

        }

        $scope.previewExisting =function(user){

            param1=$scope.user.productName
            param2=$scope.user.endUsers
            param3=$scope.user.problemsArea
            param4=$scope.user.productKind,
                param5=$scope.user.problemSoln
            param6=$scope.user.competitors
            param7=$scope.user.differentiator
            param8=$scope.user.discoverer
            AP.require('events', function(events) {
                events.on('getDynamicParams', function() {
                    events.emit('loadDyamicParams', param1,param2,param3,param4,param5,param6,param7,param8);
                    events.offAll('getDynamicParams');
                });
            });

            AP.require('dialog', function(dialog){
                dialog.create({
                    key: 'preview-vision-dialog',
                    size: 'medium',
                    header: "Preview Product Vision",
                    submitText:"Start Discovery",
                    chrome: true,
                });
            });

            AP.require('events', function(events){
                events.once('customEvent', function(){

                    $scope.createNewDiscoveryExisting(user);

                });
            });

        }

        $scope.createNewDiscovery = function(user){

            var productName = $scope.user.productName

            var projectKey = getProjectKey($scope.user.productName);
            projectKey = projectKey.toUpperCase()

            var discoverer = $("#my-user-picker").val();

            //var discoverer = context.user.id;
            var nameArray = $scope.user.productName.split(' ');
            var projectName = $scope.user.productName;
            AP.require('request', function(request) {
                request({
                    url: '/rest/api/2/project/' + projectKey,
                    success: function(response) {
                        projectKey = nameArray[0].toUpperCase();
                        alert(projectKey)

                        if (projectKey.length > 9){
                            projectKey = projectKey.substr(0,8);
                        }


                        createDiscoveryProject(projectKey, projectName, discoverer, function(status){

                        });

                    },
                    error: function(response) {

                        if (projectKey.length > 9){
                            projectKey = projectKey.substr(0,8);
                        }
                        createDiscoveryProject(projectKey, projectName, discoverer, function(status){


                        });


                    },
                    contentType: "application/json"

                });

            });

            function createDiscoveryProject(projectKey, projectName, discoverer, callback){

                /*console.log(projectKey + ":" + projectName + ":" + discoverer)*/
                var projectData = {

                    "key": projectKey,
                    "name": projectName,
                    "projectTypeKey": "software",
                    "projectTemplateKey": "com.pyxis.greenhopper.jira:gh-scrum-template",
                    "description": "A new discovery Project",
                    "lead": discoverer,
                    "url": "http://atlassian.com",
                    "assigneeType": "PROJECT_LEAD",
                    "avatarId": 10200

                };

                var status = AP.require('request', function(request){

                    request({
                        type: "POST",
                        url: "/rest/api/2/project",
                        dataType: "json",
                        data: JSON.stringify(projectData),
                        contentType: "application/json",

                        success: function (data) {
                            /*status = true;*/
                            data = JSON.parse(data);

                            AP.require("messages", function(messages){
                                //create a message
                                var message = messages.success('','JIRA Project Created' /*+ data.key*/ );
                                setTimeout(function(){
                                    messages.clear(message);
                                }, 2000);
                            });
                            /*projectKey = data.key;*/
                            projectDetails(data);
                            callback(status)


                            /*console.log(status)*/
                        },
                        error: function (data) {

                            AP.require("messages", function(messages){
                                //create a message
                                var message = messages.error('','JIRA Project cannot be Created' /*+ data.key*/ );
                                setTimeout(function(){
                                    messages.clear(message);
                                }, 2000);
                            });
                            /*status = false;*/
                            data = JSON.parse(data);

                            //projectDetails(data);
                            callback(status)
                        },


                    });

                });

                callback(status)

            }



            function projectDetails(data){
                if (data.key != null){

                    var formData = {

                        'projectKey' : data.key,
                        'productName' : $scope.user.productName,
                        'endUsers':$scope.user.endUsers,
                        'problemsArea': $scope.user.problemsArea,
                        'productKind': $scope.user.productKind,
                        'problemSoln': $scope.user.problemSoln,
                        'competitors': $scope.user.competitors,
                        'differentiator': $scope.user.differentiator,
                        'user': context.user.id

                    };

                    formData = JSON.stringify(formData);

                    $http.post('/createNewDiscovery', formData)
                        .success(function(data){

                            $scope.discoveryProduct = data;
                            $scope.formData = {};

                            document.getElementById('createNewDiscoveryForm').style.display = "none";
                            document.getElementById('success-discovery').style.display = "block";

                        }).error(function(data){
                            document.getElementById('createNewDiscoveryForm').style.display = "none";
                            document.getElementById('error-discovery').style.display = "block";
                        });

                }
                else{
                    document.getElementById('createNewDiscoveryForm').style.display = "none";
                    document.getElementById('error-discovery').style.display = "block";
                }

            }

        };

        $scope.createNewDiscoveryExisting = function(user){


            var projectKey;

            var projectID = $("#my-project-picker").val();
            var discoverer = $("#my-user-picker").val();


            AP.require('request', function(request) {
                request({
                    url: '/rest/api/2/project/' + projectID,
                    success: function(response) {

                        response = JSON.parse(response);

                        var formData = {

                            'projectKey' : response.key,
                            'productName' : $scope.user.productName,
                            'endUsers':$scope.user.endUsers,
                            'problemsArea': $scope.user.problemsArea,
                            'productKind': $scope.user.productKind,
                            'problemSoln': $scope.user.problemSoln,
                            'competitors': $scope.user.competitors,
                            'differentiator': $scope.user.differentiator,
                            'user': /*context.user.id*/discoverer

                        };

                        formData = JSON.stringify(formData);

                        $http.post('/createNewDiscovery', formData)
                            .success(function(data){

                                $scope.discoveryProduct = data;
                                $scope.formData = {};

                                document.getElementById('createNewDiscoveryExistingForm').style.display = "none";
                                document.getElementById('success-discovery').style.display = "block";

                            }).error(function(data){
                                document.getElementById('createNewDiscoveryExistingForm').style.display = "none";
                                document.getElementById('error-discovery').style.display = "block";
                            });


                    },
                    error: function(response) {



                    },
                    contentType: "application/json"

                });

            });




        /*    var productName = $scope.user.productName

            var formData = {
                'productName' : $scope.user.productName,
                'endUsers':$scope.user.endUsers,
                'problemsArea': $scope.user.problemsArea,
                'productKind': $scope.user.productKind,
                'problemSoln': $scope.user.problemSoln,
                'competitors': $scope.user.competitors,
                'differentiator': $scope.user.differentiator,
                'user':context.user.id

            };

            formData = JSON.stringify(formData);

            console.log(formData)

            createProject($scope.user.productName,context.user.id );
            $http.post('/createNewDiscovery', formData)
                .success(function(data){

                    $scope.discoveryProduct = data;
                    $scope.formData = {};

                    document.getElementById('createNewDiscoveryForm').style.display = "none";
                    document.getElementById('success-discovery').style.display = "block";


                    /!*$window.location.href('/secure/Dashboard.jspa');*!/
                    /!*$location.url('http://localhost:2990/jira/secure/Dashboard.jspa');*!/
                }).error(function(data){
                    console.log('Error in creating discovery' + data)
                });
*/
        };

        $scope.contiueDiscovery = function(){

            $http.get('/continueDiscoveryRedirect')
                .success(function(data){

                    document.getElementById('success-discovery').style.display = "none";
                    document.getElementById('continueDiscovery').style.display = "block";

                }).error(function(data){
                });


        };

    }

});





function getProjectKey(projectName){
    var nameArray = [];
    var projectKey;
    projectName = projectName.replace(/(^\s*)|(\s*$)/gi,"");
    projectName = projectName.replace(/[ ]{2,}/gi," ");
    projectName = projectName.replace(/\n /,"\n");

    if (projectName.split(' ').length < 2){
        projectKey = projectName.substr(0,2);
    }
    else{
        nameArray = projectName.split(' ');
        projectKey = nameArray[0].substr(0,1) + nameArray[1].substr(0,1);
    }

    var randomCharatcer = generateRandomCharatcer();
    projectKey = projectKey + randomCharatcer + "D";
    return projectKey;

}


function generateRandomCharatcer() {
    var chars = "ABCDEFGHIJKLMNOPQURSTUVWXYZ";
    return chars.substr( Math.floor(Math.random() * 62), 1);
}

