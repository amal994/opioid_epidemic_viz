import new_england_data from '../data/a5_newengland_cdc_general_filtered.csv'

//sources: http://bl.ocks.org/diethardsteiner/3287802
const new_england_dashboard = function (d3, us_map, topojson) {
    // Data
    //const data = Object.assign(new Map(await d3.csv("https://gist.githubusercontent.com/mbostock/682b782da9e1448e6eaac00bb3d3cd9d/raw/0e0a145ded8b1672701dc8b2a702e51c648312d4/unemployment.csv", ({id, rate}) => [id, +rate])), {title: "Unemployment rate (%)"})
    let psv = d3.dsvFormat("|");

    let county_data_2 = new_england_data.map((a) => {
        return a.join("|")
    }).join('\n');
    let data = Object.assign(new Map(psv.parse(county_data_2,
        ({State, State_Code, County, County_Code, Year, Total_Deaths, Total_Population, Total_Age_Adjusted_Rate, Female_Deaths, Male_Deaths, White_Age_Adjusted_Rate, Black_Age_Adjusted_Rate, API_Age_Adjusted_Rate, Native_American_Age_Adjusted_Rate, Heroin_Deaths, Heroin_Age_Adjusted_Rate, Other_Opioids_Deaths, Other_Opioids_Age_Adjusted_Rate, Methadone_Deaths, Methadone_Age_Adjusted_Rate, Other_Synthetic_Narcotics_Deaths, Other_Synthetic_Narcotics_Age_Adjusted_Rate, Other_Unspecified_Narcotics_Deaths, Other_Unspecified_Narcotics_Age_Adjusted_Rate}) => [County_Code + "," + Year,
            {
                State,
                State_Code,
                County_Code,
                Year,
                County,
                Total_Deaths,
                Total_Population,
                Total_Age_Adjusted_Rate,
                Female_Deaths,
                Male_Deaths,
                White_Age_Adjusted_Rate,
                Black_Age_Adjusted_Rate,
                API_Age_Adjusted_Rate,
                Native_American_Age_Adjusted_Rate,
                Heroin_Deaths,
                Heroin_Age_Adjusted_Rate,
                Other_Opioids_Deaths,
                Other_Opioids_Age_Adjusted_Rate,
                Methadone_Deaths,
                Methadone_Age_Adjusted_Rate,
                Other_Synthetic_Narcotics_Deaths,
                Other_Synthetic_Narcotics_Age_Adjusted_Rate,
                Other_Unspecified_Narcotics_Deaths,
                Other_Unspecified_Narcotics_Age_Adjusted_Rate
            }])),
        {title: ["State", "State_Code", "County", "County_Code", "Year", "Total_Deaths", "Total_Population", "Total_Age_Adjusted_Rate", "Female_Deaths", "Male_Deaths", "White_Age_Adjusted_Rate", "Black_Age_Adjusted_Rate", "API_Age_Adjusted_Rate", "Native_American_Age_Adjusted_Rate", "Heroin_Deaths", "Heroin_Age_Adjusted_Rate", "Other_Opioids_Deaths", "Other_Opioids_Age_Adjusted_Rate", "Methadone_Deaths", "Methadone_Age_Adjusted_Rate", "Other_Synthetic_Narcotics_Deaths", "Other_Synthetic_Narcotics_Age_Adjusted_Rate", "Other_Unspecified_Narcotics_Deaths", "Other_Unspecified_Narcotics_Age_Adjusted_Rate"]});

    const years = ["1999", "2000", "2001", "2002",
        "2003", "2004", "2005", "2006",
        "2007", "2008", "2009", "2010",
        "2011", "2012", "2013", "2014",
        "2015", "2016", "2017"];
    let chosen_year = "1999";
    d3.select("#inputYearNE")
        .on("change", function () {
            var x = document.getElementById("inputYearNE");
            chosen_year = years[x.value];
            d3.select("#new_england_map").selectAll("*").remove();
            d3.select("#new_england_gender").selectAll("*").remove();
            d3.select("#new_england_opioid_type").selectAll("*").remove();
            new_england_map(d3, us_map, topojson, data, chosen_year);
            gender_barchart(d3, data, 'all', chosen_year);
            opioid_type_barchart(d3, data, 'all', chosen_year);
        })
        .selectAll("option")
        .data(years)
        .enter()
        .append("option")
        .attr("value", (d, i) => {
            return i;
        })
        .text((d) => {
            return d;
        })
        .attr("class", "center_me years_labels");

    new_england_map(d3, us_map, topojson, data, chosen_year);
    gender_barchart(d3, data, "all", chosen_year);
    opioid_type_barchart(d3, data, 'all', chosen_year);

};

