const new_england_map = async function (d3, us_map, topojson) {
    // Data
    const data = Object.assign(new Map(await d3.csv("https://gist.githubusercontent.com/mbostock/682b782da9e1448e6eaac00bb3d3cd9d/raw/0e0a145ded8b1672701dc8b2a702e51c648312d4/unemployment.csv", ({id, rate}) => [id, +rate])), {title: "Unemployment rate (%)"})

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
    const color = d3.scaleQuantize([1, 10], d3.schemeBlues[9]);
    // Legend
    const legend = g => {
        const x = d3.scaleLinear()
            .domain(d3.extent(color.domain()))
            .rangeRound([0, 260]);

        g.selectAll("rect")
            .data(color.range().map(d => color.invertExtent(d)))
            .join("rect")
            .attr("height", 8)
            .attr("x", d => x(d[0]))
            .attr("width", d => x(d[1]) - x(d[0]))
            .attr("fill", d => color(d[0]));

        g.append("text")
            .attr("x", x.range()[0])
            .attr("y", -6)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.title);

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

    const svg = d3.select("#new_england_map")
        .attr("viewBox", "0 0 960 600")
        .style("width", "960")
        .style("height", "600");

    svg.append("g")
        .attr("transform", "translate(600,40)")
        .call(legend);

    svg.append("g")
        .selectAll("path")
        .data(new_england.features)
        .join("path")
        .attr("fill", d => color(data.get(d.id)))
        .attr("d", path)
        .append("title")
        .text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}
    ${format(data.get(d.id))}`);

    svg.append("path")
        .datum(topojson.mesh(map_new_england, map_new_england.objects.states, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);

    return svg.node();
};

export default new_england_map;