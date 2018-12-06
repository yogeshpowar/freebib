'use strict';

angular.module('freebib', ['ngFileUpload'])
.controller('upload', function($scope, $locale, Upload) {
    $scope.controls = { loading:  false };
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
                alert("Failed to uploaded data");
            }
        });
    };
});

