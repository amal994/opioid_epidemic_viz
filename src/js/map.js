import * as d3 from 'd3';
import * as topojson from 'topojson';
import us from '../data/10m.json';
import obesity_data from '../data/cdc-diabetes-obesity.csv'
import county_data from '../data/county_year.tsv'
//source: https://observablehq.com/@d3/bivariate-choropleth
const map = function () {
    const path = d3.geoPath();
    var domain = [1, 10, 20, 30, 40, 50, 60];

    var width = 600;

    var generator = d3.scaleLinear()
        .domain([1,(domain.length-1)/2,domain.length-1])
        .range([
            d3.hsl(-100, 0.95, 0.52),
            d3.hsl(  80, 1.15, 0.62),
            d3.hsl( 0, 0.55, 0.52)]
        )
        .interpolate(d3.interpolateHslLong)

    var range = d3.range(domain.length).map(generator);
    var colors = d3.scaleQuantile()
        .domain(domain)
        .range(range);
    //const colors = d3.scaleSequential(d3.interpolatePiYG);
    const labels = ["low", "", "high"];
    function format(value) {
        if (!value) return "N/A";
        let [a, b] = value;
        return `${a}% ${data.title[0]}${labels[x(a)] && ` (${labels[x(a)]})`}
${b}% ${data.title[1]}${labels[y(b)] && ` (${labels[y(b)]})`}`;
    }
    var psv = d3.dsvFormat("|");
    const n = Math.floor(Math.sqrt(colors.length));
    const data = Object.assign(new Map(d3.csvParse(obesity_data.join('\n'), ({county, diabetes, obesity}) => [county, [+diabetes, +obesity]])),
        {title: ["Diabetes", "Obesity"]});
    const county_data_2 = county_data.map((a)=>{return a.join("|")}).join('\n');
    const data_2 = Object.assign(new Map(psv.parse(county_data_2, ({Notes, County, County_Code, Year,  Year_Code, Deaths, Population, Crude_Rate}) => [County_Code+","+Year_Code, {Year, County, Deaths, Population, Crude_Rate}])),
        {title: ["Year","County", "Deaths", "Population","Crude_Rate", "Notes"]});
    console.log(data_2);
    const states = new Map(us.objects.states.geometries.map(d => [d.id, d.properties]));
    const x = d3.scaleQuantile(Array.from(data_2.values(), d => {if(d["Deaths"]==="Suppressed") return 5; else return d["Deaths"]} ), range);
    const y = d3.scaleQuantile(Array.from(data_2.values(), d => d["Population"]), range);
    const svg = d3.select("#map_visualization")
        .attr("viewBox", "0 0 960 600")
        .style("width", "100%")
        .style("height", "auto");

    function color(value) {
        if (!value) return "#ccc";
        let deaths = value["Deaths"];
        if (value["Deaths"]==="Suppressed")
            return "#ccc";
        return colors(deaths);
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