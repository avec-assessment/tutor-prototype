'use client'
import { useEffect, useState } from 'react';
import embed from 'vega-embed';
import * as vl from 'vega-lite-api';
import { useRouter} from 'next/navigation'


const UsabilityCheck = (props) => {
  const router = useRouter()
  const [currentItem, setCurrentItem] = useState(props.mode+props.item);
  const [itemBank, SetItemBank] = useState(props.item_bank);
  const [tileSets, setTileSets] = useState(props.tile_sets);
  const [currentChartType, setCurrentChartType] = useState("bar");
  const [dataset, setDataset] = useState(props.item_bank["datasets"][props.item_bank[props.mode+props.item]["dataset"]]);
  const [pID, setPID] = useState("");
  const [itemAnswer, setItemAnswer] = useState("no answer");
  const [usabilityItemAnswers, setUsabilityItemAnswers] = useState({"q0": 0, "q1": 0, "q2": 0, "q3": 0, "q4": 0, "q5": 0, "q6": 0, "q7": 0, "q8": 0, "q9": 0 })

  useEffect(() => {      
      const queryString = window.location.search;
      console.log(queryString);
  
      const urlParams = new URLSearchParams(queryString);
      console.log(urlParams)
  
      const prolific_ID = urlParams.get('PROLIFIC_PID')
      console.log(prolific_ID)
      setPID(prolific_ID);

      
    }, [])

  

  let chart_types = Object.keys(tileSets)

  console.log(chart_types)


  let encodings = tileSets[currentChartType]["encodings"];
  console.log(encodings)


  let read_dataset = dataset;
  console.log(read_dataset)
  let data_columns = Object.keys(read_dataset)
  console.log(data_columns)
  


  // record SUS answer
  const recordAnswer = (qid, answer) => {
 
    console.log(qid)
    console.log(answer)
    console.log(usabilityItemAnswers)
    let item_key = "q"+qid
    let update_answers = usabilityItemAnswers
    update_answers[item_key] = answer
    setUsabilityItemAnswers(update_answers)
    console.log(usabilityItemAnswers)
   
    for (let index = 1; index <= 5; index += 1) {
        document.getElementById(item_key+"-"+index.toString()).classList.remove("selectedAnswer")
    }
    document.getElementById(item_key+"-"+answer.toString()).classList.add("selectedAnswer")

    
  }

  const nextItem = (e) => {
    
    console.log("clicking next")
    console.log(itemAnswer)

    let ready = true
    for (var key in usabilityItemAnswers) {
        console.log(key)
        if (usabilityItemAnswers[key] == 0) {
            document.getElementById("usability_"+key).classList.add("highlightRequired")
            document.getElementById("requiredLabel_"+key).classList.add("showDescription")
            document.getElementById("requiredLabel_"+key).classList.remove("hideDescription")
          
            document.getElementById("scrollUp").classList.remove("hideDescription")
            ready = false
        } else {
            document.getElementById("usability_"+key).classList.remove("highlightRequired")
            document.getElementById("requiredLabel_"+key).classList.add("hideDescription")
            document.getElementById("requiredLabel_"+key).classList.remove("showDescription")
        }
    }

    if (ready) {
        document.getElementById("scrollUp").classList.add("hideDescription")
        document.getElementById("proceeding").classList.remove("hideDescription")
  
        let url_pid = "?PROLIFIC_PID=" + pID;
        router.push('/instructions'+url_pid)
    }

  }


  return (
    <div id="globalContainer">
    
    <div id="interactionZone">
        <p><b>{itemBank[currentItem]["question_meta_data"]["question_topic"]}</b></p>
        <hr></hr>
        {itemBank[currentItem]["question_meta_data"]["question_text"].map((question, index) => (
            <div className='usabilityQA' id={"usability_q"+index} key={question}>
                <p><b>{question} <span style={{color:"red"}}>*</span></b> <span style={{color:"red"}} className="hideDescription" id={"requiredLabel_q"+index}>Selection required</span></p>
                <div id="usabilityLabelsContainer">
                    <div className="usabilityChoiceLabel">
                        <label>Strongly Disagree</label>
                        
                    </div >
                    <div className="usabilityChoiceLabel">
                        
                    </div>
                    <div className="usabilityChoiceLabel">
                        
                    </div>
                    <div className="usabilityChoiceLabel">
                        
                    </div>
                    <div className="usabilityChoiceLabel">
                        <label>Strongly Agree</label>
                        
                    </div>
                    
                </div>
                <div id="usabilityChoiceOptionContainer">
                    <div className="usabilityChoiceOption" id={"q"+index+"-1"} onClick={() => recordAnswer(index, 1)}><p>1</p></div>
                    <div className="usabilityChoiceOption" id={"q"+index+"-2"} onClick={() => recordAnswer(index, 2)}><p>2</p></div>
                    <div className="usabilityChoiceOption" id={"q"+index+"-3"} onClick={() => recordAnswer(index, 3)}><p>3</p></div>
                    <div className="usabilityChoiceOption" id={"q"+index+"-4"} onClick={() => recordAnswer(index, 4)}><p>4</p></div>
                    <div className="usabilityChoiceOption" id={"q"+index+"-5"} onClick={() => recordAnswer(index, 5)}><p>5</p></div>
                    
                </div>
                <hr></hr>
            
            </div>
        ))}
        <div className='usabilityQA'>
            <p><label htmlFor="usabilityQuestionAnswer"><b>If you have any additional reasoning or comments, please enter them below:</b></label></p>
            <textarea id="usabilityQuestionAnswer" name="usabilityQuestionAnswer" rows="2" cols="35" placeholder='Optional'></textarea>
        </div>
        <p className="pageNote"><i>Note: you <b>cannot go back</b> after proceeding.</i></p>
        
        <p id='scrollUp' className='hideDescription'><span style={{color:"red"}}>Please answer all questions marked with *</span></p>
        <div id="nextButton" onClick={(e) => nextItem(e)}>
            <p>Next</p>
        </div>
        <p id='proceeding' className='hideDescription'>Proceeding...</p>
        
        
     
      </div>
    
    </div>

  );
}

export default UsabilityCheck;
