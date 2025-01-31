'use client'
import { useEffect, useState } from 'react';
import embed from 'vega-embed';
import * as vl from 'vega-lite-api';
import { useRouter } from 'next/navigation'


const FinalInstructions = (props) => {
  const router = useRouter()
  const [pID, setPID] = useState("");


  useEffect(() => {
      const queryString = window.location.search;
      console.log(queryString);
  
      const urlParams = new URLSearchParams(queryString);
      console.log(urlParams)
  
      const prolific_ID = urlParams.get('PROLIFIC_PID')
      console.log(prolific_ID)
      setPID(prolific_ID);

    }, [])


  const nextItem = (e) => {
    
    console.log("clicking next")
    let current_item = props.item;
    let next_item = current_item + 1
    console.log(next_item)
    document.getElementById("proceeding").classList.remove("hideDescription")
    let url_pid = "?PROLIFIC_PID=" + pID;
    router.push('/Q1'+url_pid)

  }


  return (
    <div>
         <div id='questionContainer'>
                <h3>Instructions for Main Section</h3>
                <br></br>
                <p><b>You are now about to begin the main section.</b></p>
                <p>The layout of each question in this section will be the same as the training you just completed.</p>
                <p>In each question, you will be asked to <b>create your own chart</b> to determine whether a true-or-false statement is true.</p>
                <p>The given data for each question may be different, but they will all involve the following variables.</p>
                
                <h4><b>Please familiarize yourself with these variables before clicking start.</b></h4>
                <ul>
                  <li><p><b>Date:</b> A recorded date (year-month-date) to track daily spending, income, or savings.</p></li>
                  <li><p><b>Month:</b> The month.</p></li>
                  <li><p><b>Year:</b> The year.</p></li>
                  <li><p><b>Income:</b> The amount of income ($) on each recorded date.</p></li>
                  <li><p><b>Savings:</b> The amount of savings ($) on each recorded date.</p></li>
                  <li><p><b>Spending:</b> The amount of spending ($) on each recorded date. Note that in this hypothetical dataset, the person spends money on <b>only one spending category each day</b>.</p></li>
                  <li><p><b>Spending_Category:</b> Daily spending category: Entertainment, Food, Transport, or Utilities.</p></li>
                </ul>
                <p><b>Example dataset</b></p>
                <table>
                  <tbody>
                    <tr>
                      <th>Date</th>
                      <th>Month</th>
                      <th>Year</th>
                      <th>Income ($)</th>
                      <th>Savings ($)</th>
                      <th>Spending ($)</th>
                      <th>Spending_Category</th>
                    </tr>
                    <tr>
                      <td>2020-01-01</td>
                      <td>Jan</td>
                      <td>2020</td>
                      <td>385.9009</td>
                      <td>1.1013</td>
                      <td>20.1875</td>
                      <td>Transport</td>
                    </tr>
                    <tr>
                      <td>2020-01-02</td>
                      <td>Jan</td>
                      <td>2020</td>
                      <td>329.3144</td>
                      <td>11.9506</td>
                      <td>18.1575</td>
                      <td>Entertainment</td>
                    </tr>
                    <tr>
                      <td>2020-01-03</td>
                      <td>Jan</td>
                      <td>2020</td>
                      <td>194.1463</td>
                      <td>13.7701</td>
                      <td>6.2867</td>
                      <td>Utilities</td>
                    </tr>
                    <tr>
                      <td>2020-01-04</td>
                      <td>Jan</td>
                      <td>2020</td>
                      <td>300.3048</td>
                      <td>15.8312</td>
                      <td>14.0083</td>
                      <td>Transport</td>
                    </tr>
                    <tr>
                      <td>2020-01-05</td>
                      <td>Jan</td>
                      <td>2020</td>
                      <td>332.1857</td>
                      <td>1.1498</td>
                      <td>22.9455</td>
                      <td>Food</td>
                    </tr>
                    <tr>
                      <td>...</td>
                      <td>...</td>
                      <td>...</td>
                      <td>...</td>
                      <td>...</td>
                      <td>...</td>
                      <td>...</td>
                    </tr>
                  </tbody>
                </table>
                <br></br>
                <p>There are <b>11 questions</b> in this section.</p>
                <p>This section is expected to take approximately 25 minutes.</p>
                {/* <p>{itemBank[currentItem]["question_meta_data"]["question_text"]}</p> */}
                <p>For successful completion, you must answer all of the required questions in this section.</p>
                <br></br>
                <p><i>Note you <b>will not be able to go back</b> once you advance to the next question.</i></p>
                <p>Click 'Start' to proceed.</p>
                <div id="nextButton" style={{marginBottom:"6rem"}} onClick={(e) => nextItem(e)}>
                  <p>Start</p>
                </div>
                <p id='proceeding' className='hideDescription'>Proceeding...</p>
            </div>

    </div>

  );
}

export default FinalInstructions;
