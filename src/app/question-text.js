const QuestionText = (question) => {

    return (
        <div>
            <div id='questionContainer'>
                <p><b>{question.question.question_topic}</b></p>
                <p><i>{question.question.question_text}</i></p>
            </div>
        </div>
        
        
    );
  };
  
  export default QuestionText;