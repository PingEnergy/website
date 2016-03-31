linegraph = {
  display: function(){
    console.log(linegraph.data);
  },

  sortData: function() {
    linegraph.data.sort(function(a, b) {
      // console.log(a.Name, b.Name, a.Usage > b.Usage);
        if(a.Usage== b.Usage) return 0;
        return a.Usage > b.Usage? 1 : -1;
    });
  },

  addIndex: function(){
    // console.log(linegraph.data);
    $.each(linegraph.data, function(index){
      $(this)[0].Index = index;
    });
  }
};


$(document).ready(function() {

  // var data = $.ajax({
  //   url: '/api/master',
  //   dataType: 'xml',
  //   async: false,
  //   success: function(data){
  //       var usages = [];
  //       $(data).select("data").find("r").each(function() {
  //           temp = {};
  //           temp["Name"] = $(this).attr("n");
  //           temp["Usage"] = $(this).find("v").text();
  //           usages.push(temp);
  //       });

  //       temp = {"Name": 'Average', "Usage": $(data).select("data").find("ts").text()};
  //       usages.push(temp);

  //       // usages.sort(function(a, b) {
  //       //   // console.log(a.Name, b.Name, a.Usage > b.Usage);
  //       //     return a.Usage > b.Usage? 1 : -1;
  //       // });

  //       // for (var i = 0; i < usages.length; i++) {
  //       //     console.log(usages[i].Usage);
  //       // }

  //       linegraph.data = usages;

  //       getGraph();
  //   },

  //   error: function(data){
  //       console.log('Failed to load the input file.');
  //   }
  // });


  // function getGraph(){
var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y%m%d").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temperature); });

var svg = d3.select("#linegraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
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
  linegraph.data = cities;

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Total Wattages (mkW)");

  var city = svg.selectAll(".city")
      .data(cities)
    .enter().append("g")
      .attr("class", "city");

  city.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  city.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });
});

});
