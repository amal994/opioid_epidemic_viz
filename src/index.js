import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';
import "@babel/polyfill";
import * as d3 from 'd3';
import * as topojson from 'topojson';
import Stickyfill from "stickyfilljs";

import map from './js/map';
import logMessage from './js/client';
import comparative_chart from './js/comparative_chart';
import barchart from './js/barchart';
import attacking_problem_chart from './js/attacking_problem_chart';
import intro_stats from "./js/intro_stats";
import new_england_dashboard from "./js/new_england_dashboard";

import us_map from './data/10m.json';

// Log message to console
logMessage('Its finished!!');

if (module.hot)       // eslint-disable-line no-undef
    module.hot.accept(); // eslint-disable-line no-undef

// client-side js
// run by the browser each time your view template is loaded
//This line loads the map into the page.
intro_stats(d3);
map(d3, us_map, topojson);
new_england_dashboard(d3, us_map, topojson);
comparative_chart(d3);
barchart(d3);
attacking_problem_chart(d3);

function setupStickyfill() {
    d3.selectAll('.sticky').each(function () {
        Stickyfill.add(this);
    });
}

setupStickyfill();
