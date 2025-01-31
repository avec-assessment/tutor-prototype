'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'


const TrainingInstructions = () => {
    const router = useRouter()
    const [pID, setPID] = useState("");
    const [overview, setOverview] = useState(false);

    
    useEffect(() => {
          const queryString = window.location.search;
          console.log(queryString);
      
          const urlParams = new URLSearchParams(queryString);
          console.log(urlParams)
      
          const prolific_ID = urlParams.get('PROLIFIC_PID')
          console.log(prolific_ID)
          setPID(prolific_ID);

        }, [])

    // console.log(question.question)
    const beginSurvey = (e) => {
      setOverview(true)
    }

    const nextItem = (e) => {
    
        console.log("clicking next")
        document.getElementById("proceeding").classList.remove("hideDescription")
        let url_pid = "?PROLIFIC_PID=" + pID;
        router.push('/start101'+url_pid)

      }

    return (
        <div>
            {(!overview) ?
            <div id='questionContainer'>
              <div>
                <h2>Purpose</h2>
                <p>We are developing a test to measure people's ability to <b>create charts</b>. To develop this test, we have created a series of questions about a dataset and will ask you to create a chart to answer each of those questions.</p>
                <h2>Dataset Description</h2>
                <p>Each question asks about a subset of the variables in the dataset, which are described below:</p>
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

                <h2>What to Expect</h2>
                <div>
                  <p>There are two sections in this survey: the training section and the main section</p>
                  <ul>
                    <li><b>Training Section:</b> we will ask you to reproduce charts using the survey interface. This is to help you get familiar with the functionalities of the survey interface.</li>
                    <li><b>Main Section:</b> we will ask you to create your own charts for answering true-or-false questions.</li>
                  </ul>
                </div>
              </div>
              <div id="nextButton" onClick={(e) => beginSurvey(e)}>
                  <p>Begin</p>
              </div>
            </div>
            :
            <div id='questionContainer'>
            <div>
                <h3>Instructions for Training Section</h3>
                <br></br>
                <p><b>You are about to begin the training section.</b></p>
                <p>The training section will help you get familiar with the survey interface.</p>
                <p>There are <b>5 questions</b> in this section, followed by a short survey.</p>
                <p>This section is expected to take approximately 5 minutes.</p>
                <p>For successful completion, you must answer each training question correctly.</p>
                <br></br>
                <p><i>Note you <b>will not be able to go back</b> once you advance to the next question.</i></p>
                <p>Click 'Start Training' to proceed.</p>
            </div>
            <div id="nextButton" style={{width:"fit-content", paddingLeft:"0.5rem", paddingRight:"0.5rem"}} onClick={(e) => nextItem(e)}>
                <p>Start Training</p>
            </div>
            <p id='proceeding' className='hideDescription'>Proceeding...</p>
            </div> }

        </div>
        
        
    );
  };
  
  export default TrainingInstructions;