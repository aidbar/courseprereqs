import * as d3 from "https://cdn.skypack.dev/d3@7";
import axios from 'https://cdn.skypack.dev/axios';

const dataSet = async function getData() {
    return await axios.get('/data');
}

var courseData = [];
var selectedCourse = "";

function hasJsonStructure(str) {
    if (typeof str === 'string') return false;
    try {
        return Object.prototype.toString.call(str) === '[object Object]' || Array.isArray(str);
    } catch (err) {
        return false;
    }
};


//Parse and convert object recursive
function walk2(obj2,level) {
    var mytempCH = [];
    var outer = [];
    for (var key in obj2){
        var value = obj2[key];
        if(hasJsonStructure(value)){
            //has children
            var mytempCH2 = new Object();
            mytempCH2.name = key;
            mytempCH2.children = walk2(value,level+1);
            outer.push(mytempCH2);
        }else{
            outer.push({"name": key + ": " + value, "value": level})
        }
      }
      return outer
}

function getNodes() {
    console.log("getNodes() is running.");
}

function onChange() {
    console.log("*********************onChange event listener");
}

async function drawGraph() {
    const data = await dataSet();
    console.log(data);

    /*var myNewObj = new Object();
    myNewObj.name = "ConvertedObj";
    myNewObj.children = [];
    var level = 1;
    //Start work
    myNewObj.children = walk2(data,1);

    console.log(myNewObj);*/

    courseData = data.data;
    console.log(courseData);

    let dropdownSelection = d3.select("select");
    let dropdownArray = dropdownSelection._groups[0];
    let dropdown = dropdownArray[0];
    console.log("dropdown is:");
    console.log(dropdown);
    dropdown.addEventListener("change",onChange);

    //getNodes(courseData);
    
    /*const data = await dataSet();
    const svgWidth = 500;
    const svgHeight = 500;
    const barPadding = 5;
    const barWidth = svgWidth / data.data.length;

    let svg = d3.select("svg");
    let width = svg
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    svg
        .selectAll("rect")
        .data(data.data)
        .enter()
        .append("rect")
        .attr("y", (d) => svgHeight - d)
        .attr("height", (d) => d)
        .attr("width", () => barWidth - barPadding)
        .attr("transform", (d, i) => {
            let translate = [barWidth * i, 0];
            return `translate(${translate})`;
        })
        .style("fill", "steelblue");*/
}
drawGraph();