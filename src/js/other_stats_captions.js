const other_stats_captions = function (d3, i) {
    var svg = d3.select("#other_stats_captions")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    let caption = "";
    let caption2 = "";
    if(i === 0) {
        caption = "million people abused prescription opioids";
    }
    else if (i === 1) {
        caption = "people are hospitalized daily for opioid misuse.";
        caption2 = "Of those 1000+ people, an averge of 130 die from overdose.";
    }
    else if (i === 2) {
        caption = "billion dollar economic burden on the U.S.";
        caption2 = "Roughly $28.9B in health care, $41.8B in lost productivity, $7.6B in criminal justice costs";
    }
// caption 1
    svg.append("text")
        .attr("x", 300)
        .attr("y", 20)
        .text(caption)
        .attr("font-size", "15px");

    svg.append("text")
      .attr("x", 300)
      .attr("y", 50)
      .text(caption2)
      .attr("font-size", "15px");
};
export default other_stats_captions;
