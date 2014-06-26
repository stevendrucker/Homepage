app.controller("MainController", function ($scope, $modal,$log) {
    globalScope = $scope;
    $scope.selectedResearch = 0;
    $scope.research = myData.data;
    $scope.filteredResearch = research;
    
    $scope.primary = _.uniq(_.map(myData.data, function (d) { return d.primary }))
    $scope.filters = {};
    $scope.tags = ["publication", "year", "collaborators", "subject"];
    globaltags = $scope.tags;
    _.each($scope.tags, function(t) {$scope.filters[t] = []});
    $scope.values = {};
    $scope.valueCounts = {};
    myValues = {};
    
    
    //$scope.primary = _.uniq(_.map(myData.data, function (d) { return d.primary }))
    /*_.each($scope.tags, function (t) {
        valueList = _.groupBy(_.flatten(_.map(myData.data, function (d) { return d.tags[t] })));
        $scope.values[t] = _.map(valueList, function (d) { return d[0] });
        $scope.valueCounts[t] = _.map(valueList, function (d) { return d.length });
 //       myValues[t] = _.uniq(_.flatten(_.map(myData.data, function (d) { return d.tags[t] })));
    });
*/
    uniquetags = _.uniq(_.flatten(_.map(myData.data, function (d) { return _.keys(d.tags) })))
    /*
    $portfolio.isotope({ filter: $("li[data-primary='Graphics']") })
    */
    
 //   $portfolio.isotope({ filter: $("*") })
/*
    selector = $("li[data-year='2002']li[data-primary='Information']"); // intersection


    _.unique(_.map(selector,function(d) {return d.attributes["data-publication"].value}))
    */
    // a = _.flatten(_.map(selector,function(d) {return d.attributes["data-collaborators"].value.split(" ")}))
    
    
    $scope.setFilter = function (attribute, value)
    {
        $scope.filters[attribute].push(value);
        $scope.recalculate();
    
        $scope.$apply();
    }
    
    
    $scope.recalculate = function () {
    //    alert("recalculate");
    
        _.each($scope.tags, function (t) {
            basicList = _.filter($scope.research, function(d) {return $scope.passFilter(d, t)});              
            valueList = _.groupBy(_.flatten(_.map(basicList, function (d) { return d.tags[t] })));
            $scope.values[t] = _.map(valueList, function (d) { return d[0] });
            $scope.valueCounts[t] = _.map(valueList, function (d) { return d.length });
        });
        $scope.filteredResearch = _.filter($scope.research, function(d) {return $scope.passFilter(d,"*")});
        if (typeof($portfolio) != 'undefined') {
             $portfolio.isotope({ filter: function() {tempObj = this; return $scope.isotopeFilter(tempObj)}});            
        }
  //      $scope.$apply();    
    }

    $scope.clearFilter = function () {
//        $scope.filterString = $(".portfolio-items li");
//        $portfolio.isotope({ filter: $("*") });
        _.each($scope.tags, function (t) {
            $scope.filters[t] = [];

        });
        $portfolio.isotope({ filter: $("*") })
        $scope.recalculate();
    //    $scope.$apply();
    }

    $scope.showInfo = function(obj) {
        // alert("Show Info " + obj.caption);
        $scope.selObj = obj;

        $scope.open('lg');
    }

// each filter bank should be updated based on filters from the other filter banks but not its own

    $scope.passFilter = function(obj, which) {
        pass = true;
        _.each($scope.tags, function(t) {
           if (t != which) {
                if ($scope.filters[t].length > 0 ) {
                    l1 = _.intersection(obj.tags[t], $scope.filters[t]).length;
                    if (l1 == 0) {
                        pass=false;
                    }
                }
           }
        });
        return(pass);
    }

    $scope.isotopeFilter = function(obj)
    {
        pass = true;
        _.each($scope.tags, function(t) {        
            if ($scope.filters[t].length > 0) {
                l0 = obj.attributes["data-"+t].value.split(" ");
                l1 = _.intersection(l0, $scope.filters[t]).length;
                if (l1 == 0 ) {
                    pass = false;
                }
            } 
        });
        return(pass);   
    }

    $scope.items = ['item1', 'item2', 'item3'];
    $scope.recalculate();
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


function passFilter(obj, which) {
    pass = true;
    _.each(tags, function(t) {        
        if (t != which) {
            if (filters[t].length > 0) {
                l1 = _.intersection(obj.tags[t], filters[t]).length;
                if (l1 == 0 ) {
                    pass = false;
                }
            } 
        }
    });
    return(pass);
}

