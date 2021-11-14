export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["API_SP.POP.TOTL_DS2_en_csv_v2_2106202@1.csv",new URL("./files/6390a3b32124a481a4f0b6311935de04e12b5d12bdb387d967ba4ea5b07d16e66bbd1b2438318e63f2d5535a5165b062d88a4470b6ac357eb5e0d3113d677273",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Interactive map to visualize world population data (Tutorial)`
)});
  main.variable(observer("map")).define("map", ["svg"], function(svg){return(
svg.node()
)});
  main.variable(observer("button")).define("button", ["buttn"], function(buttn){return(
buttn.node()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Some context
I recently had a school project where I had to display a choropleth map, and I also had to make it interactive. This is an informative notebook that will show how I did it! Any comment about this notebook is welcomed as it is the first one I posted here.


The different interactions possible are the following:  
- highlighting of the countries when the mouse is over it,
- zooming via scrolling,
- navigation with the mouse (hold click and move),
- selection of countries with a click (click multiple countries to see what I mean!),
- removing the selection with a button click (below the map),
- a tooltip displaying more details about the data.

This notebook is using **d3** and **topojson**.

You can play a little bit with the map to see what functionnalities there are, then we will jump right into how I did it.
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Defining variables

You can change the *currentYear* variable to display data from other years. There are population data from 1960 all the way up to 2019.`
)});
  main.variable(observer("currentYear")).define("currentYear", function(){return(
2010
)});
  main.variable(observer("height")).define("height", ["width"], function(width){return(
width * 0.7
)});
  main.variable(observer()).define(["md"], function(md){return(
md`We define the minimum and maximum value of the population of the map with regards to the variable *currentYear* (if you want more details, the way data is formatted is specified in the Appendix at the end of the notebook).`
)});
  main.variable(observer("minValue")).define("minValue", ["data","currentYear"], function(data,currentYear)
{
  let minVal = 100000000000;
  data.forEach(value => {
    if (value[currentYear] === 0) return;
    minVal = Math.min(minVal, value[currentYear])
  })
  return minVal;   
}
);
  main.variable(observer("maxValue")).define("maxValue", ["data","currentYear"], function(data,currentYear)
{
  let maxVal = 0;
  data.forEach(value => {
    if (value[currentYear] === 0) return;
    maxVal = Math.max(maxVal, value[currentYear])
  })
  return maxVal;   
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Creating the svg

The svg is created here. There are 2 **g** layers that represents the 2 different entities we will display :  

- the countries and their boundaries,
- the selected countries  

we give to each one its own class name.`
)});
  main.variable(observer("svg")).define("svg", ["d3","width","height"], function(d3,width,height){return(
d3
      .create('svg')
      .style('width', width)
      .style('height', height)
)});
  main.variable(observer("selectedLayer")).define("selectedLayer", ["svg"], function(svg){return(
svg.append('g').attr('class', 'selected-countries')
)});
  main.variable(observer("layer")).define("layer", ["svg"], function(svg){return(
svg.append('g').attr('class', 'counties')
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Using topojson

The "feature" function is used to convert our topojson to geojson.  
The "mesh" function is used to get the countries boundaries, it is useful to display each boundary only once.
`
)});
  main.variable(observer("countries")).define("countries", ["topojson","world"], function(topojson,world){return(
topojson.feature(world, world.objects.countries).features
)});
  main.variable(observer("boundaries")).define("boundaries", ["topojson","world"], function(topojson,world){return(
topojson.mesh(world,world.objects.countries, (a, b) => a !== b)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Creating the color scale  

Here we create the color scale that the map will be using to display the data. In this map, the more red a country is, the more population it holds.`
)});
  main.variable(observer("paletteScale")).define("paletteScale", ["d3","minValue","maxValue"], function(d3,minValue,maxValue){return(
d3
    .scaleLinear()
    .domain([minValue, maxValue])
    .range(['#EFEFFF', '#CF4646'])
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Aggregating the data

Here I take the geojson that was created above and change the properties of each country to hold the data I want displayed. This is done by using map and adding some properties. Here the properties that are important are the fill color of the country, the total population of the country, the name of the country and the current year that is considered.`
)});
  main.variable(observer("geoData")).define("geoData", ["countries","data","currentYear","paletteScale"], function(countries,data,currentYear,paletteScale){return(
countries.map(country => {
  const totalPopulationAllYears = data.get(country.id);
  const totalPopulationCurrentYear = totalPopulationAllYears === undefined ? 0 : totalPopulationAllYears[currentYear];
  return {
    ...country,
    properties: {
      totalPopulation: totalPopulationCurrentYear,
      fillColor: paletteScale(totalPopulationCurrentYear),
      name: totalPopulationAllYears === undefined ? "" : totalPopulationAllYears['Country Name'],
      currentYear,
    },
  }
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Setting up the projection, path, and zoom

I chose the mercator projection (being from France, this is the natural one for me) and I centered it on France. The scale was adapted so that the map would be confortable to look at on a computer screen.  
Then we use this projection to create a path.  
Finally we set up the zoom for the 2 layers, and use the call method on the svg element (where we want the zoom behaviour).`
)});
  main.variable(observer("projection")).define("projection", ["d3","width","height"], function(d3,width,height){return(
d3
      .geoMercator()
      .center([4.8357, 45.764]) // this is centered on France
      .scale(200)
      .translate([width / 2, height / 2])
)});
  main.variable(observer("path")).define("path", ["d3","projection"], function(d3,projection){return(
d3.geoPath().projection(projection)
)});
  main.variable(observer("zoom")).define("zoom", ["layer","selectedLayer","d3"], function(layer,selectedLayer,d3)
{
  const zoomed = ({ transform }) => {
    layer.attr('transform', transform);
    
    selectedLayer.attr('transform', transform);
  };
  return d3.zoom().scaleExtent([0.5, 40]).on('zoom', zoomed);
}
);
  main.variable(observer()).define(["svg","zoom"], function(svg,zoom){return(
svg.call(zoom)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Displaying the map  
In this section, the *geoData* are bound to path elements that are then appended to a **g** layer. We then add a class name with the class 'country' and the id of each country. We set the **d** attribute to path.  
Finally we set the fill color of each country to be the one that is in the properties of the datum associated, and we set the stroke to none because we will display the borders separately. 
If you want to learn more about *selection.join*, the tutorial is [here](https://observablehq.com/@d3/selection-join).`
)});
  main.variable(observer("countriesSelection")).define("countriesSelection", ["layer","geoData","path"], function(layer,geoData,path)
{
  layer
    .selectAll('path')
    .data(geoData, (d) => d.id)
    .join(
      enter => {
        enter
          .append('path')
          .attr('class', (d) => `country ${d.id}`)
          .attr('d', path)
          .style('fill', (d) => d.properties.fillColor)
          .style('stroke', 'none');
      },
      () => {},
      exit => {
        exit
          .remove();
      },
    );
  return layer.selectAll('.country');
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`Here we display the borders of the countries. We proceed this way so that each border is displayed only **once**. If we did not do that, each border would have been displayed once per country, and there would be some borders that would appear wider.  

NB: Since I want the boundaries to be displayed after the countries, I added a 'dependency' to *countriesSelection* in this cell.`
)});
  main.variable(observer("boundariesLayer")).define("boundariesLayer", ["countriesSelection","layer","boundaries","path"], function(countriesSelection,layer,boundaries,path)
{
  countriesSelection
  layer
    .selectAll('.country-boundary')
    .data([boundaries])
    .join(
      enter => {
        enter
          .append('path')
          .attr('d', path)
          .attr('class', 'country-boundary')
          .style('stroke', 'black')
          .style('stroke-width', 1)
          .style('stroke-opacity', 0.3)
          .style('fill', 'none');
      },
      () => {},
      exit => {
        exit.remove()
      }
     );
  return layer.selectAll('.country-boundary');
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Creating the tooltip  
Here we create the tooltip used to display more data on each country. We simply append a div element to the body and give it the *hover-info* class, and set its visibility to hidden.`
)});
  main.variable(observer("tooltipSelection")).define("tooltipSelection", ["d3"], function(d3){return(
d3.select('body')
      .append('div')
      .attr('class', 'hover-info')
      .style('visibility', 'hidden')
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Event listeners are needed to display the tooltip. The behaviour I want is the following : 
 - The tooltip is displayed just under the cursor when the cursor is over a country and follows the cursor wherever it goes.
 - The tooltip is hidden when the cursor is not over a country.  

We also add in these event listeners some transitions. If the cursor is above a country, it will be highlighted and there will be a smooth transition between the 2 colors.

To display the tooltip under the cursor, 'pageX' and 'pageY' are used. These are event properties that we use to style our tooltip. The tooltip's position is set to absolute and is updated everytime a mousemove event is detected. This provides the behaviour I wanted.

Also I added a little triangle on the tooltip to make it appear prettier, but this is not really important in my opinion.
`
)});
  main.variable(observer("tooltipEventListeners")).define("tooltipEventListeners", ["countriesSelection","tooltipSelection","d3"], function(countriesSelection,tooltipSelection,d3){return(
countriesSelection
  .on('mouseenter', ({ target }) => {
  tooltipSelection.style('visibility', 'visible');

  d3.select(target)
    .transition()
    .duration(150)
    .ease(d3.easeCubic)
    .style('fill', '#ffba08');
})
  .on('mousemove', ({ pageX, pageY, target }) => {

    tooltipSelection
      .style('top', `${pageY + 20}px`)
      .style('left', `${pageX - 10}px`)
      .style('z-index', 100)
      .html(
      `<strong>${
      target.__data__.properties.name
      }</strong><br>Total population (${target.__data__.properties.currentYear}): <strong>${
      target.__data__.properties.totalPopulation
      }</strong>`,
    )
      .append('div')
      .attr('class', 'triangle');

  d3.selectAll('.triangle').style('top', `${-Math.sqrt(20) - 3}px`);
})
  .on('mouseleave', (e) => {
  tooltipSelection.style('visibility', 'hidden');

  d3.select(e.target)
    .transition()
    .duration(150)
    .ease(d3.easeCubic)
    .style('fill', (d) => d.properties.fillColor);
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Setting up the selection button  

Here we just create a button and give the 'Reinitialize Selection' text. This will be used later.`
)});
  main.variable(observer("buttn")).define("buttn", ["d3"], function(d3){return(
d3.create('button').html('<h3>Reinitialize Selection</h3>')
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Creating a reactive Set of selected countries  

The behaviour I want here is the following: 
 - When I click on a unselected country, I add it to the set of selected countries.
 - When I click on the *Reinitialize selection* button, the selection is reinitialized to be empty.

This part was tricky. 
Since I need the *selectedCountriesSet* variable below to change with click events, I used **Generators**. Everything is very well explained on the [tutorial page](https://observablehq.com/@observablehq/introduction-to-generators) about them, so I will not go into too much details.  
I defined the *on click* events here and changed the set of selected countries at each click event accordingly.`
)});
  main.variable(observer("selectedCountriesSet")).define("selectedCountriesSet", ["countriesSelection","Generators","svg","buttn"], function(countriesSelection,Generators,svg,buttn)
{
  countriesSelection
  return Generators.observe(next => {
    
    let selectedSet = new Set()
    // Yield the initial value.
    next(selectedSet);
    
    // Define event listeners to yield the next values
    svg.selectAll('.country')
     .on('click', null)
     .on('click', ({ target }) => {
       selectedSet.add(target.__data__.id);
       next(selectedSet)
    });
    
    // Define the event listener of the button
    buttn.on('click', () => {
      selectedSet = new Set();
      next(selectedSet);
    });
    
    // When the generator is disposed, detach the event listener.
    return () => svg.selectAll('.country').on('click', null);
  });
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`The *geoData* variable is filtered to only keep the countries that are in the *selectedCountriesSet* variable. `
)});
  main.variable(observer("selectedCountries")).define("selectedCountries", ["geoData","selectedCountriesSet"], function(geoData,selectedCountriesSet){return(
geoData.filter((country) => selectedCountriesSet.has(country.id))
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Then *selectedCountries* is reduced to keep the total population of the selection. This will be used to display the total population of the selection on the map.`
)});
  main.variable(observer("totalPopulationSelection")).define("totalPopulationSelection", ["selectedCountries"], function(selectedCountries){return(
selectedCountries.reduce((acc, country) => acc + country.properties.totalPopulation, 0)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`*selectedCountries* is mapped over to construct another variable: *geo*. It will be used to display the selected countries on the map.`
)});
  main.variable(observer("geo")).define("geo", ["selectedCountries","totalPopulationSelection"], function(selectedCountries,totalPopulationSelection){return(
selectedCountries.map(country => {
  const newCountry = {
    ...country,
    properties: {
      ...country.properties,
      totalPopulation: totalPopulationSelection,
      name: `${country.properties.name} (Selected)`,
    }
  };
  return newCountry;
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Displaying and animating the selected countries
First, we define a *getTransition* function to create the transitions needed when we select countries. It will be used in the next cell.`
)});
  main.variable(observer("t")).define("t", ["d3"], function(d3){return(
function getTransition() {
    return d3.transition().duration(250).ease(d3.easeCubic);
  }
)});
  main.variable(observer()).define(["md"], function(md){return(
md`There, we use **selection.join** to update the DOM as the data changes. Everything about *selection.join* is really well explained [here](https://observablehq.com/@d3/selection-join). There is nothing particular going on in this notebook that is not explained in the page I linked so I will not go into too much details. 

Thanks to *selection.join* path elements are appended or removed according to the selected countries. The right styles and classes are set to make the animation smoother. 
We use a transition to make the experience smoother for the user when a country is clicked. 
`
)});
  main.variable(observer("changeSelectedLayer")).define("changeSelectedLayer", ["t","selectedLayer","geo","path"], function(t,selectedLayer,geo,path)
{
  const currentTransition = t();
  selectedLayer
    .selectAll('path')
      .data(geo, (d) => d.id)
      .join(
        (enter) => {
          enter
            .append('path')
            .attr('class', (d) => `selected-country ${d.id}`)
            .attr('d', path)
            .style('fill', '#ffba08')
            .style('fill', '#f4a261')
            .style('stroke', 'black')
            .style('stroke-width', 1)
            .style('stroke-opacity', 0.3)
            .call((en) =>
              en
                .transition(currentTransition)
                .style('fill', '#f4a261')
                .style('stroke-opacity', 0.1),
            );
        },
        () => {},
        (exit) => {
          exit.style('fill', '#f4a261').call((ex) =>
            ex
              .transition(currentTransition)
              .style('fill', (d) => d.properties.fillColor)
              .remove(),
          );
        },
      );
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`Finally we set up event listeners on the selected countries to display the tooltip. It is almost the same code as the one to display tooltips on the countries. Only the html inside the tooltip was changed to display *(Selected)* on selected countries.`
)});
  main.variable(observer()).define(["changeSelectedLayer","selectedLayer","tooltipSelection","d3"], function(changeSelectedLayer,selectedLayer,tooltipSelection,d3)
{
  changeSelectedLayer
  selectedLayer
      .on('mouseenter', ({ target }) => {
        tooltipSelection.style('visibility', 'visible');

        d3.select(target).style('fill', '#ffba08');
      })
      .on('mousemove', ({ pageX, pageY, target }) => {
        const x = pageX;
        const y = pageY;

        tooltipSelection
          .html(
            `<strong>${
            target.__data__.properties.name
            }</strong><br>Total population of the selection (${target.__data__.properties.currentYear}):                   <strong>${target.__data__.properties.totalPopulation}</strong>`,
          )
          .style('top', `${y + 20}px`)
          .style('left', `${x - 10}px`)

        d3.selectAll('.triangle').style('top', `${-Math.sqrt(20) - 3}px`);
      })
      .on('mouseleave', ({ target }) => {
        tooltipSelection.style('visibility', 'hidden');

        d3.select(target).style('fill', '#f4a261');
      });
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`### Et voilà! We now have an interactive map that displays population data!`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Appendix`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Imports`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@6')
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require('topojson-client@3')
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Data fetching`
)});
  main.variable(observer("world")).define("world", ["d3"], function(d3){return(
d3.json('https://gist.githubusercontent.com/olemi/d4fb825df71c2939405e0017e360cd73/raw/d6f9f0e9e8bd33183454250bd8b808953869edd2/world-110m2.json')
)});
  main.variable(observer("rawData")).define("rawData", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("API_SP.POP.TOTL_DS2_en_csv_v2_2106202@1.csv").csv()
)});
  main.variable(observer("countryCodes")).define("countryCodes", ["d3"], function(d3){return(
d3.tsv('https://d3js.org/world-110m.v1.tsv')
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Data formatting`
)});
  main.variable(observer("letterToNum")).define("letterToNum", ["countryCodes"], function(countryCodes)
{
  const letToNum = new Map();
  
  countryCodes.forEach(item => {
    if (item.iso_a3 !== "-99" && item.iso_n3 !== "-99") {
      letToNum.set(item.iso_a3, item.iso_n3);
    }
  });
  return letToNum;
}
);
  main.variable(observer("data")).define("data", ["rawData","letterToNum"], function(rawData,letterToNum)
{
  const arrayData = rawData.map(item => {
    let newDatum = Object.assign({}, item);
    for (let i = 1960; i < 2020; i++) {
      newDatum[`${i}`] = +newDatum[`${i}`]
    }
    newDatum["Country Code"] = letterToNum.get(item["Country Code"]);
    return newDatum;
  }).filter(item => {
    return item["Country Code"] !== undefined;
  })
  const data = new Map()
  arrayData.forEach(item => {
    data.set(+item["Country Code"], item);
  })
  return data;                
}
);
  main.variable(observer("defaultMinValue")).define("defaultMinValue", ["data"], function(data)
{
  let minVal = 100000000000;
  data.forEach(value => {
    if (value["1960"] === 0) return;
    minVal = Math.min(minVal, value["1960"])
  })
  return minVal;   
}
);
  main.variable(observer("defaultMaxValue")).define("defaultMaxValue", ["data"], function(data)
{
  let maxVal = 0;
  data.forEach(value => {
    if (value["2019"] === 0) return;
    maxVal = Math.max(maxVal, value["2019"])
  })
  return maxVal;   
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Styles`
)});
  main.variable(observer("styles")).define("styles", ["html"], function(html){return(
html`
<style>
  .hover-info {
  width: 150px;
  z-index: 10001;
  position: absolute;
  background: aliceblue;
  border: 2px solid black;
  border-radius: 4px;
  overflow: visible;
}

.triangle {
  position: absolute;
  z-index: -1;
  width: 10px;
  height: 10px;
  left: 5px;
  transform: rotate(45deg);
  background: aliceblue;
  border-left: 2px solid black;
  border-top: 2px solid black;
}
</style>`
)});
  return main;
}
