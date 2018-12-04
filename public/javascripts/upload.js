'use strict';

angular.module('freebib', ['ngFileUpload'])
.controller('upload', function($scope, $locale, Upload) {
    $scope.submitFile = function (csv_file) {
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

