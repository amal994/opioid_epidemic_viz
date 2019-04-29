import person2 from '../img/person-2.png';
import person3 from '../img/person-3.png';

const oneinfive = function (d3) {
    /*var example = d3.select("#oneinfive")
        .append("svg")
        .attr("width", 1000)
        .attr("height", 300);

    var jsonCircles = [{"cx": 100, "col": "purple"},
        {"cx": 200, "col": "gray"},
        {"cx": 300, "col": "gray"},
        {"cx": 400, "col": "gray"},
        {"cx": 500, "col": "gray"}];

    var circles = example.selectAll("circle")
        .data(jsonCircles).enter().append("circle");

// circle attributes
    circles
        .attr("cx", function (d) {
            return d.cx;
        })
        .attr("cy", 50)
        .attr("r", 30)
        .attr("fill", "purple")
        .attr("stroke", "black");

// circle animation
    example.selectAll("circle").transition()
        .attr("fill", function (d) {
            return d.col;
        })
        .duration(3000)
        .transition()
        .attr("fill", "purple")
        .duration(3000);

//position

    var jsonRect = [{"cx": 500, "col": "gray"},
        {"cx": 400, "col": "gray"},
        {"cx": 300, "col": "gray"},
        {"cx": 200, "col": "gray"},
        {"cx": 100, "col": "purple"}];
    var rectangles = example.selectAll("rect").data(jsonRect).enter().append("rect");

// rectangle attributes
    rectangles
        .attr("x", 75)
        .attr("y", 200)
        .attr("width", 50)
        .attr("height", 50)
        .attr("fill", function (d) {
            return d.col;
        })
        .attr("stroke", "black");

// rectangle animation
    example.selectAll("rect").transition()
        .attr("x", function (d) {
            return d.cx;
        })
        .duration(2500);*/

    var svg = d3.select("#oneinfive").append('svg')
        .attr("width", 1000)
        .attr("height", 500);

    var img_data = [{"cx": 500, "link": person3},
        {"cx": 400, "link": person3},
        {"cx": 300, "link": person3},
        {"cx": 200, "link": person3},
        {"cx": 100, "link": person2}];

    var images = svg.selectAll("image").data(img_data).enter().append("image");

    images
        .attr('xlink:href', function (d) {
            return d.link;
        })
        .attr('width', 150)
        .attr('height', 150)
        .attr('x', 100)
        .attr('y', 100);

    svg.selectAll("image").transition()
        .attr('x', function (d) {
            return d.cx;
        })
        .duration(2500);


};
export default oneinfive;
