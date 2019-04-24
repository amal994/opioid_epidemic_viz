import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css'
import map from './js/map';
import timeline from './js/timeline';
import logMessage from './js/client';
import comparative_chart from './js/comparative_chart';
import barchart from './js/barchart';
import attacking_problem_chart from './js/attacking_problem_chart';
import oneinfive from './js/oneinfive';
import fourtypercent from './js/fourtypercent';
import other_stats from './js/other_stats';
import other_stats_captions from './js/other_stats_captions';
import * as d3 from 'd3';

// Log message to console
logMessage('Its finished!!');

if (module.hot)       // eslint-disable-line no-undef
    module.hot.accept(); // eslint-disable-line no-undef

// client-side js
// run by the browser each time your view template is loaded
//This line loads the map into the page.
oneinfive(d3);
fourtypercent(d3);
other_stats(d3);
other_stats_captions(d3);
map(d3);
timeline();
comparative_chart(d3);
barchart(d3);
attacking_problem_chart(d3);

