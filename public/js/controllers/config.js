var moduleRef = angular.module('mainModule',  ['ngRoute','ngResource']);
/* Routes Provider */
moduleRef.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/collChart', {
                templateUrl: 'views/hello-world.hbs',
                controller: 'CollaborativeChartering'
            })
    }]);


/*.
 when('/about', {
 templateUrl: 'views/about.html',
 controller: 'AboutController'
 }).
 when('/contact', {
 templateUrl: 'views/contact.html',
 controller: 'ContactController'
 }).
 when('/news', {
 templateUrl: 'views/news.html',
 controller: 'NewsController'
 }).
 when('/comments', {
 templateUrl: 'views/comments.html',
 controller: 'CommentsController'
 }).
 when('/comments/:commentId', {
 templateUrl: 'views/singlecomment.html',
 controller: 'SingleCommentController'
 }).
 otherwise({
 redirectTo: '/notfound',
 templateUrl: 'views/notfound.html',
 controller: 'NotFoundController'
 });*/