// source: https://codepen.io/stefanjudis/pen/HpFiz
const other_stats = function (d3) {
var stat_data = [{"prefix": "", "suffix": "M", "end": 11, "x": 100},
				{"prefix": ">", "suffix": "","end": 1000, "x": 500},
				{"prefix": "$", "suffix": "B","end": 78.5, "x": 1000}];

var svg = d3.select("#other_stats")
	.append("svg")
	.attr("width", 2000)
	.attr("height", 250);

var texts = svg.selectAll("text").data(stat_data).enter().append("text");

//var format = d3.formatLocale(",d");

//text attributes
//var text_attr = 
texts.attr("x", function(d){return d.x;})
		.attr("y", 200)
		.text(0)
		.attr("font-size", "7em");

// text tween transision
//var text_tween =
svg.selectAll("text").transition()
	.duration(1500)
	.tween("text", function(d){
		var i = d3.interpolateRound(0, d.end);
		return function(t){
			d3.select(this).text(d.prefix + i(t) + d.suffix);
		};
	});
};
export default other_stats;
