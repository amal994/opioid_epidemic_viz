const other_stats_captions = function (d3) {
var svg = d3.select("#other_stats_captions")
	.append("svg")
	.attr("width", 2000)
	.attr("height", 250);

// caption 1
svg.append("text")
	.attr("x", 30)
	.attr("y", 20)
	.text("million people abused prescription opioids")
	.attr("font-size", "15px");

// caption 2
svg.append("text")
	.attr("x", 470)
	.attr("y", 20)
	.text("people are hospitalized daily for opioid misuse")
	.attr("font-size", "15px");

// caption 3
svg.append("text")
	.attr("x", 900)
	.attr("y", 20)
	.text("billion dollar economic burden on the U.S.")
	.attr("font-size", "15px");

};
export default other_stats_captions;