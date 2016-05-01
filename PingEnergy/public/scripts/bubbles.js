$(document).ready(function() {
    generateChart();
});

function generateChart() {
    $("#bubbles").empty();

    // var color2 = d3.scale.ordinal().range(["#00441b", "#006d2c", "#238b45", "#41ab5d", "#74c476", "#a1d99b", "#c7e9c0", "#e5f5e0", "#f7fcf5"]);

    var color = d3.scale.ordinal().range(["#388938","#46ad46","#54b954","#87ce87","#66c166","#84cd84","99D699", "#cceacc"]);

    var diameter = 650,
        height = 500,
        format = d3.format(",d");

    var bubble = d3.layout.pack()
        .sort(function comparator(a, b) {
            console.log("a: ", a, "value: ", a.value, "b: ", b, "value: ", b.value);
            return b.value - a.value;
        })
        .size([diameter, height])
        .padding(1.5);

    var svg = d3.select("#bubbles").append("svg")
        .attr("width", diameter)
        .attr("height", height)
        .attr("class", "bubble");

    var nodes = bubble.nodes(classes(buildings))
        .filter(function(d) {return !d.children;});

    var force = d3.layout.force()
        .gravity(0.02)
        .alpha(.3)
        .friction(0.01)
        .charge(function(d) {
            return -500 * d.r;
        })
        .nodes(nodes)
        .size([diameter, height])
        .on("tick", function() {
            svg.selectAll(".node")
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
        });

    var node = svg.selectAll(".node")
        .data(nodes)
    .enter().append("g")
        .attr("class", "node")
        .call(force.drag);

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.className + ": " + d.money; });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .classed("nodecircle", true)
        .style("fill", function(d) { return color(d.packageName); })
        .style("stroke", "black")
        .style("stroke-width", 1);

    //add building name to all nodes
    node.append("text")
        .attr("dy", ".6em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.className.substring(0, d.r / 3); })
        .attr("font-weight", "bold")
        .attr("font-size", "1.1em")
        .attr("transform", "translate(0, -10)");

    //add money value to all nodes
    node.append("text")
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .style("font-size", ".9em")
        .text(function(d) { return "$" + d.money });

    node.on("click", function(d) {
        var toSend = classes(buildings);
        for (building in toSend["children"]) {
            if (toSend["children"][building]["className"] == d.className) {
                toSend["children"][building]["active"] = true;
            }
        }
        bubblesTwo(toSend);
    });

    node.on("mouseover", function() {
        $("#bubbles").css("cursor", "pointer");
    })
    node.on("mouseout", function() {
        $("#bubbles").css("cursor", "default");
    });

    // force.start();

    function bubblesTwo(sentBuildings) {
        for (building in sentBuildings["children"]) {
            if (sentBuildings["children"][building]["active"] == true) {
                sentBuildings["children"][building]["value"] = 25000;
            }
            else {
                sentBuildings["children"][building]["value"] = (sentBuildings["children"][building]["value"]/5);
            }
        }

        svg.selectAll(".node").remove().transition().duration(5000);

        var nodes = bubble.nodes(sentBuildings)
            .filter(function(d) {return !d.children;});

        var node = svg.selectAll(".node")
            .data(nodes)
        .enter().append("g")
            .attr("class", "node");

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("title")
            .text(function(d) { return d.className + ": " + d.money; });

        node.append("circle")
            .attr("r", function(d) { return d.r; })
            .classed("nodecircle", true)
            .style("fill", function(d) { return color(d.packageName); })
            .style("stroke", "black")
            .style("stroke-width", 1);

        node.on("mouseover", function() {
            $("#bubbles").css("cursor", "pointer");
        })
        node.on("mouseout", function() {
            $("#bubbles").css("cursor", "default");
        });

        //add building name to all nodes
        node.filter(function(d) { return d.active != true; })
        .append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function(d) { return d.className.substring(0, d.r / 3); })
            .attr("font-size", "1em");

        node.filter(function(d) { return d.active != true; })
            .on("click", function(d) {
                var toSend = classes(buildings);
                for (building in toSend["children"]) {
                    if (toSend["children"][building]["className"] == d.className) {
                        toSend["children"][building]["active"] = true;
                    }
                    else {
                        toSend["children"][building]["active"] = false;
                    }
                }
                bubblesTwo(toSend);
            });

        //main node building name
        node.filter(function(d) { return d.active == true; })
        .append("text")
            .attr("dy", "-.5em")
            .style("text-anchor", "middle")
            .style("font-size", "2em")
            .text(function(d) { return d.className; })

        //main node money raised
        node.filter(function(d) { return d.active == true; })
        .append("text")
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(function(d) { return "Money raised: $" + d.money });

        //main node energy usage per bed
        node.filter(function(d) { return d.active == true; })
        .append("text")
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(function(d) { return ""; });

        //click main node exits to original graph
        node.filter(function(d) { return d.active == true; })
            .on("click", function() {
                generateChart();
            });
    }

    //transform data to right object
    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
            else classes.push({packageName: name, className: node.name, value: node.size, active: node.active, money: node.money});
        }

        recurse(null, root);
        return {children: classes};
    }

    d3.select(self.frameElement).style("height", height + "px");
}
