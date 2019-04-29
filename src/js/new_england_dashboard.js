import new_england_data from '../data/a5_newengland_cdc_general_filtered.csv'

//sources: http://bl.ocks.org/diethardsteiner/3287802
const new_england_dashboard =  function (d3, us_map, topojson) {
    // Data
    //const data = Object.assign(new Map(await d3.csv("https://gist.githubusercontent.com/mbostock/682b782da9e1448e6eaac00bb3d3cd9d/raw/0e0a145ded8b1672701dc8b2a702e51c648312d4/unemployment.csv", ({id, rate}) => [id, +rate])), {title: "Unemployment rate (%)"})
    let psv = d3.dsvFormat("|");

    let county_data_2 = new_england_data.map((a) => {
        return a.join("|")
    }).join('\n');
    let data = Object.assign(new Map(psv.parse(county_data_2,
        ({State,State_Code,County,County_Code,Year,Total_Deaths,Total_Population,Total_Age_Adjusted_Rate,Female_Deaths, Male_Deaths,White_Age_Adjusted_Rate,Black_Age_Adjusted_Rate,API_Age_Adjusted_Rate,Native_American_Age_Adjusted_Rate,Heroin_Deaths,Heroin_Age_Adjusted_Rate,Other_Opioids_Deaths,Other_Opioids_Age_Adjusted_Rate,Methadone_Deaths,Methadone_Age_Adjusted_Rate,Other_Synthetic_Narcotics_Deaths,Other_Synthetic_Narcotics_Age_Adjusted_Rate,Other_Unspecified_Narcotics_Deaths,Other_Unspecified_Narcotics_Age_Adjusted_Rate }) => [County_Code+","+Year,
            {State,State_Code,County_Code, Year, County,Total_Deaths,Total_Population,Total_Age_Adjusted_Rate,Female_Deaths, Male_Deaths, White_Age_Adjusted_Rate,Black_Age_Adjusted_Rate,API_Age_Adjusted_Rate,Native_American_Age_Adjusted_Rate,Heroin_Deaths,Heroin_Age_Adjusted_Rate,Other_Opioids_Deaths,Other_Opioids_Age_Adjusted_Rate,Methadone_Deaths,Methadone_Age_Adjusted_Rate,Other_Synthetic_Narcotics_Deaths,Other_Synthetic_Narcotics_Age_Adjusted_Rate,Other_Unspecified_Narcotics_Deaths,Other_Unspecified_Narcotics_Age_Adjusted_Rate}])),
        {title: ["State","State_Code","County","County_Code","Year","Total_Deaths","Total_Population","Total_Age_Adjusted_Rate","Female_Deaths","Male_Deaths","White_Age_Adjusted_Rate","Black_Age_Adjusted_Rate","API_Age_Adjusted_Rate","Native_American_Age_Adjusted_Rate","Heroin_Deaths","Heroin_Age_Adjusted_Rate","Other_Opioids_Deaths","Other_Opioids_Age_Adjusted_Rate","Methadone_Deaths","Methadone_Age_Adjusted_Rate","Other_Synthetic_Narcotics_Deaths","Other_Synthetic_Narcotics_Age_Adjusted_Rate","Other_Unspecified_Narcotics_Deaths","Other_Unspecified_Narcotics_Age_Adjusted_Rate"]});

    let ne_map = new_england_map(d3, us_map, topojson, data);
};

