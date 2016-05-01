$(document).ready(function(){
    // dayData = {"date_integer": [totalForAllBuildings, CO2, treeOffset}
    makeSVG(2016);   
});

function makeSVG(year) {
    var width = 1000,
        height = 150,
        cellSize = 18; // cell size
      
    var percent = d3.format(".2%"),
        format = d3.time.format("%m-%d-%Y")
      
    var margin = {top: 20, right: 20, bottom: 20, left: 20};
      
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
        
    draw(year, svg, svg2);
}

function draw(year, svg, svg2) {
    var totalSum = 0;
    var daySum = 0;

    var width = 1000,
        height = 150,
        cellSize = 18; // cell size
      
    var percent = d3.format(".2%"),
      format = d3.time.format("%m-%d-%Y")
      
    var margin = {top: 20, right: 20, bottom: 20, left: 20};
    
    var total = d3.select("#yearChosen").append("text")
        .attr("transform", "translate(45, 0)rotate(-90)")
        .style("text-anchor", "left")
        .style("font-size","34px")
        .text(year);
    
    var rect = svg.selectAll(".day")
        .data(function(d) { return(d3.time.days(new Date(year, 0, 1), new Date(year + 1, 0, 1)));})
      .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
        .attr("y", function(d) { return d.getDay() * cellSize; })
        .attr("stroke", "black")
        .attr("stroke-width", ".5px")
        .attr("fill", function(d){
            var month = d.getMonth()+1;
            var day = d.getDate();
            var date = (month + '-' + day + '-' + year);
            var color = "white";
            for (x in days) {
                if (x == date) {
                    color = colorDay(days[x]);
                    lowerBox(date);
                }
            }
            return color;
            })
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
        .style("text-anchor", "left")
        .text("Total Energy Used:  " + totalYear["yearTotal"] + " kWh");
 
 //.00159 tree per kwh * kwh = trees to offset for that day
           
       
}

function colorDay(data) {
    var l = days["low"];
    var color = ["#3f9b3f", "#66c166", "#99d699", "#cceacc", "#ffcccc", "#ff9999", "#ff6666"];
    var differance = (parseFloat(days["high"]) - parseFloat(days["low"]))/6;
    var one = (l + (differance/2));
    var two = one + differance;
    var three = two + differance
    var four = three + differance;
    var five = four + differance;
    var six = five + (differance/2);
    if (data < one ){
            return color[0];
    }
    else if (data < two && data > one) {
        return color[1];
    }
    else if (data < three && data > two) {
        return color[2];
    }
    else if (data < four && data > three) {
        return color[3];
    }
    else if (data < five && data > four) {
        return color[4];
    }
    else if (data < six && data > five) {
        return color[5];
    }
    else {
        return color[6]; 
    }   
}

function lowerBox(date) {
    //console.log(days);
    var str = "Date: " + date;
    for(d in days)
    {
        var c = '0' + d;
        var t = Math.round(days[d] *10000)/10000;
        var tr = Math.round((parseFloat(days[d])*.00159)*10000)/10000;
        var co = Math.round((parseFloat(days[d])*.6379)*10000)/10000;
    
        if (c == date || d == date) {
            str = str +("<br>" + "Total Energy Used : "+ t + " kWh <br>" + "Offset: "+ tr+ " trees <br>" + "CO2 emitted: " + co +" lbs");
            console.log(days[d]);
        }
    }
    

    d3.select("#words").selectAll("text").remove();
    $('#words').empty();

    var div = document.getElementById("words");
    div.innerHTML = div.innerHTML + str;
}

function clear() {
    console.log("fuck me sideways");
    $( "#container" ).empty();
    makeSVG(2017);
}


