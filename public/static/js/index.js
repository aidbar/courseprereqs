import * as d3 from "https://cdn.skypack.dev/d3@7";
import axios from 'https://cdn.skypack.dev/axios';

const dataSet = async function getData() {
    return await axios.get('/data');
}

var courseData = [];
var selectedCourse = "";

var graphNodeData = [];
var graphLinkData = [];

var graphData = {};

var selectedCourseIndex = -1;

var nodeIndex = 1;
var parentNodeIndex = 1;

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

function getNodes(selectedCourse) {
    console.log("getNodes() is running.");

    graphNodeData = [];
    graphLinkData = [];
    
    for (var i = 0; i <courseData.length; i++) {
        var node = {};
        //getting the initial node of the graph (the selected course)
        if (courseData[i].groupId == selectedCourse) {
            console.log("found");
            selectedCourseIndex = i;
            node = {"id": nodeIndex, "name": courseData[i].name.en}
            nodeIndex++;
            graphNodeData.push(node);
            break;
        }
        selectedCourseIndex = -1;
    }
    if (selectedCourseIndex != -1) {
        parentNodeIndex = 1;
        getAllRecursives(selectedCourseIndex);
    }
    console.log(graphNodeData);
    console.log(graphLinkData);
}

function getRecursive(index, type) {
    console.log("getRecursive running, index is " + index);

    var possibleParent = getParentNodeIndex(courseData[index]);
    if (possibleParent != -1) parentNodeIndex = possibleParent;

    var nextIndex = -1;

    var hasMorePrereqs = false;

    var searchArea = [];
    switch(type) {
        case "prerequisites":
            if (courseData[index].prerequisites != null) {
                searchArea = courseData[index].prerequisites;
                console.log(courseData[index])
                if (searchArea.length > 0) console.log(searchArea);
                if (searchArea != null) {
                    //hasMorePrereqs = true;
                    for (var i = 0; i < searchArea.length; i++) {
                        var node = {"id": nodeIndex, "name": searchArea[i].en}
                        graphNodeData.push(node);  
                        var link = {"source": parentNodeIndex, "target": nodeIndex} //nodeIndex-1
                        graphLinkData.push(link);
                        nodeIndex++;
                    }
                }
            }
            break;
        case "recommendedFormalPrerequisites":
            if (searchArea != null) {
                searchArea = courseData[index].recommendedFormalPrerequisites;
                console.log("searchArea is:");
                console.log(searchArea);
                if (searchArea.length > 0) hasMorePrereqs = true;
                for (var i = 0; i < searchArea.length; i++) {
                    var prereqGroup = searchArea[i].prerequisites;
                    console.log(prereqGroup);
                    for (var j = 0; j < prereqGroup.length; j++) {
                        console.log(prereqGroup[j]);
                        console.log("prereqGroup.lenght is " + prereqGroup.length + ",index is " + index);
                        nextIndex = indexFromGroupId(prereqGroup[j].courseUnitGroupId);
                        addNodeByGroupId(index, prereqGroup[j].courseUnitGroupId);
                    }
                }
            }
            break;
        case "compulsoryFormalPrerequisites":
            if (searchArea != null) {
                searchArea = courseData[index].compulsoryFormalPrerequisites;
                console.log("searchArea is:");
                console.log(searchArea);
                if (searchArea.length > 0) hasMorePrereqs = true;
                for (var i = 0; i < searchArea.length; i++) {
                    var prereqGroup = searchArea[i].prerequisites;
                    console.log(prereqGroup);
                    console.log("prereqGroup.lenght is " + prereqGroup.length + ",index is " + index);
                    for (var j = 0; j < prereqGroup.length; j++) {
                        console.log(prereqGroup[j]);
                        nextIndex = indexFromGroupId(prereqGroup[j].courseUnitGroupId);
                        addNodeByGroupId(index, prereqGroup[j].courseUnitGroupId);
                    }
                }
            }
            break;
        default:
            searchArea = [];

        if (nextIndex != -1) { 
            getAllRecursives(nextIndex);
        } else {
            console.log("nextIndex is -1");
            drawGraph();
        }
    }
}

function indexFromGroupId(groupId) {
    for (var i = 0; i <courseData.length; i++) {
        if (courseData[i].groupId == groupId) {
            console.log("indexFromGroupId to return " + i);
            return i;
        }
    }
    return -1;
}

function addNodeByGroupId(index, groupId) {
    var course = [];
    var courseIndex = -1;
    for (var i = 0; i <courseData.length; i++) {
        if (courseData[i].groupId == groupId) {
            course = courseData[i];
            courseIndex = i
            break;
        }
    }
    var node = {"id": nodeIndex, "name": course.name.en}
    graphNodeData.push(node);  
    var link = {"source": parentNodeIndex, "target": nodeIndex} //nodeIndex-1
    nodeIndex++;
    graphLinkData.push(link);


    getAllRecursives(courseIndex);
}

function getParentNodeIndex(course) {
    for (var i = 0; i <courseData.length; i++) {
        for (var j = 0; j < graphNodeData.length; j++) {
            if (courseData[i].name.en = graphNodeData[j].name) {
                return j+1;
            }
        }
    }
    return -1;
}

function getAllRecursives(index) {
    getRecursive(index, "prerequisites"); 
    getRecursive(index, "recommendedFormalPrerequisites"); 
    getRecursive(index, "compulsoryFormalPrerequisites"); 
}

function onChange(event) {
    console.log("*********************onChange event listener");
    console.log(event);
    var dropdown = document.getElementById("select");
    selectedCourse = dropdown.value;
    //var text = dropdown.options[dropdown.selectedIndex].text;
    console.log(selectedCourse);
    getNodes(selectedCourse);
}

function onClick(event) {
    if (document.getElementById("select").value != "") {
        document.getElementById("message").innerText = "";
        drawGraph();
    } else {
        document.getElementById("message").innerText = "No course selected.";
    }
}

function drawGraph() {
    console.log("drawGraph running");
    graphData = {"nodes" : graphNodeData, "links": graphLinkData};
    console.log(graphData);
}

async function initialize() {
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
    document.getElementById("drawbutton").addEventListener("click", onClick);

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
initialize();