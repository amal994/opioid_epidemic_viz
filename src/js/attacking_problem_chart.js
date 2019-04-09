import * as d3 from 'd3';
import mcd_year1 from '../data/mcd_year.tsv';

// Source: https://observablehq.com/@d3/multi-line-chart
const attacking_problem_chart = function () {
    var mcd_year = mcd_year1.join('\n');
    var original_data = d3.csvParse(mcd_year, ({Multiple_Cause_of_death, Year_Code, Deaths}) => {
        return {key: Multiple_Cause_of_death, year: Year_Code, value: Deaths};
    });
    var series = d3.nest()
        .key(function (d) {
            return d.key;
        })
        .rollup(function (v) {
            return v.map(function (d) {
                return d.value;
            });
        })
        .entries(original_data);

    var dates = [...new Set(original_data.map(function (d) {
        return d.year;
    }))].map((k) => {
        return new Date(k, 0, 1);
    });
    const data = {series: series, dates: dates, y: "Deaths"};
    const width = 1100;
    const height = 600;
    const margin = ({top: 20, right: 20, bottom: 30, left: 50});
    const x = d3.scaleTime()
        .domain(d3.extent(data.dates))
        .range([margin.left, width - margin.right]);
    const y = d3.scaleLinear()
        .domain([0, 30000]).nice()
        .range([height - margin.bottom, margin.top]);

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y));

    const line = d3.line()
        .defined(d => !isNaN(d))
        .x((d, i) => x(data.dates[i]))
        .y(d => y(d));

    const svg = d3.select("#attack_problem")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    const path = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .selectAll("path")
        .data(data.series)
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("d", d => line(d.value));

    svg.call(hover, path);

    function hover(svg, path) {
        svg
            .style("position", "relative");

        if ("ontouchstart" in document) svg
            .style("-webkit-tap-highlight-color", "transparent")
            .on("touchmove", moved)
            .on("touchstart", entered)
            .on("touchend", left)
        else svg
            .on("mousemove", moved)
            .on("mouseenter", entered)
            .on("mouseleave", left);

        const dot = svg.append("g")
            .attr("display", "none");

        dot.append("circle")
            .attr("r", 2.5);

        dot.append("text")
            .style("font", "10px sans-serif")
            .attr("text-anchor", "middle")
            .attr("y", -8);

        function moved() {
            d3.event.preventDefault();
            const ym = y.invert(d3.event.layerY);
            const xm = x.invert(d3.event.layerX);
            const i1 = d3.bisectLeft(data.dates, xm, 1);
            const i0 = i1 - 1;
            const i = xm - data.dates[i0] > data.dates[i1] - xm ? i1 : i0;
            const s = data.series.reduce((a, b) => Math.abs(a.value[i] - ym) < Math.abs(b.value[i] - ym) ? a : b);
            path.attr("stroke", d => d === s ? null : "#ddd").filter(d => d === s).raise();
            dot.attr("transform", `translate(${x(data.dates[i])},${y(s.value[i])})`);
            dot.select("text").text(s.key);
        }

        function entered() {
            path.style("mix-blend-mode", null).attr("stroke", "#ddd");
            dot.attr("display", null);
        }

        function left() {
            path.style("mix-blend-mode", "multiply").attr("stroke", null);
            dot.attr("display", "none");
        }
    }

    return svg.node();

};
export default attacking_problem_chart;