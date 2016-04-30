$(document).ready(function(){
    // dayData = {"date_integer": [totalForAllBuildings, CO2, treeOffset}
    makeSVG(2015);
    
});

function makeSVG(year) {
    var width = 1000,
        height = 150,
        cellSize = 18; // cell size
      
    var percent = d3.format(".2%"),
        format = d3.time.format("%m-%d-%Y")
      
    var margin = {top: 20, right: 20, bottom: 20, left: 20};
    
    var yearSvg = d3.select("#historical").append("svg")
        .attr("id", "yearSVG")
        .attr("width", cellSize )
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate( 0," + (height - cellSize * 7 - 1) + ")");
      
    var svg = d3.select("#historical").append("svg")
        .attr("width", width + margin.left + margin.right )
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");
        
    var svg2 = d3.select("#information").append("svg")
        .attr("id", "information")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    draw(year, svg, svg2, yearSvg);
}

function draw(year, svg, svg2, yearSVG) {
    var color = ["#d1ecd1", "#66c166", "#99d699", "#cceacc", "#ffcccc", "#ff9999", "#ff6666"];
    var totalSum = 0;
    var daySum = 0;

    var width = 1000,
        height = 150,
        cellSize = 18; // cell size
      
    var percent = d3.format(".2%"),
      format = d3.time.format("%m-%d-%Y")
      
    var margin = {top: 20, right: 20, bottom: 20, left: 20};
    
    yearSVG.append("text")
      .attr("id", "year")
      .attr("transform", "translate(0," + cellSize * 3.5 +")rotate(-90)")
      .style("text-anchor", "middle")
      .text(year);
      
    
    var rect = svg.selectAll(".day")
        .data(function(d) { return d3.time.days(new Date(year, 0, 1), new Date(year + 1, 0, 1)); })
      .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
        .attr("y", function(d) { return d.getDay() * cellSize; })
        .attr("stroke", "black")
        .attr("stroke-width", ".5px")
        .attr("fill", "white")
        .on("click", function(d) {lowerBox(d);})
        .datum(format);

    svg.selectAll(".month")
        .data(function(d) { return d3.time.months(new Date(year, 0, 1), new Date(year+1, 0, 1)); })
      .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);
     
    function monthPath(t0) {
      var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
          d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
          d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
      return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
          + "H" + w0 * cellSize + "V" + 7 * cellSize
          + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
          + "H" + (w1 + 1) * cellSize + "V" + 0
          + "H" + (w0 + 1) * cellSize + "Z";
    }

    var total = d3.select("#total").append("text")
        .attr("transform", "translate(100, 0)rotate(0)")
        //.attr("stroke", "black")
        //.attr("stroke-width", "1px")
        .style("text-anchor", "left")
        .text("Total Energy Used:");
           
    function lowerBox(date) {
        var str = ("Date: " + date + "<br>" + "Total Energy Used : 1089 MWh" + "<br>" + "Trees to offset: 7" + "<br>" + "CO2 emitted: 888lbs");

        d3.select("#words").selectAll("text").remove();
        $('#words').empty();

        var div = document.getElementById("words");
        div.innerHTML = div.innerHTML + str;

    }
    
}

function clear(year) {
    d3.select("calendar").remove();
    d3.select("information").remove()
    makeSVG(year);
}


