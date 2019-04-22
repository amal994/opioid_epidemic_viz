//source: https://bl.ocks.org/mattkohl/9f3a283813cf0226311f41595582c9eb
const fourtypercent = function (d3){

var duration = 1500,
    transition = 200,
    percent = 40,
    width = window.innerWidth - 20,
    height = window.innerHeight - 20;

var dataset = {
            lower: calcPercent(0),
            upper: calcPercent(percent)
        },
        radius = Math.min(width, height) / 3,
        pie = d3.pie().sort(null),
        format = d3.format(".0%");

var arc = d3.arc()
        .innerRadius(radius * .8)
        .outerRadius(radius);

var svg = d3.select("#fourtypercent").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var path = svg.selectAll("path")
                .data(pie(dataset.lower))
                .enter().append("path")
                .attr("class", function (d, i) {
                    return "color" + i
                })
                .attr("d", arc)
                .each(function (d) {
                    this._current = d;
                });

var text = svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .attr("font-size", "7em");

var progress = 0;

var timeout = setTimeout(function () {
    clearTimeout(timeout);
    path = path.data(pie(dataset.upper));
    path.transition().duration(duration).attrTween("d", function (a) {
        var i = d3.interpolate(this._current, a);
        var i2 = d3.interpolate(progress, percent);
        this._current = i(0);
        return function (t) {
            text.text(format(i2(t) / 100));
            return arc(i(t));
        };
    });
}, 200);

function calcPercent(percent) {
    return [percent, 100 - percent];
};
}; export default fourtypercent;
