'use strict';

angular.module('freebib', ['ngFileUpload'])
.controller('main', function($scope, $locale, $http) {
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
        "collectedByEmail"
	];
    $http.get('/version').then(function(resp) {
        if (!resp.data) {
            $scope.version = { version: "v0.1", source: "https://github.com/yogeshpowar/freebib" };
            return;
        }
        $scope.version = resp.data;
    });
    $scope.searchBib = function(bib) {
        $http.get('/bibs/list' + '?bib=' + bib).then(function(resp) {
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
        $http.get('/bibs/list' + '?name=' + name).then(function(resp) {
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

        $http.post('/bibs/update', data).then(function(resp) {
            if (resp.data.success) {
            } else {
                alert("Failed to Update Data");
            }
        });
    };
})
.controller('upload', function($scope, $locale, Upload) {
    $scope.submitFile = function (csv_file) {
        alert("inside submitFile");
        var file = $scope.csv_file;
        if (!file) {
            alert("File Empty");
            return;
        }
        Upload.upload({
            url : '/upload',
            data : {
                file: file
            }
        }).then(function (response) {
            var resData = response.data;
            $scope.error = response.data.error;
            if (resData.error_code === 0) {
                alert("Data uploaded successfully");
            } else {
                alert("Failed to uploaded data");
            }
        });
    };
});

