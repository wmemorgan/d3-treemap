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

// Dataset menu behavior
const dataSetList = document.getElementsByClassName('data-set')

// const removeShowClass = () => {
//   if (document.querySelector('.show')) {
//     document.querySelector('.show').classList.remove('show')
//   }
// }

const addShowClass = (i) => {
  if (document.querySelector('.show')) {
    document.querySelector('.show').classList.remove('show')
  }
  dataSetList[i].classList.add('show')
}

const selectData = async (url, str) => {
  // return () => {
    let getData = await fetch(url)
    let data = await getData.json()
    console.log(`data: `, data)

    // Chart Description
    const description = await d3.select('#description')
      .append('h4')
      .text(str)
      .attr('id', 'description')

    return data
  // }
}

// Get Data
const movieURL = ' https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json'
const videoGameURL = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json'
const kickStarterURL = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json'
const chart = async (url = movieURL, str ="Top 100 Highest Grossing Movies Grouped By Genre") => {
  let dataset = await selectData(url, str)
  const root = d3.hierarchy(dataset)
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
    .text(`${dataset.name} Treemap`)

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
    .attr(`transform`, d => `translate(${d.x0+50}, ${d.y0})`)

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


const clearChart = () => {
  document.getElementById('title').innerHTML = ''
  document.getElementById('description').innerHTML = ''
  document.getElementById('legend').innerHTML = ''
  d3.selectAll('svg > *').remove()

}

const switchData = (i) => {
  return () => {
    clearChart()
    let elemID = document.getElementsByClassName("data-set")[i].id
    addShowClass(i)
    switch (elemID) {
      case 'movies':
        chart(movieURL, "Top 100 Highest Grossing Movies Grouped By Genre")
        break
      case 'videogames':
        chart(videoGameURL, "Top 100 Most Sold Video Games Grouped by Platform")
        break
      case 'kickstarter':
        chart(kickStarterURL, "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category")
        break
      default:
        chart()
    }
  }
}

for (let i = 0; i < dataSetList.length; i++) {
  dataSetList[i].addEventListener('click', switchData(i))
  console.log('add event listener to item: ', dataSetList[i])
}