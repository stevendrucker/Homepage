var app = angular.module('MyAngularApp', ['ui.bootstrap']);

var primaryList = ["Hypertext", "Robotics", "Graphics", "Camera", "Social", "UI-Information", "Media", "Photos", "Presentation", "Machine Learning", "Visualization"];

app.directive('portfilter', function () {

    return {
        restrict: 'AE',
        replace: 'true',
        template: '<p>{{obj.name}}</p>',
        link: function (scope, elem, attrs) {
            //console.debug("portfilter " + scope.obj.name + " filter " + elem.attr("data-filter"));
            elem.bind('click', function () {
                // selector = '$("li[data-primary=\'' + scope.obj.name + '\']")';
                // $portfolio.isotope({ filter: selector });
                
                //filterString = "li[data-" + elem.attr("data-filter") + '="' + scope.obj.name + '"]';
                scope.setFilter(elem.attr("data-filter"), scope.obj.name);
                
               // selector = $(filterString);
               // $portfolio.isotope({ filter: selector });
                //$portfolio.isotope({ filter: $("li[data-primary='Graphics']") })
                 
            });
           
            elem.on('mouseenter', function () {                
                filterString = "li[data-" + elem.attr("data-filter") + '*="' + scope.obj.name + '"]';
                selector = $(filterString);
                selector.addClass("tint");
                
                filterString = "text[data-" + elem.attr("data-filter") + '*="' + scope.obj.name + '"]';
                selector = $(filterString);
                selector.attr("fill", "red");
                
            });
            
            elem.on('mouseleave', function () {
                filterString = "li[data-" + elem.attr("data-filter") + '*="' + scope.obj.name + '"]';
                selector = $(filterString);
                selector.removeClass("tint");
                
                filterString = "text[data-" + elem.attr("data-filter") + '*="' + scope.obj.name + '"]';
                selector = $(filterString);
                selector.attr("fill", "black");
            });
        
           
        }
    }
});

app.directive('ghVisualization', function () {

  // constants
  var margin = 20;

  return {
    restrict: 'E',
    scope: false,
    link: function (scope, element, attrs) {

      // set up initial svg object
      var vis = d3.select(element[0])
        .append("svg");

      scope.$watch('filteredResearch', function (newVal, oldVal) {

        // clear the elements inside of the directive
        vis.selectAll('*').remove();

        // if 'val' is undefined, exit
        if (!newVal) {
          return;
        }

        // Based on: http://mbostock.github.com/d3/ex/stack.html
        var n = newVal.length;
        svg = d3.select('svg');
        
        timelineLayout(svg, newVal, scope);
 
      });
    }
  }
});


app.directive('ghKeywordvisualization', function () {

  // constants
  var margin = 20;

  return {
    restrict: 'E',
    scope: false,
    link: function (scope, element, attrs) {

      // set up initial svg object
      var vis = d3.select(element[0])
        .append("svg");

      scope.$watch('filteredResearch', function (newVal, oldVal) {

        // clear the elements inside of the directive
        vis.selectAll('*').remove();

        // if 'val' is undefined, exit
        if (!newVal) {
          return;
        }
        var n = newVal.length;
        svg = d3.select('svg');
        
        keywordLayout(svg, newVal, scope);
 
      });
    }
  }
});


app.directive('ghPatentvisualization', function () {

    // constants
    var margin = 20;

    return {
        restrict: 'E',
        scope: false,
        link: function (scope, element, attrs) {

            // set up initial svg object
            var vis = d3.select(element[0])
              .append("svg");

            scope.$watch('filteredResearch', function (newVal, oldVal) {

                // clear the elements inside of the directive
                vis.selectAll('*').remove();

                // if 'val' is undefined, exit
                if (!newVal) {
                    return;
                }

                var n = newVal.length;
                svg = d3.select('svg');

                patentLayout(svg, newVal, scope);

            });
        }
    }
});
