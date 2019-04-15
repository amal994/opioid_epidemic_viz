import * as topojson from 'topojson';
import us from '../data/10m.json';
import county_data from '../data/county_year.tsv'
//source: https://observablehq.com/@d3/bivariate-choropleth
const map = function (d3) {
    const path = d3.geoPath();
    const colors = [
        "#e8e8e8", "#e8e8e8", "#ace4e4", "#5ac8c8",
        "#dfb0d6", "#a5add3", "#5698b9",
        "#be64ac", "#8c62aa", "#3b4994"
    ];

    function format(value) {
        if (!value) return "N/A";
        let a = value["Deaths"];
        if(a === "Suppressed")
            a = "< 10";
        let b = value["Crude_Rate"];
        if(b === "Suppressed")
            b = "< 10";
        return `${a} ${data_2.title[2]}
${b} ${data_2.title[4]}`;
    }
    var psv = d3.dsvFormat("|");
    const n = Math.floor(Math.sqrt(colors.length));
    const county_data_2 = county_data.map((a)=>{return a.join("|")}).join('\n');
    const data_2 = Object.assign(new Map(psv.parse(county_data_2, ({Notes, County, County_Code, Year,  Year_Code, Deaths, Population, Crude_Rate}) => [County_Code+","+Year_Code, {Year, County, Deaths, Population, Crude_Rate, Notes}])),
        {title: ["Year","County", "Deaths", "Population","Crude_Rate", "Notes"]});
    const states = new Map(us.objects.states.geometries.map(d => [d.id, d.properties]));
    const x = d3.scaleQuantile(Array.from(data_2.values(), d => {if(d["Deaths"]==="Suppressed") return 5; else return d["Deaths"]} ), d3.range(n));
    const y = d3.scaleQuantile(Array.from(data_2.values(), d => d["Population"]), d3.range(n));
    const svg = d3.select("#map_visualization")
        .attr("viewBox", "0 0 960 600")
        .style("width", "100%")
        .style("height", "auto");

    function color(value) {
        if (!value) return "#ccc";
        let deaths = value["Deaths"];
        if (value["Deaths"]==="Suppressed")
            deaths = 5;
        return colors[y(value["Population"]) + x(deaths) * n];
    }

    //svg.append(legend)
    //    .attr("transform", "translate(870,450)");

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .join("path")
        .attr("fill", d => color(data_2.get(d.id+",2015")))
        .attr("d", path)
        .append("title")
        .text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}
        ${format(data_2.get(d.id+",2015"))}`);

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);

    return svg.node();


};

export default map;