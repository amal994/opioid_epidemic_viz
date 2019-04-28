import scrollama from "scrollama";
import oneinfive from "./oneinfive";
import fourtypercent from "./fourtypercent";
import other_stats from "./other_stats";
import other_stats_captions from "./other_stats_captions";
import prescriptions from "./millions_prescriptions";

const intro_stats = function(d3) {
    // using d3 for convenience
    const main = d3.select('main');
    const scrolly = main.select('#intro_scrollable');
    const step = scrolly.selectAll('.step');

    // initialize the scrollama
    var scroller_stat = scrollama();
    // generic window resize listener event
    function handleResize() {
        // 1. update height of step elements aka timeline years
        var stepH = Math.floor(window.innerHeight/2);
        step.style('height', stepH + 'px');
        scroller_stat.resize();
    }

    // scrollama event handlers
    function handleStepEnter(response) {
        // response = { element, direction, index }
        // add color to current step only
        step.classed('is-active', function (d, i) {
            return i === response.index;
        });
        const container = d3.select("#stats_section");
        // update graphic based on step
        d3.select("#year_mark").style("visibility","hidden");
        if(response.index === 0){
            container.selectAll("*").remove();
            container.append("div").attr("id", "prescription-stat");
            prescriptions(d3);
        }
        else if(response.index === 1){
            container.selectAll("*").remove();
            container.append("div").attr("id", "oneinfive");
            oneinfive(d3);
        }
        else if(response.index === 2){
            container.selectAll("*").remove();
            container.append("div").attr("id", "fourtypercent");
            fourtypercent(d3);
        }
        else if(response.index === 3){
            container.selectAll("*").remove();
            const states_others = container.append("div")
                .attr("id","other_stats_container")
                .attr("viewBox", "0 0 960 600")
                .style("width", "100%")
                .style("height", "100%");

            states_others.append("div").attr("id", "other_stats")
                .attr("width", "100%")
                .attr("height", "50%");
            states_others.append("div").attr("id", "other_stats_captions")
                .attr("width", "100%")
                .attr("height", "50%");
            other_stats(d3,0);
            other_stats_captions(d3,0);
        }
        else if(response.index === 4){
            container.selectAll("*").remove();
            const states_others = container.append("div")
                .attr("id","other_stats_container")
                .attr("viewBox", "0 0 960 600")
                .style("width", "100%")
                .style("height", "100%");

            states_others.append("div").attr("id", "other_stats")
                .attr("width", "100%")
                .attr("height", "50%");
            states_others.append("div").attr("id", "other_stats_captions")
                .attr("width", "100%")
                .attr("height", "50%");
            other_stats(d3,1);
            other_stats_captions(d3, 1);
        }
        else if(response.index === 5){
            container.selectAll("*").remove();
            const states_others = container.append("div")
                .attr("id","other_stats_container")
                .attr("viewBox", "0 0 960 600")
                .style("width", "100%")
                .style("height", "100%");

            states_others.append("div").attr("id", "other_stats")
                .attr("width", "100%")
                .attr("height", "50%");
            states_others.append("div").attr("id", "other_stats_captions")
                .attr("width", "100%")
                .attr("height", "50%");
            other_stats(d3,2);
            other_stats_captions(d3, 2);
        }
    }

    function init() {
        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();
        // 2. setup the scroller passing options
        // 		this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller_stat.setup({
            step: '#intro_scrollable .step',
            offset: 0.33,
            debug: false,
        })
            .onStepEnter(handleStepEnter);
        // setup resize event
        window.addEventListener('resize', handleResize);
    }
    // kick things off
    init();
};

export default intro_stats;