async function new_england_map(d3, us_map, topojson, data, year) {
    //US
    function filter_states(result) {
        const states = ["09", "25", "23", "33", "44", "50"];
        let new_result = JSON.parse(JSON.stringify(result));
        new_result.objects.states.geometries = new_result.objects.states.geometries.filter(function (d) {
            return states.includes(d.id.slice(0, 2));
        });
        new_result.objects.counties.geometries = new_result.objects.counties.geometries.filter(function (d) {
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
        .range(['#87ceeb', '#a0c4e3', '#b4bad4', '#c2b2c7', '#cea9b9', '#d99faa', '#e1959d', '#e98b8e', '#f08080', "#ff514f", "#ff0600"])
        .domain([0, 5, 10, 15, 20, 25, 30, 35, 40, 45]);

    function colors(value) {
        if (value === "Suppressed" || value === "Unreliable")
            return color(0);
        return color(value);
    }

    // Legend
    const legend = g => {
        const x = d3.scaleLinear()
            .domain(d3.extent(color.domain()))
            .rangeRound([0, 250]);

        g.selectAll("rect")
            .data(color.range().map(d => color.invertExtent(d)))
            .join("rect")
            .attr("height", 8)
            .attr("x", d => x(d[0]))
            .attr("width", function (d) {
                if (!d[1])
                    d[1] = 45;
                if (!d[0])
                    d[0] = 0;
                return x(d[1]) - x(d[0]);
            })
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

    svg.append("text")
        .attr("transform", "translate(200,20)")
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("fill", "white")
        .text("Overdose Deaths in New England");

    svg.append("g")
        .attr("transform", "translate(600,40)")
        .call(legend);

    svg.append("g")
        .attr("class", "info_ne")
        .selectAll("path")
        .data(new_england.features)
        .join("path")
        .attr("fill", d => colors(data.get(d.id + "," + year)['Total_Age_Adjusted_Rate']))
        .on("mouseover", function (d) {
            var val = data.get(d.id + "," + year);
            var fill_color = colors(val['Total_Age_Adjusted_Rate']);
            tooltip.html("");
            tooltip.style("visibility", "visible")
                .style("border", "2px solid " + fill_color);
            tooltip.append("h5").text(val["County"] + ", " + val["State"]);
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
        .on("click", update_graphs)
        .attr("d", path)
        .append("title")
        .text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}
    ${format(data.get(d.id + "," + year)['Total_Age_Adjusted_Rate'])}`);

    svg.append("path")
        .attr("class", "ne_mesh")
        .datum(topojson.mesh(map_new_england, map_new_england.objects.states, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);
    return svg.node();
}

function gender_barchart(d3, data, county, year) {
    //if county =all:
    if (county === "all") {
        data = Object.assign(new Map([["all,1999", {"Male_Deaths": 342, "Female_Deaths": 131}],
            ["all,2000", {"Male_Deaths": 370, "Female_Deaths": 104}],
            ["all,2001", {"Male_Deaths": 533, "Female_Deaths": 183}],
            ["all,2002", {"Male_Deaths": 543, "Female_Deaths": 203}],
            ["all,2003", {"Male_Deaths": 645, "Female_Deaths": 210}],
            ["all,2004", {"Male_Deaths": 544, "Female_Deaths": 216}],
            ["all,2005", {"Male_Deaths": 626, "Female_Deaths": 268}],
            ["all,2006", {"Male_Deaths": 784, "Female_Deaths": 300}],
            ["all,2007", {"Male_Deaths": 724, "Female_Deaths": 328}],
            ["all,2008", {"Male_Deaths": 714, "Female_Deaths": 297}],
            ["all,2009", {"Male_Deaths": 736, "Female_Deaths": 310}],
            ["all,2010", {"Male_Deaths": 644, "Female_Deaths": 279}],
            ["all,2011", {"Male_Deaths": 708, "Female_Deaths": 315}],
            ["all,2012", {"Male_Deaths": 773, "Female_Deaths": 328}],
            ["all,2013", {"Male_Deaths": 1171, "Female_Deaths": 505}],
            ["all,2014", {"Male_Deaths": 1554, "Female_Deaths": 655}],
            ["all,2015", {"Male_Deaths": 2199, "Female_Deaths": 774}],
            ["all,2016", {"Male_Deaths": 2742, "Female_Deaths": 1038}],
            ["all,2017", {"Male_Deaths": 2883, "Female_Deaths": 972}]]));
    }

    var margin = {top: 40, right: 30, bottom: 30, left: 50},
        width = 400 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom;
    var greyColor = "#ffffff";
    var barColor = d3.interpolateRainbow(0.8);
    var highlightColor = "#ff6359";

    var formatPercent = d3.format("");

    var svg = d3.select("#new_england_gender")
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

    //data = data.slice(4,14);
    let genders = ["Female Deaths", "Male Deaths"];
    x.domain(genders);
    y.domain([0, d3.max([data.get(county + "," + year)['Male_Deaths'], data.get(county + "," + year)['Female_Deaths']], (d) => {
        return parseInt(d);
    })]);

    svg.append("text")
        .attr("x", (width / 2)-10)
        .attr("y", -8 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "white")
        .text("Deaths by Gender");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.selectAll(".bar")
        .data([data.get(county + "," + year)['Female_Deaths'], data.get(county + "," + year)['Male_Deaths']])
        .enter().append("rect")
        .attr("class", "bar")
        .style("display", d => {
            return d === null ? "none" : null;
        })
        .style("fill", d => {
            return parseInt(d) === d3.max([data.get(county + "," + year)['Female_Deaths'], data.get(county + "," + year)['Male_Deaths']], d => {
                return parseInt(d);
            })
                ? highlightColor : barColor
        })
        .attr("x", (d, i) => {
            return x(genders[i]);
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
            return y(d);
        })
        .attr("height", d => {
            return height - y(d);
        });

    svg.selectAll(".label")
        .data([data.get(county + "," + year)['Female_Deaths'], data.get(county + "," + year)['Male_Deaths']])
        .enter()
        .append("text")
        .attr("class", "label")
        .style("display", d => {
            return d === null ? "none" : null;
        })
        .attr("x", ((d, i) => {
            return x(genders[i]) + (x.bandwidth() / 2) - 8;
        }))
        .style("fill", d => {
            return parseInt(d) === d3.max([data.get(county + "," + year)['Female_Deaths'], data.get(county + "," + year)['Male_Deaths']], d => {
                return parseInt(d);
            }) ? highlightColor : greyColor
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
            return formatPercent(d);
        })
        .attr("y", d => {
            return y(d) + .1;
        })
        .attr("dy", "-.7em");
}


function opioid_type_barchart(d3, data, county, year) {
    //if county =all:
    if (county === "all") {
        data = Object.assign(new Map([['all,1999', {'Heroin_Deaths':80, 'Methadone_Deaths':0, 'Other_Synthetic_Narcotics_Deaths':0, 'Other_Unspecified_Narcotics_Deaths':266, 'Other_Opioids_Deaths':0}],
            ['all,2000', {'Heroin_Deaths':83, 'Methadone_Deaths':0, 'Other_Synthetic_Narcotics_Deaths':0, 'Other_Unspecified_Narcotics_Deaths':298, 'Other_Opioids_Deaths':0}],
            ['all,2001', {'Heroin_Deaths':70, 'Methadone_Deaths':0, 'Other_Synthetic_Narcotics_Deaths':0, 'Other_Unspecified_Narcotics_Deaths':437, 'Other_Opioids_Deaths':47}],
            ['all,2002', {'Heroin_Deaths':71, 'Methadone_Deaths':40, 'Other_Synthetic_Narcotics_Deaths':0, 'Other_Unspecified_Narcotics_Deaths':413, 'Other_Opioids_Deaths':70}],
            ['all,2003', {'Heroin_Deaths':88, 'Methadone_Deaths':24, 'Other_Synthetic_Narcotics_Deaths':0, 'Other_Unspecified_Narcotics_Deaths':482, 'Other_Opioids_Deaths':57}],
            ['all,2004', {'Heroin_Deaths':72, 'Methadone_Deaths':69, 'Other_Synthetic_Narcotics_Deaths':0, 'Other_Unspecified_Narcotics_Deaths':344, 'Other_Opioids_Deaths':36}],
            ['all,2005', {'Heroin_Deaths':67, 'Methadone_Deaths':120, 'Other_Synthetic_Narcotics_Deaths':12, 'Other_Unspecified_Narcotics_Deaths':396, 'Other_Opioids_Deaths':95}],
            ['all,2006', {'Heroin_Deaths':79, 'Methadone_Deaths':258, 'Other_Synthetic_Narcotics_Deaths':71, 'Other_Unspecified_Narcotics_Deaths':401, 'Other_Opioids_Deaths':170}],
            ['all,2007', {'Heroin_Deaths':114, 'Methadone_Deaths':217, 'Other_Synthetic_Narcotics_Deaths':31, 'Other_Unspecified_Narcotics_Deaths':307, 'Other_Opioids_Deaths':199}],
            ['all,2008', {'Heroin_Deaths':111, 'Methadone_Deaths':118, 'Other_Synthetic_Narcotics_Deaths':31, 'Other_Unspecified_Narcotics_Deaths':367, 'Other_Opioids_Deaths':225}],
            ['all,2009', {'Heroin_Deaths':105, 'Methadone_Deaths':162, 'Other_Synthetic_Narcotics_Deaths':12, 'Other_Unspecified_Narcotics_Deaths':352, 'Other_Opioids_Deaths':219}],
            ['all,2010', {'Heroin_Deaths':81, 'Methadone_Deaths':102, 'Other_Synthetic_Narcotics_Deaths':32, 'Other_Unspecified_Narcotics_Deaths':276, 'Other_Opioids_Deaths':248}],
            ['all,2011', {'Heroin_Deaths':217, 'Methadone_Deaths':56, 'Other_Synthetic_Narcotics_Deaths':25, 'Other_Unspecified_Narcotics_Deaths':331, 'Other_Opioids_Deaths':267}],
            ['all,2012', {'Heroin_Deaths':341, 'Methadone_Deaths':96, 'Other_Synthetic_Narcotics_Deaths':23, 'Other_Unspecified_Narcotics_Deaths':272, 'Other_Opioids_Deaths':292}],
            ['all,2013', {'Heroin_Deaths':570, 'Methadone_Deaths':120, 'Other_Synthetic_Narcotics_Deaths':100, 'Other_Unspecified_Narcotics_Deaths':436, 'Other_Opioids_Deaths':412}],
            ['all,2014', {'Heroin_Deaths':884, 'Methadone_Deaths':112, 'Other_Synthetic_Narcotics_Deaths':737, 'Other_Unspecified_Narcotics_Deaths':473, 'Other_Opioids_Deaths':445}],
            ['all,2015', {'Heroin_Deaths':1132, 'Methadone_Deaths':130, 'Other_Synthetic_Narcotics_Deaths':1603, 'Other_Unspecified_Narcotics_Deaths':513, 'Other_Opioids_Deaths':544}],
            ['all,2016', {'Heroin_Deaths':1126, 'Methadone_Deaths':160, 'Other_Synthetic_Narcotics_Deaths':2740, 'Other_Unspecified_Narcotics_Deaths':392, 'Other_Opioids_Deaths':634}],
            ['all,2017', {'Heroin_Deaths':942, 'Methadone_Deaths':150, 'Other_Synthetic_Narcotics_Deaths':3165, 'Other_Unspecified_Narcotics_Deaths':227, 'Other_Opioids_Deaths':525}]]));
    }

    var margin = {top: 40, right: 30, bottom: 80, left: 50},
        width = 400 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom;
    var greyColor = "#ffffff";
    var barColor = d3.interpolateRainbow(0.8);
    var highlightColor = "#ff6359";

    var formatPercent = d3.format("");

    var svg = d3.select("#new_england_opioid_type")
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

    //data = data.slice(4,14);
    let opioids = ["Heroin", "Methadone","Synthetic Narcotics","Unspecified Narcotics", "Other"];
    x.domain(opioids);
    y.domain([0, d3.max([data.get(county + "," + year)['Heroin_Deaths'], data.get(county + "," + year)['Methadone_Deaths'], data.get(county + "," + year)['Other_Synthetic_Narcotics_Deaths'],  data.get(county + "," + year)['Other_Unspecified_Narcotics_Deaths'],  data.get(county + "," + year)['Other_Opioids_Deaths']], (d) => {
        return parseInt(d);
    })]);

    svg.append("text")
        .attr("x", (width / 2)-10)
        .attr("y", -8 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "white")
        .text("Deaths by Opioid Type");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.selectAll(".bar")
        .data([data.get(county + "," + year)['Heroin_Deaths'], data.get(county + "," + year)['Methadone_Deaths'], data.get(county + "," + year)['Other_Synthetic_Narcotics_Deaths'],  data.get(county + "," + year)['Other_Unspecified_Narcotics_Deaths'],  data.get(county + "," + year)['Other_Opioids_Deaths']])
        .enter().append("rect")
        .attr("class", "bar")
        .style("display", d => {
            return d === null ? "none" : null;
        })
        .style("fill", d => {
            return parseInt(d) === d3.max([data.get(county + "," + year)['Heroin_Deaths'], data.get(county + "," + year)['Methadone_Deaths'], data.get(county + "," + year)['Other_Synthetic_Narcotics_Deaths'],  data.get(county + "," + year)['Other_Unspecified_Narcotics_Deaths'],  data.get(county + "," + year)['Other_Opioids_Deaths']], d => {
                return parseInt(d);
            })
                ? highlightColor : barColor
        })
        .attr("x", (d, i) => {
            return x(opioids[i]);
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
            return y(d);
        })
        .attr("height", d => {
            return height - y(d);
        });

    svg.selectAll(".label")
        .data([data.get(county + "," + year)['Heroin_Deaths'], data.get(county + "," + year)['Methadone_Deaths'], data.get(county + "," + year)['Other_Synthetic_Narcotics_Deaths'],  data.get(county + "," + year)['Other_Unspecified_Narcotics_Deaths'],  data.get(county + "," + year)['Other_Opioids_Deaths']])
        .enter()
        .append("text")
        .attr("class", "label")
        .style("display", d => {
            return d === null ? "none" : null;
        })
        .attr("x", ((d, i) => {
            return x(opioids[i]) + (x.bandwidth() / 2) - 8;
        }))
        .style("fill", d => {
            return parseInt(d) === d3.max([data.get(county + "," + year)['Heroin_Deaths'], data.get(county + "," + year)['Methadone_Deaths'], data.get(county + "," + year)['Other_Synthetic_Narcotics_Deaths'],  data.get(county + "," + year)['Other_Unspecified_Narcotics_Deaths'],  data.get(county + "," + year)['Other_Opioids_Deaths']], d => {
                return parseInt(d);
            }) ? highlightColor : greyColor
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
            return formatPercent(d);
        })
        .attr("y", d => {
            return y(d) + .1;
        })
        .attr("dy", "-.7em");
}

function update_graphs(county, year, d3, data) {
    d3.select("#new_england_gender").selectAll("*").remove();
    d3.select("#new_england_opioid_type").selectAll("*").remove();
    gender_barchart(d3, data, county, year);
    opioid_type_barchart(d3, data, county, year);
    //opioid_type_barchart(county, year);
}

export default new_england_dashboard;