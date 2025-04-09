const crimeCounts = d3.csv("crime_counts_by_year.csv");


crimeCounts.then(function(data) {
   // Convert string values to numbers
   data.forEach(function(d) {
       d.YEAR = +d.YEAR;
       d.COUNT = +d.COUNT;
       // Ensure that crime type is a string or category
       d.CRIME_TYPE = d.OFFENSE_CODE_GROUP || "Unknown";  // Set default value if missing
   });


       // Extract unique crime types (excluding 'all')
   const crimeTypes = ["all", ...new Set(data.map(d => d.CRIME_TYPE))];


       // Populate the dropdown menu with unique crime types
   const crimeFilter = d3.select("#crimeFilter");
   crimeTypes.forEach(function(crime) {
           crimeFilter.append("option")
               .attr("value", crime)
               .text(crime);
       });


   // Define the dimensions and margins for the SVG
   let width = 600,
       height = 400;


   let margin = {
       top: 40,
       bottom: 80,
       left: 60,
       right: 40
   };


   // Create the SVG container
   let svg = d3
       .select('#lineplot')
       .append('svg')
       .attr('width', width)
       .attr('height', height)
       .style('background', '#e9f7f2');




   let xScale = d3.scaleLinear()  // Using scaleLinear for continuous x-axis values (years)
       .domain([d3.min(data, d => d.YEAR), d3.max(data, d => d.YEAR)])
       .range([margin.left, width - margin.right]);


       function drawPlot(filteredData) {
           svg.selectAll("*").remove(); // Clear previous plot
      
           // Update yScale based on filteredData
           let yScale = d3.scaleLinear()
               .domain([0, d3.max(filteredData, d => d.COUNT)])
               .range([height - margin.bottom, margin.top]);
      
           // Draw the axis
           let xAxis = svg
               .append('g')
               .attr('transform', `translate(0,${height - margin.bottom})`)
               .call(d3.axisBottom().scale(xScale));
      
           xAxis
               .selectAll("text")
               .attr("transform", "rotate(-25)")
               .style("text-anchor", "end");
      
           let yAxis = svg
               .append('g')
               .attr('transform', `translate(${margin.left},0)`)
               .call(d3.axisLeft().scale(yScale));
      
           // Add x-axis label
           xAxis
               .append('text')
               .attr('x', width / 2)
               .attr('y', 50)
               .style("fill", "black")
               .style("font-size", "13px")
               .text('Year');
      
           // Add y-axis label
           yAxis.append("text")
               .attr("transform", `translate(-40, ${height / 2}) rotate(-90)`)
               .attr("text-anchor", "middle")
               .style("fill", "black")
               .style("font-size", "13px")
               .text("Crime Count");
      
           // Draw the line and path with the filtered data
           let line = d3.line()
               .x(d => xScale(d.YEAR))
               .y(d => yScale(d.COUNT))
               .curve(d3.curveNatural);
      
           svg.append("path")
               .datum(filteredData)
               .attr("d", line)
               .attr("fill", "none")
               .attr("stroke", "black")
               .attr("stroke-width", 2);
      
           svg.append("text")
               .attr("x", width / 2)
               .attr("y", margin.top / 2)
               .attr("text-anchor", "middle")
               .style("fill", "black")
               .style("font-size", "18px")
               .text("Crime Counts Over Time");
       }
      


   function aggregateByYear(data) {
       // d3.rollup groups and sums values
       const yearMap = d3.rollup(
           data,
           v => d3.sum(v, d => d.COUNT),
           d => d.YEAR
       );


       // Convert back to array of objects for plotting
       return Array.from(yearMap, ([YEAR, COUNT]) => ({ YEAR, COUNT }));
   }


   // Initial plot with all data
   drawPlot(aggregateByYear(data));


   // Dropdown event listener for crime type filter
   d3.select("#crimeFilter").on("change", function() {
       let selectedCrime = this.value;


       let filteredData = selectedCrime === "all"
           ? aggregateByYear(data)
           : data.filter(d => d.CRIME_TYPE === selectedCrime);
       // Redraw the plot with filtered data
       drawPlot(filteredData);
   });
});



