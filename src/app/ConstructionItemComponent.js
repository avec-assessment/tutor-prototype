'use client'
import { useEffect, useState } from 'react';
import embed from 'vega-embed';
import * as vl from 'vega-lite-api';
import QuestionText from './question-text.js';
import { useRouter, usePathname, useSearchParams, redirect } from 'next/navigation'



function updateDataEncoding(vis_spec, encoding, var_update_to, data_columns) {
    console.log("in update data encoding for drop down")
    console.log(encoding)
    
    let update_to = var_update_to
    let split_var = var_update_to.split("-")
    if (split_var.length == 2 && var_update_to.split("-")[0] == "sum") {
        update_to = var_update_to.split("-")[1]
    }

    if (!vis_spec["encoding"][encoding]) {
        vis_spec["encoding"][encoding] = {}
    }

    
    if (encoding == "y" && !var_update_to.includes("count")) {
      let check_x = document.getElementById("data-x").value
      if (check_x.includes("count")) {
        vis_spec["encoding"][encoding]["bin"] = true;
        vis_spec["encoding"][encoding]["aggregate"] = "" // bin means the other channel has aggregate, so remove any aggregate in this channel
      } else {
        if (vis_spec["encoding"]["x"]["bin"]) {
          vis_spec["encoding"]["x"]["bin"] = false;  
        }
      }
    } else if (encoding == "x" && !var_update_to.includes("count")) {
      let check_y = document.getElementById("data-y").value
      if (check_y.includes("count")) {
        vis_spec["encoding"][encoding]["bin"] = true;
        vis_spec["encoding"][encoding]["aggregate"] = "" // bin means the other channel has aggregate, so remove any aggregate in this channel
      } else {
        if (vis_spec["encoding"]["y"]["bin"]) {
          vis_spec["encoding"]["y"]["bin"] = false;  
        }
      }
    }
    
    if (var_update_to.includes("count")) {
        let actions = var_update_to.split("-")
        vis_spec["encoding"][encoding]["aggregate"] = "count";
        vis_spec["encoding"][encoding]["field"] = "";
        vis_spec["encoding"][encoding]["type"] = "";
        
        let bin_on = actions[1].split("_")[1] // x or y
            
        vis_spec["encoding"][bin_on]["bin"] = true;
        vis_spec["encoding"][bin_on]["aggregate"] = "" // bin means the other channel has aggregate, so remove any aggregate in this channel
            
        if (vis_spec["encoding"][encoding]["sort"]) {
            vis_spec["encoding"][encoding]["sort"] = ""
            
        }
        
    } else if (var_update_to.includes("sum")) {
        vis_spec["encoding"][encoding]["aggregate"] = "sum";
        if (update_to == "Month") {
          vis_spec["encoding"][encoding]["sort"] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
        } else {
          if (vis_spec["encoding"][encoding]["sort"]) {
                vis_spec["encoding"][encoding]["sort"] = ""
          }
          
           
        }
         vis_spec["encoding"][encoding]["field"] = update_to 
        vis_spec["encoding"][encoding]["type"] = data_columns[update_to]["type"];
        
    } else {
        if (update_to == "Month") {

            vis_spec["encoding"][encoding]["sort"] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
        } else {
            if (vis_spec["encoding"][encoding]["sort"]) {
                vis_spec["encoding"][encoding]["sort"] = ""
            }
            
            
        }
        vis_spec["encoding"][encoding]["field"] = update_to
        vis_spec["encoding"][encoding]["type"] = data_columns[update_to]["type"];
    }
    if (encoding == "color") {
        let color_scheme = data_columns[update_to]["color"]
        if (color_scheme == "div") {
            vis_spec["encoding"]["color"]["scale"] = {"scheme": "purpleorange"};
        } else if (color_scheme == "seq") {
            vis_spec["encoding"]["color"]["scale"] = {"scheme": "purplebluegreen"};
        } else if (color_scheme == "qual") {
            vis_spec["encoding"]["color"]["scale"] = {"scheme": "dark2"};
        }
    }
    
    embed('#questionVis', vis_spec, {"actions": false});
    return vis_spec
    
}

function removeDataEncoding(vis_spec, encoding) {
  console.log("in remove data encoding")
  console.log(vis_spec)
  console.log(encoding)
  vis_spec["encoding"][encoding]["field"] = "";
  vis_spec["encoding"][encoding]["type"] = "";
  if (vis_spec["encoding"][encoding]["sort"]) {
    vis_spec["encoding"][encoding]["sort"] = ""
  }

  embed('#questionVis', vis_spec, {"actions": false});
  return vis_spec
}

