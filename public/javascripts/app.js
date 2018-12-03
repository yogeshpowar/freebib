'use strict';

angular.module('runBuddies', [])
.controller('main', function($scope, $locale, $http) {
    alert("inside main");
	$scope.headers = [
		"bib",
		"name",
		"email",
		"phone",
		"age",
		"bibCategoryId",
		"bloodGroup",
		"isCollected",
		"collectedByName",
		"collectedByPhone"
	];
    $scope.searchBib = function(bib) {
        $http.get('/bibs/list' + '?bib=' + bib).then(function(resp) {
            if (!resp.data) {
                return;
            }
            $scope.name = "";
            $scope.bibs = resp.data;
            console.log(resp);
        });
    };
    $scope.searchName = function(name) {
        $http.get('/bibs/list' + '?name=' + name).then(function(resp) {
            if (!resp.data) {
                return;
            }
            $scope.bib = "";
            $scope.bibs = resp.data;
            console.log(resp);
        });
    };
});

