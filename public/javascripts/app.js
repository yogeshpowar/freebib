'use strict';

angular.module('freebib', [])
.controller('main', function($scope, $locale, $http) {
    $scope.controls = { loading:  false };
	$scope.headers = [ ];
    $scope.controls.loading = true;
    $http.get('/version').then(function(resp) {
        $scope.controls.loading = false;
        if (!resp.data) {
            $scope.version = { version: "v0.1", source: "https://github.com/yogeshpowar/freebib" };
            return;
        }
        $scope.version = resp.data;
    });

    $http.get('/getMapping').then(function(resp) {
        if (!resp.data) {
            alert("Failed to connect with server");
            return;
        }
        $scope.headers = Object.keys(resp.data);
        $scope.mapping = resp.data;
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
        if (collectedByName == "last") {
            $scope.collectedByEmail =  $scope.collectedByEmailLast;
            $scope.collectedByName = $scope.collectedByNameLast;
            $scope.collectedByPhone = $scope.collectedByPhoneLast;
            return;
        }
        if (collectedByName == "self") {
            $scope.collectedByName = "Self";
            $scope.collectedByEmail =  "";
            $scope.collectedByPhone = "";
            return;
        }
        var data = $scope.entry;
        var cnt = 0;
        if (!data) {
            return;
        }
        if (collectedByName) {
            data.collectedByName = collectedByName;
            cnt++;
        } else {
            data.collectedByName = "";
        }
        if (collectedByEmail) {
            data.collectedByEmail = collectedByEmail;
            cnt++;
        } else {
            data.collectedByEmail = "";
        }
        if (collectedByPhone) {
            data.collectedByPhone = collectedByPhone;
            cnt++;
        } else {
            data.collectedByPhone = "";
        }
        if (cnt == 0) {
            alert("No data entered");
            return;
        }
        $scope.collectedByEmailLast = $scope.collectedByEmail;
        $scope.collectedByNameLast = $scope.collectedByName;
        $scope.collectedByPhoneLast = $scope.collectedByPhone;

        $scope.controls.loading = true;
        if (confirm("Proceed to update and send SMS")) {
            $http.post('/bibs/update', data).then(function(resp) {
                $scope.controls.loading = false;
                if (resp.data.success) {
                    alert("Data Updated");
                    $scope.collectedByEmail = "";
                    $scope.collectedByName  = "";
                    $scope.collectedByPhone = "";
                } else {
                    alert("Failed to Update Data");
                }
            });
        }
    };
});
