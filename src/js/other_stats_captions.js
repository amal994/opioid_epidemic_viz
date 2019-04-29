const other_stats_captions = function (d3, i) {
    var svg = d3.select("#other_stats_captions")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    let caption = "";
    if(i === 0) {
        caption = ["people abused prescription opioids"];
    }
    else if (i === 1) {
        caption = ["people are hospitalized daily for opioid misuse.",
                    "Of those 1000+ people, an averge of 130 die from overdose."];
    }
    else if (i === 2) {
        caption = ["economic burden on the U.S.",
                    "- $28.9B in health care",
                    "- $41.8B in lost productivity",
                    "- $7.6B in criminal justice costs"];
    }

    var y_val = [20, 45, 70, 95];
    for (var x = 0; x < caption.length; x++) {
      var cap = caption[x];

      svg.append("text")
          .attr("x", 300)
          .attr("y", y_val[x])
          .text(cap)
          .attr("font-size", "15px");
    }

};
export default other_stats_captions;
