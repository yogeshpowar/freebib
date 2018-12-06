'use strict';

angular.module('freebib', [])
.controller('main', function($scope, $locale, $http) {
    $scope.controls = { loading:  false };
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
		"collectedByPhone",
        "collectedByEmail",
        "collectedTs",
        "updatedBy"
	];
    $scope.controls.loading = true;
    $http.get('/version').then(function(resp) {
        $scope.controls.loading = false;
        if (!resp.data) {
            $scope.version = { version: "v0.1", source: "https://github.com/yogeshpowar/freebib" };
            return;
        }
        $scope.version = resp.data;
    });
    $scope.searchBib = function(bib) {
        $scope.controls.loading = true;
        $http.get('/bibs/list' + '?bib=' + bib).then(function(resp) {
            $scope.controls.loading = false;
            if (!resp.data) {
                return;
            }
            $scope.name = "";
            $scope.entry = null;
            $scope.bibs = resp.data;
            if (resp.data.length == 0) {
                alert("No data found");
            }
            console.log(resp);
        });
    };
    $scope.searchName = function(name) {
        $scope.controls.loading = true;
        $http.get('/bibs/list' + '?name=' + name).then(function(resp) {
            $scope.controls.loading = false;
            if (!resp.data) {
                return;
            }
            $scope.bib = "";
            $scope.bibs = resp.data;
            $scope.entry = null;
            if (resp.data.length == 0) {
                alert("No data found");
            }
            console.log(resp);
        });
    };
    $scope.selectBib = function(e) {
        $scope.entry = e;
    };
    $scope.updateBib = function (collectedByName, collectedByEmail, collectedByPhone) {
        var data = $scope.entry;
        var cnt = 0;
        if (!data) {
            return;
        }
        if (collectedByName) {
            data.collectedByName = collectedByName;
            cnt++;
        }
        if (collectedByEmail) {
            data.collectedByEmail = collectedByEmail;
            cnt++;
        }
        if (collectedByPhone) {
            data.collectedByPhone = collectedByPhone;
            cnt++;
        }
        if (cnt == 0) {
            return;
        }

        $scope.controls.loading = true;
        $http.post('/bibs/update', data).then(function(resp) {
            $scope.controls.loading = false;
            if (resp.data.success) {
            } else {
                alert("Failed to Update Data");
            }
        });
    };
});
