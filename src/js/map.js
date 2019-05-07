
import death_by_state from '../data/state_year_data.csv';
import 'intersection-observer';
import scrollama from 'scrollama';
//source: https://observablehq.com/@d3/bivariate-choropleth
//http://bl.ocks.org/syntagmatic/623a3221d3e694f85967d83082fd4a77
const map = function (d3, us, topojson) {
    const years = ["1999","2000","2001","2002",
        "2003", "2004", "2005","2006",
        "2007","2008", "2009", "2010",
        "2011", "2012", "2013", "2014",
        "2015", "2016","2017"];
    d3.select("#timeline")
        .selectAll("div")
        .data(years)
        .enter()
        .append("div")
        .attr("class", "timeline_step")
        .attr("data-step", (d,i) => {
            return i;
        })
        .append("h1")
        .text((d) => {
            return d;
        })
        .attr("class", "center_me years_labels");
    let year = years[0];

    // using d3 for convenience
    const main = d3.select('main');
    const scrolly = main.select('#scroll_map_timeline');
    const step = scrolly.selectAll('.timeline_step');

    // initialize the scrollama
    var scroller = scrollama();

    // generic window resize listener event
    function handleResize() {
        // 1. update height of step elements aka timeline years
        //var stepH = Math.floor(window.innerHeight * 0.75);
        //step.style('height', stepH + 'px');
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
        year = years[response.index];
        d3.select("#map_visualization").selectAll("*").remove();
        create_states_on_map(year);
        if (response.index < years.length-1) {
            d3.select("#year_mark").style("visibility","visible")
        }
        else if (response.index === years.length-1) {
            d3.select("#year_mark").style("visibility","hidden")
        }
    }


    function init() {
        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();
        // 2. setup the scroller passing options
        // 		this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller.setup({
            step: '#scroll_map_timeline .timeline_step',
            offset: 0.50,
            debug: false,
        })
            .onStepEnter(handleStepEnter);
        // setup resize event
        window.addEventListener('resize', handleResize);
    }

    // kick things off
    init();
    const path = d3.geoPath();
    const colors = d3.scaleThreshold()
        .range(['#000000', '#87ceeb', '#a0c4e3', '#b4bad4', '#c2b2c7', '#cea9b9', '#d99faa', '#e1959d', '#e98b8e', '#f08080', "#ff514f", "#ff0600"])
        .domain([-1, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45]);

    function format(value) {
        if (!value) return "N/A";
        let a = value["Deaths"];
        if (a === "Suppressed" || a === "Unreliable")
            a = "< 10";
        let b = value["Crude_Rate"];
        if (b === "Suppressed" || b === "Unreliable")
            b = "< 10";
        return `${a} ${data_2.title[2]}
${b} ${data_2.title[4]}`;
    }

    var psv = d3.dsvFormat("|");

    const county_data_2 = death_by_state.map((a) => {
        return a.join("|")
    }).join('\n');
    const data_2 = Object.assign(new Map(psv.parse(county_data_2, ({State, State_Code, Year, Year_Code, Deaths, Population, Crude_Rate}) => [State_Code + "," + Year_Code, {
            State,
            Year,
            Deaths,
            Population,
            Crude_Rate
        }])),
        {title: ["State", "Year", "Deaths", "Population", "Crude_Rate"]});

    const states = new Map(us.objects.states.geometries.map(d => [d.id, d.properties]));

    let tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_map")
        .style("position", "absolute")
        .style("z-index", "100")
        .style("visibility", "hidden");

    function color(value) {
        if (!value) return "#000";
        let deaths = value["Crude_Rate"];
        if (deaths === "Suppressed" || deaths === "Unreliable")
            deaths = -1;
        return colors(deaths);
    }
    const svg = d3.select("#map_visualization")
        .attr("viewBox", "0 0 960 600")
        .style("width", "75%")
        .style("height", "auto");

    function create_states_on_map(yearf){
        svg.append("g")
            .attr("class", "info_states")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .join("path")
            .attr("fill", d => color(data_2.get(d.id + "," + yearf)))
            .on("mouseover", function (d) {
                var val = data_2.get(d.id + "," + yearf);
                var fill_color = color(val);
                tooltip.html("");
                tooltip.style("visibility", "visible")
                    .style("border", "2px solid " + fill_color);
                tooltip.append("h5").text(states.get(d.id).name);
                if (val) {
                    tooltip.append("div")
                        .text("Population: " + val["Population"]);
                    tooltip.append("div")
                        .text("Deaths: " + val["Deaths"]);
                    tooltip.append("div")
                        .text("Crude Rate: " + val["Crude_Rate"]);
                }
                d3.selectAll(".info_states path")
                    .style("opacity", 0.3)
                    .style("stroke", null);
                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke", "#222")
                    .raise();
                d3.selectAll(".states")
                    .style("opacity", 0);
            })
            .on("mousemove", function () {
                return tooltip.style("top", (d3.event.pageY - 52) + "px").style("left", (d3.event.pageX + 18) + "px");
            })
            .on("mouseout", function () {
                tooltip.style("visibility", "hidden");
                d3.selectAll(".info_states path")
                    .style("opacity", 1);
                d3.selectAll(".states")
                    .style("opacity", 1);
            })
            .attr("d", path)
            .append("title")
            .text(d => `${d.properties.name}, ${states.get(d.id).name}
             ${format(data_2.get(d.id + "," + yearf))}`);

        svg.append("path")
            .datum(topojson.mesh(us, us.objects.states))
            .attr("class", "states")
            .attr("fill", "none")
            .attr("stroke", "#000000")
            .attr("stroke-width", 1)
            .attr("stroke-linejoin", "round")
            .attr("d", path);

        var width = 960,
            height = 500;
        svg.append("text")
            .style("font-weight", "bold")
            .attr("x", width - 132)
            .attr("y", height - 70)
            .style("fill", "white")
            .text("Deaths per 100,000");

        var legend = svg.selectAll(".legend")
            .data(colors.domain().reverse())
            .enter().append("g")
            .attr("transform", function (d, i) {
                return "translate(" + (width - 120) + "," + (height - 60 + 16 * i) + ")";
            });

        legend.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .style("fill", function (d) {
                return colors(d);
            });


        legend.append("text")
            .attr("x", 16)
            .attr("y", 11)
            .style("fill", "white")
            .style("font-size", "12px")
            .text(function (d) {
                if (d === -1) {
                    return "Supressed or Unreliable"
                }
                return d;
            });

        return svg.node();
    }
    create_states_on_map(years[0]);

};

export default map;
