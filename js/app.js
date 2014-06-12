var app = angular.module('MyAngularApp', ['ui.bootstrap']);

app.directive('portfilter', function () {

    return {
        restrict: 'AE',
        replace: 'true',
        template: '<p>{{obj}}</p>',
        link: function (scope, elem, attrs) {
            //console.debug("portfilter " + scope.obj + " filter " + elem.attr("data-filter"));
            elem.bind('click', function () {
                // selector = '$("li[data-primary=\'' + scope.obj + '\']")';
                // $portfolio.isotope({ filter: selector });
                
                filterString = "li[data-" + elem.attr("data-filter") + '="' + scope.obj + '"]';
                scope.setFilter(elem.attr("data-filter"), scope.obj);
                
                selector = $(filterString);
                $portfolio.isotope({ filter: selector });
                //$portfolio.isotope({ filter: $("li[data-primary='Graphics']") })
                 
            });
           
            elem.on('mouseenter', function () {
                selector = $("li[data-primary='" + scope.obj + "']");
                selector.addClass("tint");
            });
            
            elem.on('mouseleave', function () {
                selector = $("li[data-primary='" + scope.obj + "']");
                selector.removeClass("tint");
            });
        
           
        }
    }
});

