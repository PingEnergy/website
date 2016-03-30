$(document).ready(function() {
    generateChart();

    $("#force").on("click", function() {
        if ($(this).text() == "Toggle Static") {
            console.log("static");
            $(this).text("Toggle Animated");
            $(".bubble").force.stop();
        }
        else {
            console.log("not static!");
            $(this).text("Toggle Static");
            $(".bubble").force.start();
        }
    })
});

function generateChart() {

    var buildings = { "name": "buildings",
        "children": [
            {"name": "1st",
                "children": [
                    {"name": "Beard", "size": 10000, "active": false}
                ]
            },
            {"name": "2nd",
                "children": [
                    {"name": "Chapin", "size": 8500, "active": false}
                ]
            },
            {"name": "3rd",
                "children": [
                    {"name": "Clark", "size": 6000, "active": false}
                ]
            },
            {"name": "2ndgroup",
                "children": [
                    {"name": "Cragin", "size": 6500, "active": false},
                    {"name": "Everett", "size": 6250, "active": false},
                    {"name": "Gebbie", "size": 5500, "active": false}
                ]
            },
            {"name": "3rdgroup",
                "children": [
                    {"name": "Keefe", "size": 5000, "active": false},
                    {"name": "Kilham", "size": 4500, "active": false},
                    {"name": "Larcom", "size": 3800, "active": false}
                ]
            },
            {"name": "4thgroup",
                "children": [
                    {"name": "McIntire", "size": 3750, "active": false},
                    {"name": "Meadows", "size": 3500, "active": false},
                    {"name": "Metcalf", "size": 3250, "active": false}
                ]
            },
            {"name": "5thgroup",
                "children": [
                    {"name": "Stanton", "size": 3000, "active": false},
                    {"name": "White", "size": 2750, "active": false},
                    {"name": "Young", "size": 2500, "active": false}
                ]
            }
        ]
    };

    var color = d3.scale.ordinal().range(["#006d2c", "#238b45", "#41ab5d", "#74c476", "#a1d99b", "#c7e9c0", "#e5f5e0", "#f7fcf5"]);

    var diameter = 800,
        height = 450,
        format = d3.format(",d");

    var bubble = d3.layout.pack()
        .sort(null)
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
        .friction(.9)
        .charge(-80)
        .nodes(nodes)
        .size([diameter, height])
        .on("tick", function() {
            svg.selectAll(".node")
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

            if (!(svg.selectAll(".active").empty())) {
                redoNodes();
            }
        });

    function redoNodes() {
        if (svg.select(".mainNode").style("visibility") == "hidden") {
            svg.select(".mainNode")
                .style("visibility", "visible")
                .style("fill-opacity", 0).transition().duration(500).style("fill-opacity", 1);
        }
    }

    var node = svg.selectAll(".node")
        .data(nodes)
    .enter().append("g")
        .attr("class", "node")
        .call(force.drag)

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.className + ": " + format(d.value); });

    node.append("circle")
        .attr("r", function(d) {
            if (d.active == true) {
                return 150;
            }
            return d.r;
        })
        .classed("nodecircle", true)
        .style("fill", function(d) { return color(d.packageName); });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.className.substring(0, d.r / 3); });

    node.on("click", function(d) {
        var circ = d3.select(this).select(".nodecircle");

        if (circ.classed("active")) {
            circ.classed("active", false);
        }
        else {
            circ.classed("active", true);
        }
    });

    var mainNode = svg.append("circle")
        .attr("r", 150)
        .classed("mainNode", true)
        .style("fill", "green")
        .attr("transform", "translate(400, 225)")
        .style("visibility", "hidden")
        .on("click", function() {
            svg.selectAll(".node")
                .style("visibility", "visible");

            svg.select(".mainNode").style("visibility", "hidden");

            svg.selectAll(".active").classed("active", false);

            force.start();
        });

    force.start();

    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
            else classes.push({packageName: name, className: node.name, value: node.size, active: node.active});
        }

        recurse(null, root);
        return {children: classes};
    }

    // var button = svg.append("g")
    //     .attr("transform", "translate(0,0)")
    //     .on("click", function() {
    //         if (bttntext.text() == "static toggle") {
    //             console.log("static!");
    //             bttntext.text("animate toggle");
    //             force.stop();
    //         }
    //         else {
    //             console.log("not static!");
    //             bttntext.text("static toggle");
    //             force.start();
    //         }
    //     });
    //
    // var bttnrect = button.append("rect")
    //     .attr("x", 0)
    //     .attr("y", 0)
    //     .attr("width", 100)
    //     .attr("height", 50)
    //     .attr("style", "outline: thin solid black;")
    //     .attr("fill", "white");
    //
    // var bttntext = button.append("text")
    //     .attr("x", 5)
    //     .attr("y", 23)
    //     .text("static toggle");

    d3.select(self.frameElement).style("height", height + "px");
}