async function new_england_map(d3, us_map, topojson, data){

    //US
    function filter_states(result) {
        const states = ["09", "25", "23", "33", "44", "50"];
        let new_result = JSON.parse(JSON.stringify(result));
        new_result.objects.states.geometries = new_result.objects.states.geometries.filter(function(d) {
            return states.includes(d.id.slice(0, 2));
        });
        new_result.objects.counties.geometries = new_result.objects.counties.geometries.filter(function(d) {
            return states.includes(d.id.slice(0, 2));
        });
        return new_result;
    }
    const map_new_england = filter_states(us_map);
    // States
    const states = new Map(map_new_england.objects.states.geometries.map(d => [d.id, d.properties]));
    // Format
    const format = d => `${d}%`;
    // Color
    const color = d3.scaleThreshold()
        .range(['#000000', '#87ceeb', '#a0c4e3', '#b4bad4', '#c2b2c7', '#cea9b9', '#d99faa', '#e1959d', '#e98b8e', '#f08080', "#ff514f", "#ff0600"])
        .domain([-5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45]);
    function colors(value) {
        if (value === "Suppressed" || value === "Unreliable")
            return color(-5);
        return color(value);
    }
    // Legend
    const legend = g => {
        const x = d3.scaleLinear()
            .domain(d3.extent(color.domain()))
            .rangeRound([-5, 250]);

        g.selectAll("rect")
            .data(color.range().map(d => color.invertExtent(d)))
            .join("rect")
            .attr("height", 8)
            .attr("x", d => x(d[0]))
            .attr("width", function(d){
                if (!d[1])
                    d[1] = 45;
                if (!d[0])
                    d[0] = -5;
                    return x(d[1]) - x(d[0]);})
            .attr("fill", d => color(d[0]));

        g.append("text")
            .attr("x", x.range()[0])
            .attr("y", -6)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text("Overdose Deaths Crude Rate");

        g.call(d3.axisBottom(x)
            .tickSize(13)
            .tickFormat(d => d)
            .tickValues(color.range().slice(1).map(d => color.invertExtent(d)[0])))
            .select(".domain")
            .remove();
    };

    var new_england = topojson.feature(map_new_england, map_new_england.objects.counties);

    var projection = d3.geoIdentity().fitExtent([[20, 20], [940, 580]], new_england);
    var path = d3.geoPath(projection);
    let tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_map")
        .style("position", "absolute")
        .style("z-index", "100")
        .style("visibility", "hidden");

    const svg = d3.select("#new_england_map")
        .attr("viewBox", "0 0 960 600")
        .style("width", "100%")
        .style("height", "auto");

    svg.append("g")
        .attr("transform", "translate(600,40)")
        .call(legend);

    svg.append("g")
        .attr("class", "info_ne")
        .selectAll("path")
        .data(new_england.features)
        .join("path")
        .attr("fill", d => colors(data.get(d.id+",2017")['Total_Age_Adjusted_Rate']))
        .on("mouseover", function (d) {
            var val = data.get(d.id + ",2017");
            var fill_color = colors(val['Total_Age_Adjusted_Rate']);
            tooltip.html("");
            tooltip.style("visibility", "visible")
                .style("border", "2px solid " + fill_color);
            tooltip.append("h5").text(val["State"]+","+val["County"]);
            if (val) {
                tooltip.append("div")
                    .text("Population: " + val["Total_Population"]);
                tooltip.append("div")
                    .text("Deaths: " + val["Total_Deaths"]);
                tooltip.append("div")
                    .text("Crude Rate: " + val["Total_Age_Adjusted_Rate"]);
            }
            d3.selectAll(".info_ne path")
                .style("opacity", 0.3)
                .style("stroke", null);
            d3.select(this)
                .style("opacity", 1)
                .style("stroke", "#222")
                .raise();
            d3.selectAll(".ne_mesh")
                .style("opacity", 0);
        })
        .on("mousemove", function () {
            return tooltip.style("top", (d3.event.pageY - 52) + "px").style("left", (d3.event.pageX + 18) + "px");
        })
        .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
            d3.selectAll(".info_ne path")
                .style("opacity", 1);
            d3.selectAll(".ne_mesh")
                .style("opacity", 1);
        })
        .attr("d", path)
        .append("title")
        .text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}
    ${format(data.get(d.id+",2017")['Total_Age_Adjusted_Rate'])}`);

    svg.append("path")
        .attr("class","ne_mesh")
        .datum(topojson.mesh(map_new_england, map_new_england.objects.states, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);

    return svg.node();
}
export default new_england_dashboard;