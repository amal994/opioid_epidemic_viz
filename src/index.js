import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';
import "@babel/polyfill";
import * as d3 from 'd3';
import map from './js/map';
import timeline from './js/timeline';
import logMessage from './js/client';
import comparative_chart from './js/comparative_chart';
import barchart from './js/barchart';
import attacking_problem_chart from './js/attacking_problem_chart';

import other_stats from './js/other_stats';
import other_stats_captions from './js/other_stats_captions';
import new_england_map from "./js/new_england_map";
import intro_stats from "./js/intro_stats";
import Stickyfill from "stickyfilljs";

// Log message to console
logMessage('Its finished!!');

if (module.hot)       // eslint-disable-line no-undef
    module.hot.accept(); // eslint-disable-line no-undef

// client-side js
// run by the browser each time your view template is loaded
//This line loads the map into the page.
intro_stats(d3);
map(d3);
timeline();
new_england_map(d3);
comparative_chart(d3);
barchart(d3);
attacking_problem_chart(d3);

function setupStickyfill() {
    d3.selectAll('.sticky').each(function () {
        Stickyfill.add(this);
    });
}

setupStickyfill();
