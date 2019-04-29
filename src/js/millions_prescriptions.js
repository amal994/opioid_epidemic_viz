
//Sources:
//https://bocoup.com/blog/smoothly-animate-thousands-of-points-with-html5-canvas-and-d3
const prescriptions = function(d3) {
    const svg = d3.select("#prescription-stat").append("svg")
        .attr("viewBox", "0 0 960 600")
        .style("width", "100%")
        .style("height", "auto");

    function gridLayout(points, pointWidth, gridWidth) {
        const pointHeight = pointWidth;
        const pointsPerRow = Math.floor(gridWidth / pointWidth);

        points.forEach((point, i) => {
            point.x = pointWidth * (i % pointsPerRow);
            point.y = pointHeight * Math.floor(i / pointsPerRow);
        });

        return points;
    }

    function beforeBottleLayout(points, pointWidth) {
        const pointHeight = pointWidth;
        const pointsPerRow = Math.floor(150 / (pointWidth-10));

        points.forEach((point, i) => {
            point.x = (pointWidth-10) * (i % pointsPerRow)+55;
            point.y = (pointHeight-15) * Math.floor(i / pointsPerRow)+100;
        });

        return points;
    }
    function bottleLayout(points, pointWidth) {
        const pointHeight = pointWidth;
        const pointsPerRow = Math.floor(150 / (pointWidth-10));

        points.forEach((point, i) => {
            point.x = (pointWidth-10) * (i % pointsPerRow)+55;
            point.y = (pointHeight-15) * Math.floor(i / pointsPerRow)+350;
        });

        return points;
    }
    //create the points with initial layout
    function createPoints(numPoints, pointWidth, width) {

        const points = d3.range(numPoints).map(id => ({
            id,
            color: "white",
        }));

        return gridLayout(points, pointWidth, width);
    }

    // draw the points based on their current layout
    function draw() {
        pills.selectAll("circle").remove();
        pills.selectAll("circle")
            .data(points)
            .enter()
            .append("circle")
            .attr("cx", d => {return d.x;})
            .attr("cy", d => {return d.y;})
            .attr("r", 8)
            .style("fill", d=>{return d.color;});
    }

    function draw_medicine_bottle(k) {
        const medicine_bottle = svg.append("g")
            .attr("id","medicine_bottle")
            .attr("transform", "translate("+(-k*10)+","+(k*60)+") rotate("+0+")");
        medicine_bottle.append("rect")
            .attr("x", 25*k)
            .attr("y", 50*k)
            .attr("width",50*k)
            .attr("height",10*k)
            .style("fill", "white");

        medicine_bottle.append("ellipse")
            .attr("cx", 50*k)
            .attr("cy", 50*k)
            .attr("rx", 25*k)
            .attr("ry", 10*k)
            .style("fill", "white");
    //Orange bottle
        medicine_bottle.append("ellipse")
            .attr("cx", 50*k)
            .attr("cy", 60*k)
            .attr("rx", 25*k)
            .attr("ry", 10*k)
            .style("fill", "orange");

        medicine_bottle.append("rect")
            .attr("x", 25*k)
            .attr("y", 60*k)
            .attr("width",50*k)
            .attr("height",70*k)
            .style("fill", "orange");

        medicine_bottle.append("ellipse")
            .attr("cx", 50*k)
            .attr("cy", 130*k)
            .attr("rx", 25*k)
            .attr("ry", 10*k)
            .style("fill", "orange");
    // Bottle Label
        medicine_bottle.append("ellipse")
            .attr("cx", 50*k)
            .attr("cy", 80*k)
            .attr("rx", 20*k)
            .attr("ry", 5*k)
            .style("fill", "white");

        medicine_bottle.append("rect")
            .attr("x", 30*k)
            .attr("y", 80*k)
            .attr("width",40*k)
            .attr("height",40*k)
            .style("fill", "white");

        medicine_bottle.append("ellipse")
            .attr("cx", 50*k)
            .attr("cy", 120*k)
            .attr("rx", 20*k)
            .attr("ry", 5*k)
            .style("fill", "white");

        medicine_bottle.append("text")
            .attr("x",35*k)
            .attr("y",100*k)
            .text("Rx")
            .style("fill", "black")
            .style("font-size",(20*k)+"px");

        medicine_bottle.append("text")
            .attr("x",35*k)
            .attr("y",110*k)
            .text("Opioid")
            .style("fill", "black")
            .style("font-size",(10*k)+"px")
    }

    const pills = svg.append("g")
        .attr("transform", "translate("+(0)+","+(10)+") rotate("+0+")")
        .attr("id", "pills");
    const pointWidth = 20;
    const pointMargin = 3;
    const width = 1000;
    // generate the array of points with a unique ID and color
    const points = createPoints(214,pointWidth + pointMargin, width);
    draw();
    draw_medicine_bottle(3);

    // wrap layout helpers so they only take points as an argument
    const toGrid = (points) => gridLayout(points,
        pointWidth + pointMargin, width);
    const toBeforeBottle = (points) => beforeBottleLayout(points,
        pointWidth + pointMargin);
    const toBottle = (points) => bottleLayout(points,
        pointWidth + pointMargin);

    let layouts = [toGrid, toBeforeBottle, toBottle];
    let currLayout = 0;
    const ease = d3.easeCubic;
    const duration = 1500;

    // animate the points to a given layout
    function animate(layout) {
        // store the source position
        points.forEach(point => {
            point.sx = point.x;
            point.sy = point.y;
        });

        // get destination x and y position on each point
        layout(points);

        // store the destination position
        points.forEach(point => {
            point.tx = point.x;
            point.ty = point.y;
        });

        const timer = d3.timer((elapsed) => {
            // compute how far through the animation we are (0 to 1)
            const t = Math.min(1, ease(elapsed / duration));

            // update point positions (interpolate between source and target)
            points.forEach(point => {
                point.x = point.sx * (1 - t) + point.tx * t;
                point.y = point.sy * (1 - t) + point.ty * t;
            });

            // update what is drawn on screen
            draw();

            // if this animation is over
            if (t < 1 && t > 0.9) {
                // update to use next layout
                currLayout = (currLayout + 1);
                if (currLayout < layouts.length){
                    // start animation for next layout
                    animate(layouts[currLayout]);
                }
            }
            if (t === 1) {
                // stop this timer for this layout and start a new one
                timer.stop();
                if(currLayout === 1){
                    pills.selectAll("circle").remove();
                }
            }
        });
    }
    animate(toBeforeBottle);
};

export default prescriptions;