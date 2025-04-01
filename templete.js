// Load the data
// const socialMedia = d3.csv("socialMedia.csv");

// // Once the data is loaded, proceed with plotting
// socialMedia.then(function(data) {
//     // Convert string values to numbers
//     data.forEach(function(d) {
//         d.Likes = +d.Likes;
//     });

//     // Define the dimensions and margins for the SVG
//     const margin = {top: 20, right: 30, bottom: 40, left: 50};
//     const width = 600 - margin.left - margin.right;
//     const height = 400 - margin.top - margin.bottom;
    

//     // Create the SVG container
//     const svg = d3.select("#boxplot")
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`);
    

//     // Set up scales for x and y axes
//     // You can use the range 0 to 1000 for the number of Likes, or if you want, you can use
//     // d3.min(data, d => d.Likes) to achieve the min value and 
//     // d3.max(data, d => d.Likes) to achieve the max value
//     // For the domain of the xscale, you can list all four platforms or use
//     // [...new Set(data.map(d => d.Platform))] to achieve a unique list of the platform
//     const xScale = d3.scaleBand()
//         .domain([...new Set(data.map(d => d.Platform))])
//         .range([0, width])
//         .padding(0.1);

//     const yScale = d3.scaleLinear()
//         .domain([0, d3.max(data, d => d.Likes)])
//         .range([height, 0]);
//     // Add scales     
//     svg.append("g")
//         .attr("transform", `translate(0,${height})`)
//         .call(d3.axisBottom(xScale));

//     svg.append("g")
//         .call(d3.axisLeft(yScale));

//     // Add x-axis label
//     svg.append("text")  
//         .attr("x", width / 2)
//         .attr("y", height + margin.top + 20)
//         .style("text-anchor", "middle")
//         .text("Platform");

//     // Add y-axis label
//     svg.append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", -margin.left + 20)
//         .attr("x", -height / 2)
//         .style("text-anchor", "middle")
//         .text("Number of Likes");

//     const rollupFunction = function(groupData) {
//         const values = groupData.map(d => d.Likes).sort(d3.ascending);
//         const min = d3.min(values); 
//         const q1 = d3.quantile(values, 0.25);
//         const median = d3.quantile(values, 0.5);
//         const q3 = d3.quantile(values, 0.75);
//         const max = d3.max(values);
//         return {min, q1, median, q3, max};
//     };

//     const quantilesByGroups = d3.rollup(data, rollupFunction, d => d.Platform);

//     quantilesByGroups.forEach((quantiles, Platform) => {
//         const x = xScale(Platform);
//         const boxWidth = xScale.bandwidth();

//         // Draw vertical lines
//         svg.append("line")
//             .attr("x1", x + boxWidth / 2)  // Move to center of the box
//             .attr("x2", x + boxWidth / 2)
//             .attr("y1", yScale(quantiles.min))
//             .attr("y2", yScale(quantiles.max))
//             .attr("stroke", "black") 
//             .attr("stroke-width", 2);

//         // Draw box
//         svg.append("rect")
//             .attr("x", x)
//             .attr("y", yScale(quantiles.q3))
//             .attr("width", boxWidth)
//             .attr("height", yScale(quantiles.q1) - yScale(quantiles.q3))
//             .attr("fill", "lightgray")
//             .attr("stroke", "black");

//         // Draw median line
//         svg.append("line")
//             .attr("x1", x)
//             .attr("x2", x + boxWidth)
//             .attr("y1", yScale(quantiles.median))
//             .attr("y2", yScale(quantiles.median))
//             .attr("stroke", "black");
//     });
// });

// // Prepare you data and load the data again. 
// // This data should contains three columns, platform, post type and average number of likes. 
// const socialMediaAvg = d3.csv("socialMediaAvg.csv");

// socialMediaAvg.then(function(data) {
//     // Convert string values to numbers
//     data.forEach(d => {
//       d.Likes = +d.Likes;
//   });

//     // Define the dimensions and margins for the SVG
//     const margin = {top: 20, right: 60, bottom: 40, left: 50};
//     const width = 600 - margin.left - margin.right;
//     const height = 400 - margin.top - margin.bottom;

//     // Create the SVG container
//     const svg = d3.select("#barplot")
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`);

//     // Define four scales
//     // Scale x0 is for the platform, which divide the whole scale into 4 parts
//     // Scale x1 is for the post type, which divide each bandwidth of the previous x0 scale into three part for each post type
//     // Recommend to add more spaces for the y scale for the legend
//     // Also need a color scale for the post type

//     const x0 = d3.scaleBand()
//         .domain([...new Set(data.map(d => d.Platform))])
//         .range([0, width])
//         .padding(0.1);

