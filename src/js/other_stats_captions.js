const other_stats_captions = function (d3, i) {
    var svg = d3.select("#other_stats_captions")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    let caption = "";
    if(i === 0) {
        caption = "million people abused prescription opioids";
    }
    else if (i === 1) {
        caption = "people are hospitalized daily for opioid misuse";
    }
    else if (i === 2) {
        caption = "billion dollar economic burden on the U.S.";
    }
// caption 1
    svg.append("text")
        .attr("x", 300)
        .attr("y", 20)
        .text(caption)
        .attr("font-size", "15px");
};
export default other_stats_captions;