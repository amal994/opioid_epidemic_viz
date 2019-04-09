import age_year from "../data/age_year.tsv";
import * as d3 from 'd3';
//source: https://bl.ocks.org/bytesbysophie/952a1003dd188410e9c6262b68a65f9a
const barchart = function () {
    var margin = {top: 40, right: 30, bottom: 30, left: 50},
        width = 1200 - margin.left - margin.right,
        height = 520 - margin.top - margin.bottom;

    var greyColor = "#898989";
    var barColor = d3.interpolateInferno(0.4);
    var highlightColor = d3.interpolateInferno(0.3);

    var formatPercent = d3.format("");

    var svg = d3.select("#barchart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.4);
    var y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom(x).tickSize([]).tickPadding(10);
    var yAxis = d3.axisLeft(y).tickFormat(formatPercent);

    // Get the data
    const age_year2 = age_year.join('\n');
    const data1 = d3.csvParse(age_year2, ({Five_Year_Age_Groups, Year_Code, Deaths}) => {
        return {key: Five_Year_Age_Groups, year: Year_Code, value: Deaths};
    });
    var data =d3.nest()
        .key(function(d) { return d.key; })
        .rollup(function(v) { return d3.mean(v, function(d) { return d.value; }); })
        .entries(data1);
    data = data.slice(4,14);
    x.domain(data.map(d => {
        return d.key;
    }));
    y.domain([0, d3.max(data,  d => { return d.value; })]);
    //y.domain([0, 1]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .style("display", d => {
            return d.value === null ? "none" : null;
        })
        .style("fill", d => {
            return d.value === d3.max(data, d => {
                return d.value;
            })
                ? highlightColor : barColor
        })
        .attr("x", d => {
            return x(d.key);
        })
        .attr("width", x.bandwidth())
        .attr("y", () => {
            return height;
        })
        .attr("height", 0)
        .transition()
        .duration(750)
        .delay(function (d, i) {
            return i * 150;
        })
        .attr("y", d => {
            return y(d.value);
        })
        .attr("height", d => {
            return height - y(d.value);
        });

    svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .style("display", d => {
            return d.value === null ? "none" : null;
        })
        .attr("x", (d => {
            return x(d.key) + (x.bandwidth() / 2) - 8;
        }))
        .style("fill", d => {
            return d.value === d3.max(data, d => {
                return d.value;
            })
                ? highlightColor : greyColor
        })
        .attr("y", () => {
            return height;
        })
        .attr("height", 0)
        .transition()
        .duration(750)
        .delay((d, i) => {
            return i * 150;
        })
        .text(d => {
            return formatPercent(d.value);
        })
        .attr("y", d => {
            return y(d.value) + .1;
        })
        .attr("dy", "-.7em");
};

export default barchart;