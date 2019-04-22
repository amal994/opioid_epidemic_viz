// source: https://codepen.io/stefanjudis/pen/HpFiz

var stat_data = [{"end": 11, "x": 100},
				{"end": 1000, "x": 500},
				{"end": 78.5, "x": 1000}];

var svg = d3.select("#other")
	.append("svg")
	.attr("width", 2000)
	.attr("height", 250);

var texts = svg.selectAll("text").data(stat_data).enter().append("text");

//var format = d3.formatLocale(",d");

var text_attr = texts
				.attr("x", function(d){return d.x;})
				.attr("y", 200)
				.text(0)
				.attr("font-size", "7em");

var text_tween = svg.selectAll("text").transition()
					.duration(1500)
					.tween("text", function(d){
						var i = d3.interpolateRound(0, d.end);
						return function(t){
							d3.select(this).text(i(t));
						};
					});


