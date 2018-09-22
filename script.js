// Data Visualization Script

// Set the margin and padding of the SVG
const margin = { top: 50, right: 50, bottom: 50, left: 50 }
const padding = 60

// Set the width and height using the current width and height of the div
const width = 991
const height = 743

// Create svg and append to chart div
const svg = d3.select('#chart')
  .append('svg')
  .attr('class', 'graph')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)

// Create treemap container
const treemap = d3.treemap().size([width, height])

// Title
svg.append('text')
  .text('My Treemap (Working Title)')
  .attr('id', 'title')
  .attr(`transform`, `translate(${width / 2}, ${padding / 2})`)

// Description
svg.append('text')
  .text(`Top XX Most XX Grouped by XX`)
  .attr('id', 'description')
  .attr(`transform`, `translate(${width / 2}, ${padding / 1})`)

// Tooltip  
const tooltip = d3.select('#chart').append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0)

// Get Data
const movieURL = ' https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json'
const chart = async () => {
  let getMovieData = await fetch(movieURL)
  let movieData = await getMovieData.json()
  console.log(`movieData: `, movieData)

  const root = d3.hierarchy(movieData)
    .eachBefore(d => d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name)
    .sum(d => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value)

  treemap(root)  
  console.log(`root`, root)
  console.log(`d3.set(root.leaves(), d => d.data.category)`, d3.set(root.leaves(), d => d.data.category).values())
  console.log(`root.children.length `, root.children.length)

  // Color Scale
  console.log(`d3.schemeCategory10`, d3.schemeCategory10)
  const palette = d3.schemeCategory10.slice(0, root.children.length)
  console.log(`palette: `, palette)
  const color = d3.scaleOrdinal(palette)
 
  // Legend scale
  const ordinal = d3.scaleOrdinal()
    .domain(d3.set(root.leaves(), d => d.data.category).values())
    .range(palette)

  // Legend (using d3 SVG Legend (v4) library)
  // const legendOrdinal = d3.legendColor()
  //   .orient('horizontal')
  //   .shapePadding(padding)
  //   .scale(ordinal) 

  // svg.append("g")
  //   .attr("class", "legendOrdinal")
  //   .attr('id', 'legend')
  //   .attr('transform', `translate(${0}, ${height + margin.top + 20})`)

  // svg.select(".legendOrdinal")
  //   .attr('class', 'legend-item')
  //   .call(legendOrdinal)

  // // Legend (manual version)
  // const legend = svg.append('g')
  //   .attr('id', 'legend')

  // // Add the color map
  // legend.selectAll("rect")
  //   .data(palette)
  //   .enter()
  //   .append('rect')
  //   .attr('class', 'legend-item')
  //   .attr("width", (width - padding) / palette.length)
  //   .attr("height", 20)
  //   .attr('x', (d, i) => i * ((width - padding) / palette.length))
  //   .attr('y', height + 20)
  //   .style("fill", (d) => d)

  // legend.append('g')
  //   .attr('transform', `translate(0, ${height + 45})`)
  //   // .attr('transform', `translate(${padding}, ${height + margin.top + 20})`)
  //   .call(d3.axisBottom(ordinal))


  // Treemap
  const node = svg.selectAll('g')
    .data(root.leaves())
    .enter().append('g')
    .attr(`transform`, d => `translate(${d.x0}, ${d.y0})`)

  node.append('rect')
    .attr('class', 'tile')
    .attr('data-name', d => d.data.name)
    .attr('data-category', d => d.data.category)
    .attr('data-value', d => d.data.value)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('fill', d => color(d.data.category))
    .attr('stroke', '#fff')
    .on('mouseover', (d) => {
      tooltip.transition().duration(200).style('opacity', 0.9)
      tooltip.html(
        `<p>Name:${d.data.name}<br>
          Category:${d.data.category}<br>
          Value:${d.data.value}
        </p>`)
        .attr('data-value', d.data.value)
        .style('left', `${d3.event.layerX}px`)
        .style('top', `${d3.event.layerY - 28}px`)
    })
    .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0)) 

  // Node labels
  // Code adopted from HIC https://codepen.io/HIC/full/bxzpRR/
  node.append('text')
    .selectAll('tspan')
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append('tspan')
    .attr('x', 4)
    .attr('y', (d, i) => 13 + 10 * i)
    .text(d => d)

  
}
chart()