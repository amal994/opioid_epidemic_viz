import * as topojson from 'topojson';
import us from '../data/10m.json';
import county_data from '../data/county_year.tsv';
import 'intersection-observer';
import scrollama from 'scrollama';
//source: https://observablehq.com/@d3/bivariate-choropleth
const map = function (d3) {
    // using d3 for convenience
    const main = d3.select('main');
    const scrolly = main.select('#scroll_map_timeline');
    const step = scrolly.selectAll('.timeline_step');

    // initialize the scrollama
    var scroller = scrollama();

    // generic window resize listener event
    function handleResize() {
        // 1. update height of step elements aka timeline years
        var stepH = Math.floor(window.innerHeight * 0.75);
        step.style('height', stepH + 'px');
        // map dimensions:
        // 3. tell scrollama to update new element dimensions
        scroller.resize();
    }

    // scrollama event handlers
    function handleStepEnter(response) {
        //console.log(response);
        // response = { element, direction, index }
        // add color to current step only
        step.classed('is-active', function (d, i) {
            return i === response.index;
        });
        // update graphic based on step
    }


    function init() {
        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();
        // 2. setup the scroller passing options
        // 		this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller.setup({
            step: '#scroll_map_timeline .timeline_step',
            offset: 0.33,
            debug: true,
        })
            .onStepEnter(handleStepEnter);
        // setup resize event
        window.addEventListener('resize', handleResize);
    }
    // kick things off
    init();
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