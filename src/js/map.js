import * as d3 from 'd3';
import * as topojson from 'topojson';
import us from '../data/10m.json';
import obesity_data from '../data/cdc-diabetes-obesity.csv'

const map = function () {
    const path = d3.geoPath();
    const colors = [
        "#e8e8e8", "#ace4e4", "#5ac8c8",
        "#dfb0d6", "#a5add3", "#5698b9",
        "#be64ac", "#8c62aa", "#3b4994"
    ];
    const labels = ["low", "", "high"];
    function format(value) {
        if (!value) return "N/A";
        let [a, b] = value;
        return `${a}% ${data.title[0]}${labels[x(a)] && ` (${labels[x(a)]})`}
${b}% ${data.title[1]}${labels[y(b)] && ` (${labels[y(b)]})`}`;
    }

    const n = Math.floor(Math.sqrt(colors.length));
    const data = Object.assign(new Map(d3.csvParse(obesity_data.join('\n'), ({county, diabetes, obesity}) => [county, [+diabetes, +obesity]])),
        {title: ["Diabetes", "Obesity"]});
    const states = new Map(us.objects.states.geometries.map(d => [d.id, d.properties]));
    const x = d3.scaleQuantile(Array.from(data.values(), d => d[0]), d3.range(n));
    const y = d3.scaleQuantile(Array.from(data.values(), d => d[1]), d3.range(n));
    const svg = d3.select("#map_visualization")
        .attr("viewBox", "0 0 960 600")
        .style("width", "100%")
        .style("height", "auto");

    function color(value) {
        if (!value) return "#ccc";
        let [a, b] = value;
        return colors[y(b) + x(a) * n];
    }

    //svg.append(legend)
    //    .attr("transform", "translate(870,450)");

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .join("path")
        .attr("fill", d => color(data.get(d.id)))
        .attr("d", path)
        .append("title")
        .text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}
        ${format(data.get(d.id))}`);

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);

    return svg.node();


};

export default map;