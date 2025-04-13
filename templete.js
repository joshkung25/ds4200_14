const crimeCounts = d3.csv("grouped_crime_data.csv");


crimeCounts.then(function(data) {
   // Convert string values to numbers
   data.forEach(function(d) {
        d.DATE = d.DATE;
        d.COUNT = +d.COUNT;
        d.CRIME_TYPE = d.OFFENSE_CODE_GROUP;  
   });


    // Extract unique crime types (excluding 'Select All')
   const crimeTypes = ["Select All", ...new Set(data.map(d => d.CRIME_TYPE))];


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
       .style('background', '#FFFFFF');


    let xScale = d3.scalePoint()
       .domain(data.map(d => d.DATE))
       .range([margin.left, width - margin.right])
       .padding(0.5);


       function drawPlot(filteredData) {
            // Clear previous plot
           svg.selectAll("*").remove(); 
      
           // Update yScale based on filteredData
           let yScale = d3.scaleLinear()
               .domain([0, d3.max(filteredData, d => d.COUNT)])
               .range([height - margin.bottom, margin.top]);
      
           // Draw the axis
           let xAxis = svg
            .append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale));
       
      
            xAxis
                .selectAll("text")
                .attr("transform", "rotate(-40)")
                .attr("x", -10)  
                .attr("y", 10)   
                .style("text-anchor", "end")
                .style("font-size", "8px");

      
           let yAxis = svg
               .append('g')
               .attr('transform', `translate(${margin.left},0)`)
               .call(d3.axisLeft().scale(yScale));
      
           // Add x-axis label
           xAxis
               .append('text')
               .attr('x', width / 2)
               .attr('y', 65)
               .style("fill", "black")
               .style("font-size", "13px")
               .text('Date');
      
           // Add y-axis label
           yAxis.append("text")
               .attr("transform", `translate(-50, ${height / 2}) rotate(-90)`)
               .attr("text-anchor", "middle")
               .style("fill", "black")
               .style("font-size", "13px")
               .text("Crime Count");
      
           // Draw the line and path with the filtered data
           let line = d3.line()
               .x(d => xScale(d.DATE))
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
           d => d.DATE
       );


       // Convert back to array of objects for plotting
       return Array.from(yearMap, ([DATE, COUNT]) => ({ DATE, COUNT }));
   }


   // Initial plot with all data
   drawPlot(aggregateByYear(data));


   // Dropdown event listener for crime type filter
   d3.select("#crimeFilter").on("change", function() {
       let selectedCrime = this.value;


       let filteredData = selectedCrime === "Select All"
           ? aggregateByYear(data)
           : data.filter(d => d.CRIME_TYPE === selectedCrime);
       // Redraw the plot with filtered data
       drawPlot(filteredData);
   });
});



