/**
 * Created by Edison on 22-08-2016.
 */

(function () {
    'use strict';
    var uid, tid;
    var courses = [], courseTitle;
    var app = angular.module('tutorialApp', ['routes'])

        .controller('loginCtrl', function ($scope, $http, $location) {
            $scope.username = '';
            $scope.password = '';
            $scope.loginerror = false;
            
            $scope.login = function () {
                $scope.loginerror = false;
                $http.get('/login', {params: {username: $scope.username, password: $scope.password}})
                    .then(function (data) {
                        if (data.data) {
                            uid = data.data.id;
                            $location.path('panel');
                        }
                        else $scope.loginerror = true;
                    }, function (data) {
                        console.log("Error");
                    });
            };
        })

        .controller('panelCtrl', function ($scope, $http, $location) {
            $scope.name = "";
            $scope.showModal = false;
            $scope.courses = [];
            // $scope.courses = ['C Basics', 'C++ Concepts', 'Java Programming', 'Android App Development', 'HTML5', 'CSS3', 'JQuery', 'Angular JS', 'Bootstrap', 'Knockout JS', 'Node JS', 'INK Framework', 'Materialize CSS'];

            $http.get('gettutorials?userid=' + uid)
                .then(function (data) {
                    $scope.courses = data.data;
                    courses = data.data;
                });

            $scope.addTutorial = function () {
                if ($scope.name != '') {
                    $http.get('addtutorial', {params: {userid: uid, title: $scope.name}})
                        .then(function (data) {
                            if (data) {
                                var newTutorial = {title: $scope.name};
                                $scope.courses.push(newTutorial);
                                $scope.name = "";
                            }
                        });
                }
                $scope.showModal = false;
            }

            $scope.deleteCourse = function (index) {
                $http.get('deletetutorial', {params: {tid: $scope.courses[index].id}});
                $scope.courses.splice(index, 1);
            };

            $scope.setCourseId = function (index) {
                tid = $scope.courses[index].id;
                courseTitle = $scope.courses[index].title;
                $location.path('chapters');
            };
        })

        .controller('chapterCtrl', function ($scope, $http) {
            //$scope.list = ['Preface', 'Introduction', 'Data Types', 'Functions', 'Object Orientation']
            $scope.chapters = [];
            $scope.name = '';
            $scope.cid = 0;
            $scope.courses = courses;
            $scope.courseTitle = courseTitle;
            $scope.fileicon = ['fa-youtube-square', 'fa-file-pdf-o'];
            $scope.isViewEnabled = true;
            $scope.showModal = false;

            // console.log('Title : ' + courseTitle);

            $scope.toggleEditView = function () {
                if ($scope.isViewEnabled == false)
                    $http.post('updatechapter', $scope.chapters[$scope.cid]);
                $scope.isViewEnabled = !$scope.isViewEnabled;
            };

            $http.get('getchapters?tid=' + tid)
                .then(function (data) {
                    $scope.chapters = data.data;
                });

            $scope.setCid = function (index) {
                $scope.cid = index;
                $scope.isViewEnabled = true;
            };

            $scope.addChapter = function () {
                if ($scope.name != '') {
                    $scope.showModal = false;
                    $http.get('addchapter?tid=' + tid + '&chaptername=' + $scope.name)
                        .then(function (data) {
                            $scope.chapters.push(data.data);
                        });
                }
                $scope.showModal = false;
                $scope.name = "";
            };

            $scope.deleteChapter = function (index) {
                console.log('Chap Id : ' + $scope.chapters[index]._id);
                $http.get('deletechapter', {params: {_id: $scope.chapters[index]._id}});
                $scope.chapters.splice(index, 1);
            };

            $scope.showCards = function () {
                // console.log('Length : ' + $scope.chapters.length);
                if ($scope.chapters.length)
                    return true;
                else return false;
            };
        });

})();