//     const x1 = d3.scaleBand()
//         .domain([...new Set(data.map(d => d.PostType))])
//         .range([0, x0.bandwidth()])
//         .padding(0.05);

//     const y = d3.scaleLinear()
//         .domain([0, d3.max(data, d => d.Likes)])
//         .range([height, 0]);

//     const color = d3.scaleOrdinal()
//         .domain([...new Set(data.map(d => d.PostType))])
//         .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);    
         
//     // Add scales x0 and y     
//     svg.append("g")
//         .attr("transform", `translate(0,${height})`)
//         .call(d3.axisBottom(x0));

//     svg.append("g")
//         .call(d3.axisLeft(y));

//     // Add x-axis label
//     svg.append("text")
//         .attr("x", width / 2)
//         .attr("y", height + margin.top + 20)
//         .style("text-anchor", "middle")
//         .text("Platform");

//     // Add y-axis label
//     svg.append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", -margin.left + 20)
//         .attr("x", -height / 2)
//         .style("text-anchor", "middle")
//         .text("Average Number of Likes");


//   // Group container for bars
//     const barGroups = svg.selectAll("bar")
//       .data(data)
//       .enter()
//       .append("g")
//       .attr("transform", d => `translate(${x0(d.Platform)},0)`);

//   // Draw bars
//     barGroups.append("rect")
//     .attr("x", d => x1(d.PostType))
//     .attr("y", d => y(d.Likes))
//     .attr("width", x1.bandwidth())
//     .attr("height", d => height - y(d.Likes))
//     .attr("fill", d => color(d.PostType));
      

//     // Add the legend
//     const legend = svg.append("g")
//       .attr("transform", `translate(${width - 10}, ${margin.top})`);

//     const types = [...new Set(data.map(d => d.PostType))];
 
//     types.forEach((type, i) => {
//         // Add colored rectangle
//         legend.append("rect")
//             .attr("x", 0)
//             .attr("y", i * 20)
//             .attr("width", 15)
//             .attr("height", 15)
//             .attr("fill", color(type));  // Uses the corresponding color from the color scale
    
//         // Add text next to the rectangle
//         legend.append("text")
//             .attr("x", 20)
//             .attr("y", i * 20 + 12)
//             .text(type)
//             .attr("alignment-baseline", "middle");
//     });

// });

// Prepare you data and load the data again. 
// This data should contains two columns, date (3/1-3/7) and average number of likes. 

// const socialMediaTime = d3.csv("SocialMediaTime.csv");

// socialMediaTime.then(function(data) {
//     // Convert string values to numbers and parse dates
//     data.forEach(d => {
//         d.Likes = +d.Likes;
//         d.Date = d3.timeParse("%m/%d/%Y")(d.Date.split(" ")[0]); 
//     });

//     // Define the dimensions and margins for the SVG
//     const margin = { top: 20, right: 30, bottom: 50, left: 50 };
//     const width = 600 - margin.left - margin.right;
//     const height = 400 - margin.top - margin.bottom;

//     // Create the SVG container
//     const svg = d3.select("#lineplot")
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`);

//     // Set up scales for x and y axes
//     const xScale = d3.scaleTime()
//         .domain(d3.extent(data, d => d.Date))
//         .range([0, width]);

//     const yScale = d3.scaleLinear()
//         .domain([0, d3.max(data, d => d.Likes)])
//         .range([height, 0]);

//     // Draw the axes
//     svg.append("g")
//         .attr("transform", `translate(0,${height})`)
//         .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m/%d")))
//         .selectAll("text")
//         .style("text-anchor", "end")
//         .attr("dx", "-0.8em")
//         .attr("dy", "0.15em")
//         .attr("transform", "rotate(-45)");

//     svg.append("g")
//         .call(d3.axisLeft(yScale));

//     // Add x-axis label
//     svg.append("text")
//         .attr("x", width / 2)
//         .attr("y", height + margin.bottom - 10)
//         .style("text-anchor", "middle")
//         .text("Date");

//     // Add y-axis label
//     svg.append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", -margin.left + 20)
//         .attr("x", -height / 2)
//         .style("text-anchor", "middle")
//         .text("Average Number of Likes");

//     // Draw the line
//     const line = d3.line()
//         .x(d => xScale(d.Date))
//         .y(d => yScale(d.Likes))
//         .curve(d3.curveNatural);

//     svg.append("path")
//         .datum(data)
//         .attr("fill", "none")
//         .attr("stroke", "steelblue")
//         .attr("stroke-width", 2)
//         .attr("d", line);
// });
