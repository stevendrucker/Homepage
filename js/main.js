jQuery(function($) {

    $(function(){
        $('#main-slider.carousel').carousel({
            interval: 10000,
            pause: false
        });
    });

    //Ajax contact
    var form = $('.contact-form');
    form.submit(function () {
        $this = $(this);
        $.post($(this).attr('action'), function(data) {
            $this.prev().text(data.message).fadeIn().delay(3000).fadeOut();
        },'json');
        return false;
    });

    //smooth scroll
    $('.navbar-nav > li:not(.special)').click(function(event) {
        event.preventDefault();
        var target = $(this).find('>a').prop('hash');
        $('html, body').animate({
            scrollTop: $(target).offset().top
        }, 500);
    });

    //scrollspy
    $('[data-spy="scroll"]').each(function () {
        var $spy = $(this).scrollspy('refresh')
    })

    //PrettyPhoto
    $("a.preview").prettyPhoto({
        social_tools: false
    });

    //Isotope
    $(window).load(function(){
        $portfolio = $('.portfolio-items');
        $portfolio.isotope({
            itemSelector : 'li',
            layoutMode : 'fitRows'
        });
        $portfolio_selectors = $('.portfolio-filter >li>a');
        $portfolio_selectors.on('click', function(){
            $portfolio_selectors.removeClass('active');
            $(this).addClass('active');
            var selector = $(this).attr('data-filter');
            $portfolio.isotope({ filter: selector });
            return false;
        });
        
    });
    
    filterString = "";

});

function doIsotope() {
    $portfolio = $('.portfolio-items');
    $portfolio.isotope({
        itemSelector: 'li',
        layoutMode: 'fitRows'
    });
    $portfolio_selectors = $('.portfolio-filter >li>a');
    $portfolio_selectors.on('click', function () {
        $portfolio_selectors.removeClass('active');
        $(this).addClass('active');
        var selector = $(this).attr('data-filter');
        $portfolio.isotope({ filter: selector });
        return false;
    });
}




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



function keywordLayout(svg, theData, scope)
{
    // x axis is projects
    // y axis is keywords
    // keywords:
    var width = $('svg').width();
    var height = $('svg').height();
    var marginx = 150;
    var marginy = 100;
    svg.append("g")
        .attr("transform", "translate(0, 0)");
              
    keywords = _.uniq(_.flatten(_.map(theData, function (d) { return d.tags["subject"] })));
    
    x_scale = d3.scale.linear()
        .range([marginx, width - marginx])
        .domain([0, theData.length]);
   

    y_scale = d3.scale.linear()
        .range([height - marginy, marginy])
        .domain([0, keywords.length]);

    var x_axis = d3.svg.axis().scale(x_scale);
    //x_axis.tickFormat(d3.format());
    var y_axis = d3.svg.axis().scale(y_scale).orient('left');
    
    var x = d3.scale.ordinal().rangeBands([0, width]);
    var y = d3.scale.ordinal().rangeBands([0, height]);
    y.domain(keywords);
  
      
      
    var row = svg.selectAll(".row")
      .data(keywords)
    .enter().append("g")
      .attr("class", "row")
      .attr("transform", function(d, i) { return "translate(0," + y_scale(i) + ")"; })
      
    row.append("text")
      .attr("x", 140)
      .attr("y", 0)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .attr("fill","black")
      .text(function(d, i) { return d; });
      
    var col = svg.selectAll(".col")
        .data(theData)
        .enter().append("g")
        .attr("class", "col")
        .attr("transform",function(d,i) {return "translate("+x_scale(i)+",100)"});
                            
    col.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "-.5em") 
      .attr("dx", ".5em")
      .attr("text-anchor", "start")
      .attr("fill","black")
      .attr("transform","rotate(-45)")
      .text(function(d, i) { return d.caption; });
            
    var cells = svg.selectAll(".cell")
        .data(theData)
        .enter().append("g")
        .attr("class","cell")
        .attr("transform","translate(0,0)")
        .each(myCell)
        
    function myCell(someData, theCount) {
        var cell = d3.select(this).selectAll(".baz")
            .data(someData.tags["subject"])
            .enter()
              .append("rect")
              .attr("class","baz")
              .attr("x", function(d,i) {return x_scale(theCount)})
              .attr("y", function(d,i) {return y_scale(keywords.indexOf(d))})
              .attr("width",5)
              .attr("height",5)
              .style("fill","red")
}
/*      
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height - marginy) + ")")
      .call(x_axis);
      */
}


