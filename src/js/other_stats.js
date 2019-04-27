// source: https://codepen.io/stefanjudis/pen/HpFiz
const other_stats = function (d3,i) {
    var stat_data = [{"prefix": "", "suffix": "M", "end": 11},
        {"prefix": ">", "suffix": "", "end": 1000},
        {"prefix": "$", "suffix": "B", "end": 78.5}];

    var svg = d3.select("#other_stats")
        .append("svg")
        .attr("width", window.innerWidth/2)
        .attr("height", window.innerHeight/2);

    var texts = svg.selectAll("text").data([stat_data[i]]).enter().append("text");

//var format = d3.formatLocale(",d");

//text attributes
//var text_attr = 
    texts.attr("x", 300)
        .attr("y", 300)
        .text(0)
        .attr("font-size", "7em");

// text tween transision
//var text_tween =
    svg.selectAll("text").transition()
        .duration(1500)
        .tween("text", function (d) {
            var i = d3.interpolateRound(0, d.end);
            return function (t) {
                d3.select(this).text(d.prefix + i(t) + d.suffix);
            };
        });
};
export default other_stats;
