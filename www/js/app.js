// Ionic todo-app App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'todo-app' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo-app', ['ionic'])

.controller('TodoCtrl', function($scope, $ionicModal) {
  $scope.tasks = [];

  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up',
  });

  $scope.createTask = function(task) {
    $scope.tasks.push({
      title: task.title,
    });
    $scope.taskModal.hide();
    task.title = '';
  };

  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };
});
