var app = angular.module('MyAngularApp', ['ui.bootstrap']);

var primaryList = ["Hypertext", "Robotics", "Graphics", "Camera", "Social", "Education", "Information", "Media", "Photos", "Presentations", "Machine Learning", "Visualization"];

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
                
                //filterString = "li[data-" + elem.attr("data-filter") + '="' + scope.obj + '"]';
                scope.setFilter(elem.attr("data-filter"), scope.obj);
                
               // selector = $(filterString);
               // $portfolio.isotope({ filter: selector });
                //$portfolio.isotope({ filter: $("li[data-primary='Graphics']") })
                 
            });
           
            elem.on('mouseenter', function () {                
                filterString = "li[data-" + elem.attr("data-filter") + '*="' + scope.obj + '"]';
                selector = $(filterString);
                selector.addClass("tint");
                
                filterString = "text[data-" + elem.attr("data-filter") + '*="' + scope.obj + '"]';
                selector = $(filterString);
                selector.attr("fill", "red");
                
            });
            
            elem.on('mouseleave', function () {
                filterString = "li[data-" + elem.attr("data-filter") + '*="' + scope.obj + '"]';
                selector = $(filterString);
                selector.removeClass("tint");
                
                filterString = "text[data-" + elem.attr("data-filter") + '*="' + scope.obj + '"]';
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

function timelineLayout(svg, theData, scope) {
 
     var foo;
    var sm = 0;
    var counts;
    var runsum = [];
    var x_scale;
    var y_scale;
    var legend_scale;
    var marginx = 50;
    var marginy = 20;
    var colorScale = d3.scale.category20();
    foo =
        _.sortBy(
            _.uniq(
                _.flatten(
                    _.map(theData, function (d) { return d.primary })
            )
      )
    );
    var b = _.countBy(theData, function (d) { return d.primary });
    counts = _.map(primaryList,
        function (d) {
            if (typeof(b[d]) != 'undefined') {
                return(b[d]);
            } else {
                return(0);
            }
        });
    _.each(counts, function (d) { sm += d; runsum.push(sm) })


    var width = $('svg').width();
    var height = $('svg').height();
    var x_extent = d3.extent(theData, function (d) { return d.tags.year });
    var length = theData.length;
    var primarylength = primaryList.length;
    x_scale = d3.scale.linear()
        .range([marginx, width - marginx])
        .domain([x_extent[0] - 2, Math.floor(x_extent[1]) + 2]);

    y_scale = d3.scale.linear()
        .range([height - marginy, marginy])
        .domain([0, length]);

    legend_scale = d3.scale.linear()
        .range([height - marginy-30, marginy])
        .domain([0, primarylength]);
    height_scale = d3.scale.linear()
        .range([0, height - (2 * marginy)])
        .domain([0, length]);
    var x_axis = d3.svg.axis().scale(x_scale);
    var y_axis = d3.svg.axis().scale(y_scale).orient('left');


    var groupedList = _.groupBy(theData, function (d) { return d.primary })

    x_axis.tickFormat(d3.format());


    sortedData = _.sortBy(theData, function (d) { return -1 * d.tags.year });


// all backgrounds
    svg
        .selectAll('.background')
        .data(primaryList)
        .enter()
        .append('rect')
        .attr('x', marginx)
        .attr('y', function (d, i) {
            var baseCount = runsum[i];
            return (y_scale(baseCount));
        })
        .attr('width', width - marginx)
        .attr('height', function (d, i) {
            var baseCount = counts[i];
            //            return (10);
            return (height_scale(baseCount));
        })
        .attr('fill', function (d, i) {
            var baseIndex = _.indexOf(foo, d);
            return colorScale(baseIndex)
        })
        .attr('fill-opacity', 0.3);


 //   d3.selectAll(".backgroundLabels").on("mouseleave", myHighlightClear);
 //   d3.selectAll(".backgroundLabels").on("mouseenter", myHighlight);



    _.each(groupedList, function (d, index) { layoutGroup(svg, d, index) });



    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height - marginy) + ")")
      .call(x_axis);

    d3.select('.x.axis')
      .append('text')
      .text('year')
      .attr('x', function () { return (width / 2) - marginx})
      .attr('y', -5);


    /*
    d3.select('#tags').selectAll("div").data(foo).enter().append("div")
       .html(function (d, i) { return ("<div class='legend' style='background-color:" + colorScale(i) + "'> </div> <div class='legendtext'>" + d + "</div>") });

    d3.selectAll("#tags .legendtext").on("mouseleave", myHighlightClear);
    d3.selectAll("#tags .legendtext").on("mouseenter", myHighlight);
    */
    
    function layoutGroup(svg, groupArray, groupName) {
        var baseIndex = _.indexOf(primaryList, groupName);
        var baseCount = baseIndex == 0 ? 0 : runsum[baseIndex - 1];
    
        var sortedGroup = _.sortBy(groupArray, function (d) { return d.tags.year });
    
        svg
          .selectAll('.' + groupName)
          .data(sortedGroup)
          .enter()
          .append('text')
          .attr('x', function (d, i) { return x_scale(d.tags.year) + 5 })
          .attr('y', function (d, i) { return y_scale(baseCount + i) - 2 })
          .text(function (d, i) { return d.caption })
          .attr('data', function (d) { return d.primary })
          .attr('class','paperClass')
          .on("click", function(d,i) {showInfo(scope,d)});
    
        svg.selectAll('.' + groupName)
        .data(sortedGroup)
        .enter()
        .append('circle')
        .attr('cx', function (d, i) { return x_scale(d.tags.year) - 2 })
        .attr('cy', function (d, i) { return y_scale(baseCount + i)  -  5})
        .attr('fill', function (d) { return colorScale(_.indexOf(foo, d.primary)) })
        .attr('data', function (d) { return d.primary })
        .attr('r', 3)
        .on("click", alert);

    
    
        svg.selectAll('.title' + groupName)
        .data([1])
        .enter()
        .append('text')
        .attr('y', function (d) { return(y_scale(baseCount+ sortedGroup.length/2)+5)})
        .attr('x', 60)    
        .attr('class', 'timeTitleClass')
        .text(function (d, i) { return (groupName) });
    
        //.attr('y', function (d, i) { y_scale(baseCount + sortedGroup.length / 2) })
        //d3.selectAll(".paperClass").on("click", doclick);
        //$("paperClass").overlay({ effect: 'apple' });
    }
}


function showInfo($scope, obj)
{
    $scope.showInfo(obj);
}


