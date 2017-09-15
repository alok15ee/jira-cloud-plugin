/**
 * Created by alok on 13/4/16.
 */



angular.module('mainModule').controller('AdminConfigController', function($scope, $http){

    $scope.template = "NO"
 $http.get('/getAdminConfig/').success(function(data){
            $scope.template = data[0].userTemplate;

        }).error(function(data){
            console.log('Error: ' + data)
        });


    $scope.cell = {
        evaluator: "NO"
    };

    $scope.evaluators = [{
        name: "YES"
    }, {
        name: "NO"
    }];
    $scope.getEvaluators = function () {
        return $scope.evaluators;
    };

    $scope.setConfig = function (option) {


        console.log("Config Choice:" + option)

        $scope.option = option
        console.log("Entry Choice"+ $scope.option)

        var data = {
            userTemplate : $scope.option
        }

        $http.delete('/resetConfig/').success(function(data){

        }).error(function(data){
            console.log('Error: ' + data)
        });

        $http.post('/setAdminConfig/' , data).success(function(data){
            AP.require("messages", function(messages){
                //create a message
                var message = messages.success('','Template configuration updated' /*+ data.key*/ );
                setTimeout(function(){
                    messages.clear(message);
                }, 2000);
            });
            /*$scope.productDiscoveryData = data;*/
        }).error(function(data){
            AP.require("messages", function(messages){
                //create a message
                var message = messages.error('','Template configuration cannot updated' /*+ data.key*/ );
                setTimeout(function(){
                    messages.clear(message);
                }, 2000);
            });
        });


    };


});