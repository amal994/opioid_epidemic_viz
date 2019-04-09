import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css'
import map from './js/map';
import timeline from './js/timeline';
import logMessage from './js/client';
import comparative_chart from './js/comparative_chart';
import barchart from './js/barchart';
import attacking_problem_chart from './js/attacking_problem_chart';

// Log message to console
logMessage('Its finished!!');

if (module.hot)       // eslint-disable-line no-undef
    module.hot.accept(); // eslint-disable-line no-undef

// client-side js
// run by the browser each time your view template is loaded
//This line loads the map into the page.
map();
timeline();
comparative_chart();
barchart();
attacking_problem_chart();