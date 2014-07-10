app.controller("MainController", function ($scope, $modal,$log, $timeout) {
    globalScope = $scope;
    $scope.selectedResearch = 0;
    $scope.research = fixupData(myData.data);
    
    
    $scope.filteredResearch = research;
    
    $scope.primary = _.uniq(_.map(myData.data, function (d) { return d.primary }))
    $scope.filters = {};
    $scope.tags = ["publication", "year", "collaborators", "subject"];
    $scope.sortKeys = ["caption","year"];
    globaltags = $scope.tags;
    _.each($scope.tags, function(t) {$scope.filters[t] = []});
    $scope.values = {};
    $scope.valueCounts = {};
    myValues = {};
    $scope.radioModel = 'Icons';
    $scope.ascending = false;
    $scope.sortBy = "year";
    

    // since changing the radiomodel causes a change in the layout to the portfolio items
    // we need to reset isotope to the new list
    // but we need to wait until after it's done a layout hence the timeout
    $scope.$watch('radioModel', function() {
          $timeout(function(){
            resetPortfolio($scope.sortBy, $scope.ascending);
            $scope.recalculate();
          }, 1);        
   });
    

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
        var myIndex = $scope.filters[attribute].indexOf(value);
        if (myIndex > -1) {
            $scope.filters[attribute].splice(myIndex,1);
        } else {
            $scope.filters[attribute].push(value);
        }
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
            $portfolio.isotope({
                itemSelector : 'li',
                layoutMode : 'fitRows',
                filter: function() {tempObj = this; return $scope.isotopeFilter(tempObj)},            
                getSortData: {
                    year: '[data-year]',
                    caption: '[data-caption]'
                },
                sortBy: $scope.sortBy,
                sortAscending: $scope.ascending       
            });
        }
  //      $scope.$apply();    
    }
    
    $scope.sortPortfolio = function(key, dir) {
        resetPortfolio(key, dir);
        $scope.filteredResearch = _.sortBy($scope.filteredResearch, key);
        if (dir) {
            $scope.filteredResearch.reverse();
        }
        
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

    $scope.getParentScope = function()
    {
        return($scope);
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
    
    $scope.filterIsOn = function(aValue, tag)
    {
        return($.inArray(aValue, $scope.filters[tag]) > -1);
    }
    
    $scope.addselect = function(obj)
    {
        $scope.selectedObject = obj;
    }
    
    $scope.removeselect = function(obj)
    {
        $scope.selectedObject = null;
    }
    
    $scope.selectedIsOn = function(obj,tag)
    {
        if ($scope.selectedObject != null) {
            l0 = $scope.selectedObject.tags[tag];
            if ($.inArray(obj,l0)>-1) {
                return("tint");
            } else {
                return("");
            }
            return("");
        } else {
            return("");
        }
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

function resetPortfolio(sortValue, ascending) {
    $portfolio = $('.portfolio-items');
    $portfolio.isotope({
        itemSelector : 'li',
        layoutMode : 'fitRows',
        getSortData: {
            year: '[data-year]',
            caption: '[data-caption]'
        },
        sortBy: sortValue,
        sortAscending: ascending       
    });
    $portfolio.isotope('updateSortData').isotope();
}


function fixupData(val)
{
    b=_.map(val, function(a) {a["year"] = a.tags["year"][0]; return(a)});
    return(b);
}
