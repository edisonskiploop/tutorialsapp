/**
 * Created by Edison on 22-08-2016.
 */

var route = angular.module('routes', ['ngRoute']);

route.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/login.html"
        })
        .when("/panel", {
            templateUrl: "templates/controlpanel.html"
        })
        .when("/chapters", {
            templateUrl: "templates/chapter.html"
        })
        .otherwise({redirectTo :'/'});
});