// Data Visualization Script

// Set the margin and padding of the SVG
const margin = { top: 50, right: 20, bottom: 50, left: 100 }
const padding = 60

// Set the width and height using the current width and height of the div
const width = 500
const height = 500

// Color Scale
const color = d3.scaleOrdinal(d3.schemeCategory10)
console.log(color)

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

  const root = d3.hierarchy(movieData, d => d.childred)
    .sum(d => d.size)

  treemap(root)  
  console.log(`root`, root)
  const node = svg.selectAll('.node')
    .data(root.leaves())
    .enter().append('g')
    .attr('class', 'node')
    .attr(`transform`, `translate(${width / 2}, ${padding / 0.75})`)

  node.append('rect')
    .attr('x', d => d.x0)
    .attr('y', d=> d.y0)
    .attr('width', d => d.x1 ? d.x1 : null)
    .attr('height', d => d.y1 ? d.y1 : null)
    // .attr('fill', d => d.children ? null: color(d.name))
    .attr('fill', d => color(d.data.name))
    .attr('stroke', '#fff')
  node.append('text')
    .attr('class', 'data-label')
    .attr('x', d => (d.x0 + d.x1)/2)
    .attr('y', d => (d.y0+ d.y1)/2)
    .text(d => d.data.name)

  
}
chart()