function removeAction(vis_spec, encoding, action) {
    console.log("in remove data encoding")
    console.log(vis_spec)
    console.log(encoding)
    if  (action == "count" || action == "sum") {
        if (vis_spec["encoding"][encoding]["aggregate"]) {
            vis_spec["encoding"][encoding]["aggregate"] = ""; 
        }
       
    } else if (action == "bin") {
      if (vis_spec["encoding"][encoding]["bin"]) {
        vis_spec["encoding"][encoding]["bin"] = false;  
      }
      
    }
    
    embed('#questionVis', vis_spec, {"actions": false});
    return vis_spec
  }


function updateMark(vis_spec, mark) {
  console.log("in update mark")
  console.log(vis_spec, mark)
  vis_spec["mark"]["type"] = mark;

  embed('#questionVis', vis_spec, {"actions": false});
  return vis_spec
}



const ConstructionItemComponent = (props) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false);
  const [chartTypeSelected, setChartTypeSelected] = useState("");
  const [currentItem, setCurrentItem] = useState(props.mode+props.item);
  const [itemBank, SetItemBank] = useState(props.item_bank);
  const [tileSets, setTileSets] = useState(props.tile_sets);
  const [currentChartType, setCurrentChartType] = useState("");
  const [selectedChart, setSelectedChart] = useState(false);
  const [selectedVar, setSelectedVar] = useState(false);
  const [dataset, setDataset] = useState(props.item_bank["datasets"][props.item_bank[props.mode+props.item]["dataset"]])
  const [loadVis, setLoadVis] = useState(props.item_bank[props.mode+props.item]["question_vis"]);
  const [currentItemState, setCurrentItemState] = useState(props.item_bank[props.mode+props.item]["manage_state"]);
  const [pID, setPID] = useState("");
  const [showTextBox, setShowTextBox] = useState(false);
  const [itemAnswer, setItemAnswer] = useState("no answer");
  const [stepbystep, setStepbystep] = useState(false);
  const [currentXValue, setCurrentXValue] = useState("");
  const [currentYValue, setCurrentYValue] = useState("")
  const [currentColorValue, setCurrentColorValue] = useState("")
  const [currentSizeValue, setCurrentSizeValue] = useState("")
  const [canShowCover, setCanShowCover] = useState(true)
  const [canShowPartCover, setCanShowPartCover] = useState(true)
  const [itemOrder, setItemOrder] = useState(["1", "2", "4", "39", "17", "19", "28", "41", "12", "22", "30"])
  
  console.log("in CREATE item component!")
  console.log(props)
  console.log(props.item_bank)
  console.log(pathname)


  useEffect(() => {
      setIsClient(true);
      const queryString = window.location.search;
      console.log(queryString);

      if (!props.assessment && props.item == 1) {
        setStepbystep(true)
      }
  
      const urlParams = new URLSearchParams(queryString);
      console.log(urlParams)
  
      const prolific_ID = urlParams.get('PROLIFIC_PID')
      console.log(prolific_ID)
      setPID(prolific_ID);


      setShowTextBox(false)
          
      
      
    }, [])

  if (isClient) {

    console.log(loadVis)


    embed('#questionVis', loadVis, {"actions": false});
    if (!props.assessment) {
        embed("#toReconstruct", props.item_bank["training"+props.item]["model_vis"], {"actions": false})
    }

  }

  

  let chart_types = Object.keys(tileSets)
  console.log(chart_types)

  let read_dataset = dataset;
  console.log(read_dataset)
  let data_columns = Object.keys(read_dataset)
  console.log(data_columns)
  
  const changeChartType = (clicked_chart) => {
    console.log("clicked")
    console.log(clicked_chart)
    console.log(selectedChart)
    // default for line and point are actual values, so remove sum on any quantative var
    let current_y_value = document.getElementById("data-y").value
    let current_x_value = document.getElementById("data-x").value
    let update_vis_spec = loadVis
    let use_vis_spec = loadVis
    let need_sum = ["Month", "Year", "Spending_Category"]
    if (clicked_chart == "line" || clicked_chart == "point") {
        if (dataset[current_y_value] && dataset[current_y_value]["type"] == "quantitative") {
          update_vis_spec = removeAction(use_vis_spec, "y", "sum")
          use_vis_spec = update_vis_spec
        }
        if (dataset[current_x_value] && dataset[current_x_value]["type"] == "quantitative") {
          update_vis_spec = removeAction(use_vis_spec, "x", "sum")
          use_vis_spec = update_vis_spec
        }
    } else {
        if (dataset[current_y_value] && dataset[current_y_value]["type"] == "quantitative") {
            if (!current_x_value.includes("count") && need_sum.includes(current_x_value)) {
              update_vis_spec = updateDataEncoding(use_vis_spec, "y", "sum-"+current_y_value, dataset)
              use_vis_spec = update_vis_spec
            }
            
        }
        if (dataset[current_x_value] && dataset[current_x_value]["type"] == "quantitative") {
            if (!current_y_value.includes("count") && need_sum.includes(current_y_value)) {
              update_vis_spec = updateDataEncoding(use_vis_spec, "x", "sum-"+current_x_value, dataset)
              use_vis_spec = update_vis_spec
            }
        }
    }
    let vis_update = update_vis_spec
    
    console.log(loadVis)
    setChartTypeSelected(clicked_chart);
    setCurrentChartType(clicked_chart)
    let state_change = currentItemState
    state_change["chart_type"] = clicked_chart
    setCurrentItemState(state_change)

    
    update_vis_spec = updateMark(use_vis_spec, clicked_chart)
    use_vis_spec = update_vis_spec

    setSelectedChart(true);
    let chart_tiles = document.getElementsByClassName("chartTilesContainer")
    console.log(chart_tiles)
    for (let index = 0; index < chart_tiles.length; index += 1) {
      if (chart_tiles[index].classList.contains("selectedChart")) {
        chart_tiles[index].classList.remove("selectedChart");
      }
    }
    document.getElementById(clicked_chart+"_container").classList.add("selectedChart")
    if (stepbystep && clicked_chart == "bar") {
      setCanShowCover(false)
      if (currentXValue != "Month") {
        document.getElementById("nextButton").scrollIntoView();
      }
      
    }
    
    setLoadVis(update_vis_spec)
  }



  const updateYSelectedValue = () => {
    let select_y = document.getElementById("data-y").value
    setCurrentYValue(select_y)
    console.log(select_y)
    console.log(dataset)
    let state_change = currentItemState
    console.log(loadVis)
    let update_vis_spec = loadVis
    let use_vis_spec = loadVis
    let need_sum = ["Month", "Year", "Spending_Category"]
    if (!select_y) {
        update_vis_spec = removeDataEncoding(use_vis_spec, "y")
        use_vis_spec = update_vis_spec
        state_change["encodings"]["y"]["data"] = ""
        setCurrentItemState(state_change)
    } else {
        update_vis_spec = removeAction(use_vis_spec, "y", "count");
        use_vis_spec = update_vis_spec
        update_vis_spec = removeAction(use_vis_spec, "y", "bin");
        use_vis_spec = update_vis_spec

        update_vis_spec = updateDataEncoding(use_vis_spec, "y", select_y, dataset)
        use_vis_spec = update_vis_spec
        let x_axis = document.getElementById("data-x")

        if (select_y == "Date") {
          update_vis_spec = removeAction(use_vis_spec, "x", "sum")
          use_vis_spec = update_vis_spec
        }
      
        if (dataset[select_y] && dataset[select_y]["type"] == "quantitative") {
     
            update_vis_spec = removeAction(use_vis_spec, "y", "sum")
            use_vis_spec = update_vis_spec
            // default to sum aggregation for bar and area
            if (currentChartType == "bar" || currentChartType == "area") {
                let current_x_value = document.getElementById("data-x").value
                if (need_sum.includes(current_x_value)) {
                  update_vis_spec = updateDataEncoding(use_vis_spec, "y", "sum-"+select_y, dataset)
                  use_vis_spec = update_vis_spec
                }
    
                
            }

            
        } else if (dataset[select_y]) {
            // default to sum aggregation for bar and area
            if (currentChartType == "bar" || currentChartType == "area") {
                // if the current value on x axis is quantative and y value is not, set the x value to be sum again
                let current_x_value = document.getElementById("data-x").value
                if (need_sum.includes(select_y) && dataset[current_x_value] && dataset[current_x_value]["type"] == "quantitative") {
                    update_vis_spec = updateDataEncoding(use_vis_spec, "x", "sum-"+current_x_value, dataset)
                    use_vis_spec = update_vis_spec
                }
            
            }
    
                let current_axis = document.getElementById("data-y")

        }

        state_change["encodings"]["y"]["data"] = select_y
        setCurrentItemState(state_change)
        setSelectedVar(true);
    }
    console.log(state_change)
    setLoadVis(update_vis_spec)

    if (stepbystep) {
      if (document.getElementById("disableDiv") && select_y == "Spending") {
        document.getElementById("disableDiv").classList.add("removeColorCover")
      }
      
    }
  }

  const updateXSelectedValue = () => {
    let select_x = document.getElementById("data-x").value
    setCurrentXValue(select_x)
    console.log(select_x)
    console.log(loadVis)
    let state_change = currentItemState
    let update_vis_spec = loadVis
    let use_vis_spec = loadVis
    let need_sum = ["Month", "Year", "Spending_Category"]
    if (!select_x) {
        update_vis_spec = removeDataEncoding(use_vis_spec, "x")
        use_vis_spec = update_vis_spec
        state_change["encodings"]["x"]["data"] = ""
        setCurrentItemState(state_change)
    } else {
        update_vis_spec = removeAction(use_vis_spec, "x", "count");
        use_vis_spec = update_vis_spec
        update_vis_spec = removeAction(use_vis_spec, "x", "bin");
        use_vis_spec = update_vis_spec

        update_vis_spec = updateDataEncoding(use_vis_spec, "x", select_x, dataset)
        use_vis_spec = update_vis_spec
        let y_axis = document.getElementById("data-y")

        if (select_x == "Date") {
          update_vis_spec = removeAction(use_vis_spec, "y", "sum")
          use_vis_spec = update_vis_spec
        }

        if (dataset[select_x] && dataset[select_x]["type"] == "quantitative") {
 
            console.log(use_vis_spec)
            update_vis_spec = removeAction(use_vis_spec, "x", "sum")
            use_vis_spec = update_vis_spec
  
            if (currentChartType == "bar" || currentChartType == "area") {
                let current_y_value = document.getElementById("data-y").value
                if (need_sum.includes(current_y_value)) {
                  update_vis_spec = updateDataEncoding(use_vis_spec, "x", "sum-"+select_x, dataset)
                  use_vis_spec = update_vis_spec
                }
                
            }

           
        } else if (dataset[select_x]) {
            // default to sum aggregation for bar and area
            if (currentChartType == "bar" || currentChartType == "area") {
                // if the current value on y axis is quantative and x value is not, set the y value to be sum again
                let current_y_value = document.getElementById("data-y").value
                if (need_sum.includes(select_x) && dataset[current_y_value] && dataset[current_y_value]["type"] == "quantitative") {
                    update_vis_spec = updateDataEncoding(use_vis_spec, "y", "sum-"+current_y_value, dataset)
                    use_vis_spec = update_vis_spec
                }
            
            }

                let current_axis = document.getElementById("data-x")
      
        }
 
        
        state_change["encodings"]["x"]["data"] = select_x
        setCurrentItemState(state_change)
        setSelectedVar(true);
    }
    setLoadVis(update_vis_spec)

    if (stepbystep) {
      if (document.getElementById("disableDiv") && select_x == "Month") {
        document.getElementById("disableDiv").classList.add("removeYCover")
      }
      
    }
    
  }

  const updateColorSelectedValue = () => {
    let select_color = document.getElementById("data-color").value
    console.log(select_color)
    setCurrentColorValue(select_color)
    console.log(select_color)
    let state_change = currentItemState
    let use_vis_spec = loadVis
    let update_vis_spec = loadVis
    if (!select_color) {
        update_vis_spec = removeDataEncoding(use_vis_spec, "color")
        use_vis_spec = update_vis_spec
        state_change["encodings"]["color"]["data"] = ""
        setCurrentItemState(state_change)
    } else {
        update_vis_spec = updateDataEncoding(use_vis_spec, "color", select_color, dataset)
        use_vis_spec = update_vis_spec
        state_change["encodings"]["color"]["data"] = select_color
        setCurrentItemState(state_change)
        setSelectedVar(true);
    }
    setLoadVis(update_vis_spec)
    
    if (stepbystep && select_color == "Spending_Category") {
      setCanShowPartCover(false)
      document.getElementById("nextButton").classList.add("marginTop")
    }
  }

  const updateSizeSelectedValue = () => {
    let select_size = document.getElementById("data-size").value
    setCurrentSizeValue(select_size)
    console.log(select_size)
    let state_change = currentItemState
    let use_vis_spec = loadVis
    let update_vis_spec = loadVis
    if (!select_size) {
        update_vis_spec = removeDataEncoding(use_vis_spec, "size")
        use_vis_spec = update_vis_spec
        state_change["encodings"]["size"]["data"] = ""
        setCurrentItemState(state_change)
    } else {
        update_vis_spec = updateDataEncoding(use_vis_spec, "size", select_size, dataset) 
        use_vis_spec = update_vis_spec
        state_change["encodings"]["size"]["data"] = select_size
        setCurrentItemState(state_change)
        setSelectedVar(true);
    }
    setLoadVis(update_vis_spec)
    
  }

  const recordAnswer = (answer, highlight_id) => {
    setItemAnswer(answer)
    if (highlight_id == "TFoptionT") {
        document.getElementById(highlight_id).classList.add("selectedAnswer")
        document.getElementById("TFoptionF").classList.remove("selectedAnswer")
    } else {
        document.getElementById(highlight_id).classList.add("selectedAnswer")
        console.log(document.getElementById(highlight_id))
        document.getElementById("TFoptionT").classList.remove("selectedAnswer")
    }
    
  }

  const nextItem = (e) => {

    if (stepbystep) {
      if (!selectedChart || !selectedVar) {
        return;
      }
      
    }
    
    console.log("clicking next")
    console.log(itemAnswer)
    let prev_index = props.item-1
    let prev_item = "item_"+prev_index
    if (prev_index <= 0) {
        prev_item = "instructions"
    }
    if (showTextBox) {
        let OE_text = document.getElementById("questionAnswer").value.trim()
        console.log("???", OE_text)
        if (itemAnswer == "no answer") {
          document.getElementById("requiredLabel").classList.add("showDescription")
          document.getElementById("requiredLabel").classList.remove("hideDescription")
        } else{
          document.getElementById("requiredLabel").classList.remove("showDescription")
          document.getElementById("requiredLabel").classList.add("hideDescription")
        }

        if (currentItem == "item39" || currentItem == "item41") {
          if (OE_text == "") {
            OE_text = "attention check placeholder"
          }
        }
        if (OE_text == "") {
          document.getElementById("requiredLabelOE").classList.add("showDescription")
          document.getElementById("requiredLabelOE").classList.remove("hideDescription")
        } else {
          document.getElementById("requiredLabelOE").classList.remove("showDescription")
          document.getElementById("requiredLabelOE").classList.add("hideDescription")
        }
      
        if (itemAnswer == "no answer" || OE_text == "") {
          console.log(selectedChart)
          console.log(selectedVar)
          return;
        }
        
    }

    console.log(showTextBox)
    if (props.assessment && !showTextBox) {
        setShowTextBox(true);
  
        return;
    }

    let current_item_index = itemOrder.indexOf(props.item.toString())
    let next_item = current_item_index + 1
    
    if (props.assessment) {
        if (next_item <= 12) {

     
            let text_answer = document.getElementById("questionAnswer").value
   
            document.getElementById("proceeding").classList.remove("hideDescription")

            let current_item_index = itemOrder.indexOf(props.item.toString())
            console.log(current_item_index)
            if (current_item_index == 10) {
              location.href = "https://www.prolific.com/";

            } else {
              let url_pid = "?PROLIFIC_PID=" + pID;
              
              router.push('/Q'+itemOrder[next_item]+url_pid) // advance to next question page
              
            }
        
        
        }
    } else {
        if (next_item <= 6) {
            let chart_tiles = document.getElementsByClassName("chartTilesContainer")
            console.log(chart_tiles)
    
            if (!selectedChart || !selectedVar) {
              
              document.getElementById("questionContainer").classList.add("highlightRequired")
              document.getElementById("questionContainer").focus()
              return;
            }
            let correct_mappings = itemBank[currentItem]["question_meta_data"]["mappings"]
            let fetch_chart = currentChartType
            if (!selectedChart) {
              fetch_chart = ""
            }
            
            let current_x_value = document.getElementById("data-x").value
            let current_y_value = document.getElementById("data-y").value
            let current_color_value = document.getElementById("data-color").value
            let current_size_value = document.getElementById("data-size").value
            let selected_answer = {
              "mark": fetch_chart,
              "x": current_x_value,
              "y": current_y_value,
              "color": current_color_value,
              "size": current_size_value
            }
            let check_correctness = true
            for (const [key, value] of Object.entries(correct_mappings)) {
              console.log(key, selected_answer[key]);
              if (correct_mappings[key] != selected_answer[key]) {
                check_correctness = false
              }
            }
            if (!check_correctness) {
              document.getElementById("questionContainer").classList.add("highlightRequired")
              document.getElementById("questionContainer").focus()
              return;
            }
            
            
            let text_answer = ""
            document.getElementById("proceeding").classList.remove("hideDescription")
            let url_pid = "?PROLIFIC_PID=" + pID;
            let next_item = props.item + 1
              router.push('/start10'+next_item+url_pid)
                
            
        }
    }
    
    

  }


  return (
    <div id="globalContainer">
    
    {!isClient ? <div>
        <div id="questionVis" style={{display:"none"}} ></div>
        <div id="toReconstruct" style={{display:"none"}} ></div>
    </div>
    :<div id="interactionZone">
        {isClient && !showTextBox ? <QuestionText question={itemBank[currentItem]["question_meta_data"]}></QuestionText> : null}
        {!showTextBox ? <hr></hr> : null}
        {!showTextBox ? <div id="workingTiles">
            <div id='chartTypes'>
            {!props.assessment ? <div id="toReconstruct"></div> : null}
                {props.assessment ? <div>
                    <p>Select a mark type for your chart</p>
                    <div id="chartTypesTiles">
                    {chart_types.map(chart_tiles => (
                        <div className="chartTilesContainer" key={chart_tiles} id={chart_tiles+"_container"}>
                            <img className="chartTiles" src={tileSets[chart_tiles]["chart"]} onClick={() => changeChartType(chart_tiles)}></img>
                        </div>
                    ))}
                    </div>
                </div> : null}
            </div>
            <div id='data'>
                {!props.assessment ? <div id='chartTypeSet'>
                    <p>Select a mark type for your chart</p>
                    <p><i>This determines the chart type.</i></p>
                    <div id="chartTypesTiles">
                    {chart_types.map(chart_tiles => (
                        <div className="chartTilesContainer" key={chart_tiles} id={chart_tiles+"_container"}>
                            <img className="chartTiles" src={tileSets[chart_tiles]["chart"]} onClick={() => changeChartType(chart_tiles)}></img>
                        </div>
                    ))}
                    </div>
            
                </div> : null}
                {(stepbystep) ? 
                (!selectedChart || currentChartType != "bar") ?
                  <div className='instructionBox'><p className='trainingStepText'>The <b>tiles above set the chart type.</b> <br></br>Click on "bar" to begin to create a bar chart.</p></div> : null
                : null}
            </div>
        </div> : null}
        {(stepbystep && canShowPartCover) ? 
        (currentChartType != "bar" && canShowCover) ?
            <div className='disabled'></div> : 
            (currentXValue != "Month" || currentYValue != "Spending" || currentColorValue != "Spending_Category") ?
          <div id ="disableDiv" className='disabledChannels'></div> : null : null}
        <div id='visContainer'>
      
            { !showTextBox ? <div id="yAxis">
                <p id="yAxisLabel">Y-axis</p>
                <div id='encodings'>
                <div>
                    <div className='mappingContainer'>
                    
                      <select name="data-y" id="data-y" defaultValue="" onChange={() => updateYSelectedValue()}>
                        <option value=""></option>
                        {data_columns.map(variable => ( 
                            <option key={variable} value={variable}>{dataset[variable]["full_name"]}</option>
                        ))}
                        <option value="count-bin_x">Count of Records</option>
                        
                      </select>
                    </div>
                    {(stepbystep) ? 
                      (selectedChart && currentXValue == "Month" && currentYValue != "Spending") ?
                      <div className='instructionBox'><p className='trainingStepText'>This dropdown <b>sets the y-axis</b> of the chart. Choose "Spending" from this dropdown to set the y-axis.</p></div> : null
                      : null}
                </div>
                
              </div>

            </div>: null}
           
            <div>
            {(!selectedChart || !selectedVar) ? <div id="placeholderInstructions">
                {showTextBox ? <p>No chart created</p> : !selectedChart ? 
                <p><i>Select a mark type from the <b>tiles above</b></i></p> : 
                <p><i>Select variables from <b>dropdown lists</b></i></p>}
            </div>: null}
            <div id="questionVis">
            </div>
            {!showTextBox ? <div id='encoding_x'>
            <div className='xContainer'>
                <div>
                    <p id="xAxisLabel">X-axis</p>
                </div>
                <div>
                    <div className='mappingContainerX'>
                        <div className="xTiles">
                            
                                <select name="data-x" id="data-x" defaultValue="" onChange={() => updateXSelectedValue()}>
                                    <option value=""></option>
                                    {data_columns.map(variable => ( 
                                        <option key={variable} value={variable}>{dataset[variable]["full_name"]}</option>
                                    ))}
                                    <option value="count-bin_y">Count of Records</option>
                                
                                </select>
                            </div>
                        
                        </div>
                        
                        
                    </div>
                    
                </div>
                {(stepbystep) ? 
                (selectedChart && currentChartType == "bar" && currentXValue != "Month") ?
                <div className='instructionBox'><p id="xAxisInstructions" className='trainingStepText'>This dropdown <b>sets the x-axis</b> of the chart. Choose "Month" from this dropdown to set the x-axis.</p></div> : null
                : null}
            </div> : null}
            
            </div>
            <div id='encodings'>
                {!showTextBox ? <div className='mappingContainerColorSize'>
                    {(stepbystep) ? 
                    (currentXValue == "Month" && currentYValue == "Spending" && currentColorValue != "Spending_Category") ?
                    <div className='instructionBox fixPosition colorTrainingText'><p className='trainingStepText'>This dropdown <b>sets the color</b> of the mark. Choose "Spending category" from this dropdown to see sum of spending per spending category.</p></div> : null
                    : null}
                    <div>
                        <p>Color</p>
                        <select name="data-color" id="data-color" defaultValue="" onChange={() => updateColorSelectedValue()}>
                            <option value=""></option>
                            {data_columns.map(variable => ( 
                                <option key={variable} value={variable}>{dataset[variable]["full_name"]}</option>
                            ))}
                        </select> 
                    </div>
                    <div>
                        <p>Size</p>
                        <select name="data-size" id="data-size" defaultValue="" onChange={() => updateSizeSelectedValue()}>
                            <option value=""></option>
                            {data_columns.map(variable => ( 
                                <option key={variable} value={variable}>{dataset[variable]["full_name"]}</option>
                            ))}
                        </select> 
                    </div>
                    {(stepbystep) ? 
                    (currentXValue == "Month" && currentYValue == "Spending" && currentColorValue == "Spending_Category") ?
                      <div>
                       <div className='instructionBox fixPosition sizeTrainingText'><p className='trainingStepText'>This dropdown <b>sets the size</b> of the mark. There is no need to set size for this example.<br></br>Click 'Next' whenever you are ready.</p></div>
                      </div>
                       : null
                    : null}
                    
              
                </div> : null}
                 
                
                {showTextBox ? <div id="answerVis">
                    <p><b>True or False <span style={{color:"red"}}>*</span></b> <span style={{color:"red"}} className="hideDescription" id="requiredLabel">Selection required</span></p>
                    {itemBank[currentItem]["question_meta_data"]["attention_check"] ? <p>{itemBank[currentItem]["question_meta_data"]["attention_check"]}</p> : <p>{itemBank[currentItem]["question_meta_data"]["question_text"]}</p>}
                    <div id="TFoptions">
                        <div className="choiceOption" id="TFoptionT" onClick={() => recordAnswer(true, "TFoptionT")}><p>True</p></div>
                        <div className="choiceOption" id="TFoptionF" onClick={() => recordAnswer(false, "TFoptionF")}><p>False</p></div>
                        
                    </div>
                    <p><label htmlFor="questionAnswer">Please explain your reasoning:</label></p>
                    <textarea id="questionAnswer" name="questionAnswer" rows="5" cols="40"></textarea>
                    <p className="hideDescription" id="requiredLabelOE" style={{color:"red"}}>* This is required</p>
                </div> : null}
              
                <div id="nextButton" onClick={(e) => nextItem(e)}>
                    <p>Next</p>
                </div>
                <p className="pageNote"><i>Note: you <b>cannot go back</b> after proceeding.</i></p>
                <p id='proceeding' className='hideDescription'>Proceeding...</p>

              </div>
        
        </div>
     
      </div>}
    
    </div>

  );
}

export default ConstructionItemComponent;
