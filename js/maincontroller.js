app.controller("MainController", function ($scope, $modal,$log) {
    $scope.selectedResearch = 0;
    $scope.research = myData.data;


    $scope.primary = _.uniq(_.map(myData.data, function (d) { return d.primary }))

    $scope.tags = ["publication", "year", "collaborators", "subject"];
    $scope.values = {};
    $scope.valueCounts = {};
    myValues = {};
    //$scope.primary = _.uniq(_.map(myData.data, function (d) { return d.primary }))
    _.each($scope.tags, function (t) {
        valueList = _.groupBy(_.flatten(_.map(myData.data, function (d) { return d.tags[t] })));
        $scope.values[t] = _.map(valueList, function (d) { return d[0] });
        $scope.valueCounts[t] = _.map(valueList, function (d) { return d.length });
 //       myValues[t] = _.uniq(_.flatten(_.map(myData.data, function (d) { return d.tags[t] })));
    });

    uniquetags = _.uniq(_.flatten(_.map(myData.data, function (d) { return _.keys(d.tags) })))
    /*
    $portfolio.isotope({ filter: $("li[data-primary='Graphics']") })
    $portfolio.isotope({ filter: $("*") })

    selector = $("li[data-year='2002']li[data-primary='Information']"); // intersection


    _.unique(_.map(selector,function(d) {return d.attributes["data-publication"].value}))
    */
    // a = _.flatten(_.map(selector,function(d) {return d.attributes["data-collaborators"].value.split(" ")}))
    $scope.setFilter = function (attribute, value)
    {
      //  alert("adding filter " + attribute + " " + value);
        $scope.filterString = "li[data-" + attribute + '="' + value + '"]';
        _.each($scope.tags, function (t) {
            valueList = _.groupBy(_.flatten(_.map($($scope.filterString), function (d) { return d.attributes["data-" + t].value.split(" ") })));
            $scope.values[t] = _.map(valueList, function (d) { return d[0] });
            $scope.valueCounts[t] = _.map(valueList, function (d) { return d.length });
            myValues[t] = $scope.values[t];

        });
        $scope.$apply();
    }
    
    $scope.recalculate = function () {
    //    alert("recalculate");
    }

    $scope.clearFilter = function () {
        $scope.filterString = $(".portfolio-items li");
        $portfolio.isotope({ filter: $("*") });
        _.each($scope.tags, function (t) {
            valueList = _.groupBy(_.flatten(_.map($($scope.filterString), function (d) { return d.attributes["data-" + t].value.split(" ") })));
            $scope.values[t] = _.map(valueList, function (d) { return d[0] });
            $scope.valueCounts[t] = _.map(valueList, function (d) { return d.length });
            myValues[t] = $scope.values[t];

        });
    //    $scope.$apply();
    }

    $scope.showInfo = function(obj) {
        // alert("Show Info " + obj.caption);
        $scope.selObj = obj;

        $scope.open('lg');
    }




    $scope.items = ['item1', 'item2', 'item3'];

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrl,
            size: size,
            resolve: {
                selObj: function () {
                    return $scope.selObj;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    // Please note that $modalInstance represents a modal window (instance) dependency.
    // It is not the same as the $modal service used above.

    var ModalInstanceCtrl = function ($scope, $modalInstance, selObj) {
        $scope.selObj = selObj;
//        $scope.items = items;
        $scope.selected = {
   //         item: $scope.items[0]
        };

        $scope.ok = function () {
            $modalInstance.close('ok');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };
});



