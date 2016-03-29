$(document).ready(function() {
    generateChart();
});

function generateChart() {
    var buildings = { "name": "buildings",
        "children": [
            {"name": "1stgroup",
                "children": [
                    {"name": "Beard", "size": 10000},
                    {"name": "Chapin", "size": 8500},
                    {"name": "Clark", "size": 6000}
                ]
            },
            {"name": "2ndgroup",
                "children": [
                    {"name": "Cragin", "size": 6500},
                    {"name": "Everett", "size": 6250},
                    {"name": "Gebbie", "size": 5500}
                ]
            },
            {"name": "3rdgroup",
                "children": [
                    {"name": "Keefe", "size": 5000},
                    {"name": "Kilham", "size": 4500},
                    {"name": "Larcom", "size": 3800}
                ]
            },
            {"name": "4thgroup",
                "children": [
                    {"name": "McIntire", "size": 3750},
                    {"name": "Meadows", "size": 3500},
                    {"name": "Metcalf", "size": 3250}
                ]
            },
            {"name": "5thgroup",
                "children": [
                    {"name": "Stanton", "size": 3000},
                    {"name": "White", "size": 2750},
                    {"name": "Young", "size": 2500}
                ]
            }
        ]
    };

    var color = d3.scale.ordinal().range(["#006837", "#238443", "#41ab5d", "#78c679", "#addd8e", "#d9f0a3", "#e0fba7"]);

    var diameter = 800,
        format = d3.format(",d")

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, 400])
        .padding(1.5);

    var nodes = bubble.nodes(classes(buildings))
                              .filter(function(d) {return !d.children;});

    var svg = d3.select("#bubbles").append("svg")
        .attr("width", diameter)
        .attr("height", 400)
        .attr("class", "bubble");

    // var force = d3.layout.force()
    //     .gravity(.06)
    //     .distance(100)
    //     .charge(-200)
    //     .friction(0.9)
    //     .theta(0.9)
    //     .alpha(0.5)
    //     .size([800, 400])
    //     .nodes(nodes)
    //     .start();

    var force = d3.layout.force()
        .gravity(0.05)
        .theta(0)
        .charge(-175)
        .nodes(nodes)
        .size([800, 400]);

    force.start();

    var node = svg.selectAll(".node")
        .data(nodes)
    .enter().append("g")
        .call(force.drag)
        .attr("class", "node")
        .call(force.drag)
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.className + ": " + format(d.value); });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return color(d.className); });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.className.substring(0, d.r / 3); });

    // force.on("tick", function() {
    //     svg.selectAll(".node")
    //         .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    // });

    force.on("tick", function(e) {
      var q = d3.geom.quadtree(nodes),
          i = 0,
          n = nodes.length;

      while (++i < n) q.visit(collide(nodes[i]));

      svg.selectAll(".node")
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        //   .attr("cx", function(d) { return d.x; })
        //   .attr("cy", function(d) { return d.y; });
    });

    function collide(node) {
      var r = node.radius + 1,
          nx1 = node.x - r,
          nx2 = node.x + r,
          ny1 = node.y - r,
          ny2 = node.y + r;
      return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
          var x = node.x - quad.point.x,
              y = node.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = node.radius + quad.point.radius;
          if (l < r) {
            l = (l - r) / l * .5;
            node.x -= x *= l;
            node.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      };
    }

    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
            else classes.push({packageName: name, className: node.name, value: node.size});
        }

        recurse(null, root);
        return {children: classes};
    }

    d3.select(self.frameElement).style("height", diameter + "px");
}
