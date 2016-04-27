/*
$(document).ready(function(){

  $.ajax({
  
      type: "GET",
      url: "/test.xml",
      dataType: "xml",
      success: function(xml){
          var year = [];
          
          var day = $(xml).find('day').txt;
          
           year.push(day);
      },
  
      error: function() {
            alert("An error occurred while processing XML file.");
      }
  });
});

*/
$(document).ready(function(){
    var x = 0;
    var dayData = [];
    var min, max;
    for (var i = 0; i < 90; i++) {
        if (i < 27) {
            
            if (i%7 == 1 || i%7 ==0) {
                min = 18
                max = 45
                dayData.push(Math.round(Math.random() * (max - min) + min));
            }

            else {
                min = 20
                max = 30
                dayData.push(Math.round(Math.random() * (max - min) + min));
            }
        }
        else {
            if (i%1 == 0 || i%7 ==0) {
                min = 150
                max = 220
                dayData.push(Math.round(Math.random() * (max - min) + min));
            }
            else if (i%6 == 0 || i%5 ==0) {
                min = 160
                max = 250
                dayData.push(Math.round(Math.random() * (max - min) + min));
            }
            else {
                min = 100
                max = 175
                dayData.push(Math.round(Math.random() * (max - min) + min));
            }
        }
    }

   
    var width = 1000,
      height = 150,
      cellSize = 18; // cell size
      
    var percent = d3.format(".2%"),
      format = d3.time.format("%m-%d-%Y")
      
    var margin = {top: 20, right: 20, bottom: 20, left: 20};
      
    var svg = d3.select("#historical").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");      
    
    svg.append("text")
      .attr("transform", "translate(12," + cellSize * 3.5 +")rotate(-90)")
      .style("text-anchor", "middle")
      .text("2016");
      
    
    var rect = svg.selectAll(".day")
        .data(function(d) { return d3.time.days(new Date(2016, 0, 1), new Date(2016 + 1, 0, 1)); })
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
    

    var allRects = d3.selectAll(".day")[0];
  
    for (x = 0; x < 90; x++) { 
        if (dayData[x] <= 30) {
            d3.select(allRects[x]).attr("fill", "#d1ecd1");
        }
        else if (dayData[x] > 30 && dayData[x] <= 50) {
            d3.select(allRects[x]).attr("fill", "#66c166");
        }
        else if (dayData[x] > 50 && dayData[x] <= 75) {
            d3.select(allRects[x]).attr("fill", "#99d699");
        }
        else if (dayData[x]> 75 && dayData[x] <= 135) {
            d3.select(allRects[x]).attr("fill", "#cceacc");
        }
        else if ( dayData[x]> 135 && dayData[x] <= 195) {
            d3.select(allRects[x]).attr("fill", "#ffcccc");
        }
        else if (dayData[x] > 195 && dayData[x] <= 225) {
            d3.select(allRects[x]).attr("fill", "#ff9999");
        }
        else {
            d3.select(allRects[x]).attr("fill", "#ff6666"); 
        }
    

    }
    
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    svg.selectAll(".month")
        .data(function(d) { return d3.time.months(new Date(2016, 0, 1), new Date(2016+1, 0, 1)); })
      .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);
    //svg.selectAll(".month")
    //    .append('text')
    //    .text(function(d));
    
    //console.log("KI");
        
     
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
      
    var svg2 = d3.select("#information").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    function lowerBox(date) {
        var str = ("Date: " + date + "<br>" + "Total Energy Used : 1089 MWh" + "<br>" + "Trees to offset: 7" + "<br>" + "Best Building: Stanton" + "<br>" + "Worst Building: Keefe");

        d3.select("#words").selectAll("text").remove();
        $('#words').empty();

        var div = document.getElementById("words");
        div.innerHTML = div.innerHTML + str;

    }

});


