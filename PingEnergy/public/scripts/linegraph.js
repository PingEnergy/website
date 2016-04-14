// http://cs.wheatonma.edu/egauge/dorm/dorm.xml
$(document).ready(function() {
  RdYlGn = ["#f00","#f66","#900","#1a9641", "#000"];

  var margin = {top: 20, right: 80, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%Y%m%d").parse;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.ordinal()
      .range(RdYlGn);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      // .interpolate("basis")
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.temperature); });

  var svg = d3.select("#linegraph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom).append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.tsv("scripts/data.tsv", function(error, data) {
    if (error) throw error;

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

    data.forEach(function(d) {
      d.date = parseDate(d.date);
    });

    var cities = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {date: d.date, temperature: +d[name]};
        })
      };
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));

    y.domain([
      d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
      d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
    ]);

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
          .styleTween("opacity", function() { return d3.interpolate(0, 0.5); });

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
          .styleTween("opacity", function() { return d3.interpolate(0, 0.5); });
    };

    var mouseOff = function() {
      var circle = d3.select(this);

      // fade out guide lines, then remove them
      d3.selectAll(".guide").transition().duration(100)
          .styleTween("opacity", function() { return d3.interpolate(0.5, 0); })
          .remove();
    };

    var circles = svg.append("g").selectAll(".circles")
          .data(data)
          .enter().append("circle")
          .attr("class", "circles")
          .attr({
              cx: function(d) { return x(d.date); },
              cy: function(d) { return y(d.Chapin); },
              r: 5,
              cdate: function(d) { return d.date; },
              csage: function(d) { return d.Chapin; }
          })
          .style("fill", "red");
          // .style("fill", "transparent");

    circles.on("mouseover", mouseOn);
    circles.on("mouseout", mouseOff);

    // tooltips (using jQuery plugin tipsy)
    circles.append("title").text(function(d) {
      // console.log(d);
        // information[d.Name] = d.Name+"<br>Team: "+d.Team+"<br>Height: "+d.Height+"<br>Weight: "+d.Weight+"<br>Batting Average: "+d.Average+"<br>Home Runs: "+d.Homeruns+"<br>On-base Percentage: "+d.OBP;
        return d.Name;
    });

    // $(".circles").tipsy({ gravity: 's', });
    // colorSet = []
    // var colorArray = [];
    // $.each(usages, function (key, value) {
    //     if(jQuery.inArray(value[options.optionC],colorSet) == -1){
    //         colorSet.push(value[options.optionC]);
    //         colorArray.push({tempColor: value[options.optionC]});
    //     }
    // });
    // colorArray.sort(function(a, b) { return d3.ascending(a.tempColor, b.tempColor); })

    // the legend color guide
    // var legend = svg.selectAll("rect")
    //     .data(colorArray)
    //     .enter().append("rect")
    //     .attr({
    //         x: function(d, i) { return (160 + i*30); },
    //         y: h,
    //         width: 25,
    //         height: 12
    //     })
    //     .style("fill", function(d) { return color(d.tempColor); });

    // legend labels    
    // svg.selectAll("text")
    //     .data(colorArray)
    //     .enter().append("text")
    //     .attr({
    //         x: function(d, i) { return (160 + i*30); },
    //         y: h + 24,
    //     })
    //     .text(function(d) { return d.tempColor; });

    // svg.append("text")
    //     .attr("class", "color label")
    //     .attr("text-anchor", "end")
    //     .attr("x", w/4)
    //     .attr("y", h+10)
    //     .text("Color: "+options.optionC);

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
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Total Wattages (mkW)");

    var city = svg.selectAll(".city")
        .data(cities)
        .enter().append("g")
        .attr("class", "city");

    // paths
    city.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });

    // path annotations
    city.append("text")
        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

  });
});
