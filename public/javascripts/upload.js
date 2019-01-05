'use strict';

angular.module('freebib', ['ngFileUpload'])
.controller('upload', function($scope, $locale, Upload, $http) {
    $scope.controls = { loading:  false };
    $scope.getStats = function() {
        $scope.controls.loading = true;
        $http.get('/upload/getStats').then(function(resp) {
            $scope.controls.loading = false;
            if (!resp.data) {
                alert("Failed to connect with server");
                return;
            }
            if (resp.data.error_code === 1) {
                alert(resp.data.err_desc);
                return;
            }
            alert("Total Bibs: " + resp.data.total +
                  " Collected: " + resp.data.collected);
        });
    };
    $scope.submitFile = function (csv_file) {
        var file = $scope.csv_file;
        if (!file) {
            alert("File Empty");
            return;
        }
        $scope.controls.loading = true;
        Upload.upload({
            url : '/upload',
            data : {
                file: file
            }
        }).then(function (response) {
            $scope.controls.loading = false;
            var resData = response.data;
            $scope.error = response.data.error;
            if (resData.error_code === 0) {
                alert("Data uploaded successfully");
            } else {
                alert("Failed to uploaded data: " + resData.err_desc);
            }
        });
    };
});

