// Data Visualization Script

// Set the margin and padding of the SVG
const margin = { top: 50, right: 50, bottom: 50, left: 50 }
const padding = 50

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
  const categories = d3.set(root.leaves(), d => d.data.category).values()
  console.log(`categories: ${categories}`)
  // Title
  const title = d3.select('#title')
    .append('h2')
    .text(`${movieData.name} Treemap`)

  // Description
  const description = d3.select('#description')
    .append('h4')
    .text(`Top 100 Highest Grossing Movies Grouped By Genre`)
    .attr('id', 'description')

  // Tooltip  
  const tooltip = d3.select('#chart').append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)

  // Color Scale
  console.log(`d3.schemeCategory10`, d3.schemeCategory10)
  const palette = d3.schemeCategory10.slice(0, root.children.length)
  console.log(`palette: `, palette)
  const color = d3.scaleOrdinal(palette)

  // Legend
  // Code adopted from HIC https://codepen.io/HIC/full/bxzpRR/
  const legend = d3.select("#legend")
    .append("svg")
    .attr('width', width)

  const legendKey = legend.append('g')
    .attr(`tranform`, `translate(60, ${padding/10})`)
    .selectAll("g")
    .data(categories)
    .enter()
    .append('g')
    .attr(`transform`, (d, i) => `translate(${(i % 3)* padding * 3},
    ${Math.floor(i / 3) * padding + Math.floor(i / 3)})`)

    legendKey.append("rect")
    .attr('class', 'legend-item')
    .attr("width", padding/2)
    .attr("height", padding/2)
    .attr("fill", d => color(d))
    .attr("stroke", "#fff")

    legendKey.append('text')
    .attr('x', (padding/ 2)+5)
    .attr('y', padding / 3)
    .text(d => d)  

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