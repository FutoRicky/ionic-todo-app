// Ionic todo-app App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'todo-app' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo-app', ['ionic'])

// Local storage
.factory('Projects', function() {
  return {
    all: function() {
      var projectString = window.localStorage['projects'];
      if (projectString) {
        return angular.fromJson(projectString);
      }

      return [];
    },

    save: function(projects) {
      window.localStorage['projects'] = angular.toJson(projects);
    },

    newProject: function(projectTitle) {
      return {
        title: projectTitle,
        tasks: [],
      };
    },

    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },

    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    },
  };
})

.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {

  // A utility function for creating a new project
  // with the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length - 1);
  };

  // Load or initialize projects
  $scope.projects = Projects.all();

  // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  // Called to create a new project
  $scope.newProject = function() {
    var projectTitle = prompt('Project name');
    if (projectTitle) {
      createProject(projectTitle);
    }
  };

  // Called to select the given project
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // Create modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
  });

  $scope.createTask = function(task) {
    if (!$scope.activeProject || !task) {
      return;
    }

    $scope.activeProject.task.push({
      title: task.title,
    });
    $scope.taskModal.hide();

    // Inefficient, but save all the projects
    Projects.save($scope.projects);

    task.title = '';
  };

  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $ionicModal.fromTemplateUrl('edit-task.html', function(modal) {
    $scope.editTaskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up',
  });

  // Edit functionality
  $scope.editTask = function(index, task) {
    $scope.task = {
      title: task.title,
      isDone: task.isDone,
    };
    $scope.taskIndex = index;
    $scope.editTaskModal.show();
  };

  $scope.updateTask = function(index, task) {
    if (!$scope.activeProject || !task) {
      return;
    }

    $scope.activeProject.task[index] = task;
    $scope.editTaskModal.hide();

    Projects.save($scope.projects);
  };

  // Mark as done functionality
  $scope.toggleDone = function(index, task) {
    if (!$scope.activeProject || !task) {
      return;
    }

    $scope.activeProject.task[index].isDone = ($scope.activeProject.task[index].isDone === 'YES') ? 'NO' : 'YES';
    Projects.save($scope.projects);
  };

  // Try to create the first project, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if ($scope.projects.length === 0) {
      while (true) {
        var projectTitle = prompt('Your first project title:');
        if (projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  });
});
