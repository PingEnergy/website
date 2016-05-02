// http://cs.wheatonma.edu/egauge/dorm/dorm.xml
$(document).ready(function() {

  colorScheme = ["#f00","#f66","#900","#1a9641", "#000"];

  var margin = {top: 20, right: 80, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%Y%m%d").parse;

  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var color = d3.scale.ordinal()
    .range(colorScheme);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var line = d3.svg.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); });

  var svg = d3.select("#linegraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom).append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(data2[0], function(d) { return d[0]; }));

  yExtent = [10000000, 0];
  for (var i=0; i< data2.length; i++) {
    var newExtent = d3.extent(data2[i], function(d) { return d[1]; });
    if (newExtent[0] < yExtent[0]) {
      yExtent[0] = newExtent[0];
    }
    if (newExtent[1] > yExtent[1]) {
      yExtent[1] = newExtent[1];
    }
  }
  y.domain(yExtent);


  var mouseOn = function() {
      var circle = d3.select(this);

      // Horizontal line
      svg.append("g")
        .attr("class", "guide")
        .append("line")
        .attr("x1", circle.attr("cx"))
        .attr("x2", circle.attr("cx"))
        .attr("y1", +circle.attr("cy"))
        .attr("y2", height)
        .style("stroke", circle.style("fill"))
        .transition().delay(200).duration(400)
        .styleTween("opacity", function() { return d3.interpolate(0, 0.5);
      });

      // Vertical line
      svg.append("g")
        .attr("class", "guide")
        .append("line")
        .attr("x1", circle.attr("cx"))
        .attr("x2", 0)
        .attr("y1", circle.attr("cy"))
        .attr("y2", circle.attr("cy"))
        .style("stroke", circle.style("fill"))
        .transition().delay(200).duration(400)
        .styleTween("opacity", function() { return d3.interpolate(0, 0.5);
      });
  };

  var mouseOff = function() {
      var circle = d3.select(this);

      // fade out guide lines, then remove them
      d3.selectAll(".guide").transition().duration(100)
        .styleTween("opacity", function() { return d3.interpolate(0.5, 0); })
        .remove();
  };


  for (i = 0; i < data2.length; i++) {
    svg.append("g").selectAll(".circles")
      .data(data2[i])
      .enter()
      .append("circle")
      .attr("class", "circles")
      .attr({
        cx: function(d) { return x(d[0]); },
        cy: function(d) { return y(d[1]); },
        cTime: function(d) { return d[0]; },
        cEnergy: function(d) { return d[1]; },
        buildingName: buildings[i],
        r: 6
      })
      .style("fill", "transparent")
      .on("mouseover", mouseOn)
      .on("mouseout", mouseOff);
    }

  for (i = 0; i < data2.length; i++) {
    svg.append("svg:path")
      .datum(data2[i])
      .attr("class", "line")
      .attr("id", buildings[i])
      .attr("d", line)
      .attr("opacity", 1)
      .style("stroke", function() { return colorScheme[i]; })
      .attr("fill", "none");
  }

  $(".circles").tipsy({
      gravity: 's',
      html: true,
        title: function() {
          var d = new Date();
          d.setTime(d3.select(this).attr("cTime")).toString();
          d = String(d).slice(0, 16);
          var energyRound = Math.round(d3.select(this).attr("cEnergy") * 100)/100;
          return 'Building: '+ d3.select(this).attr("buildingName") + '<br>' + d + '<br>Energy Usage: ' + energyRound + ' (kwh)';
        }
    });

  // x-axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // y-axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("dy", "-30")
    .style("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .text("Total Kilowatt Hours (kwh)");


  var toggleLine = null;
  $('.rankingToggle').each(function(){
    toggleLine = $(this).attr("value");
    if($(this).attr("index") == 0 || $(this).attr("index") == buildings.length-1){
      $(this).attr('highlight', "true");
      $(this).css("background-color", "yellow");
      $("#"+toggleLine).attr({"opacity": 1});
    }else{
      $(this).attr('highlight', "false");
      $(this).css("background-color", "rgba(255,255,240,0)");
      $("#"+toggleLine).attr({"opacity": 0});
    }
  });

  $('.rankingToggle').click(function(){
    toggleLine = $(this).attr("value");

    if($(this).attr('highlight') == "true") {
      $("#"+toggleLine).attr({"opacity": 0});
      $(this).attr('highlight', "false");
      $(this).css("background-color", "rgba(255,255,240,0)");
    }else{
      $("#"+toggleLine).attr({"opacity": 1});
      $(this).attr('highlight', "true");
      $(this).css("background-color", "yellow");
    }
  });

  $('#Y-option').on('change', function (e){
    console.log($(this).attr("value"));
  });
});
