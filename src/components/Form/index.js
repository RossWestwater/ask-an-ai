import { useState, useEffect } from "react";
import API_Key from "../../assets/secret";
import History from "../History";

function Form(props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState([]);
  const slicedHist = history.slice(1)

  useEffect(() => {
    // console.log("updated prompt", question);
    // console.log("updated answer", answer);
    // console.log("updated history", history);
  }, [question, answer, history]);

  const handleSubmit = async (e) => {
    let prompt = document.getElementById("question").value;
    e.preventDefault();

    const response = await fetch(
      `https://api.openai.com/v1/engines/text-curie-001/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_Key}`,
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 5,
          temperature: 1,
          n: 2,
        }),
      }
    );
    let reply = await response.json();
    await setQuestion(prompt);
    await setAnswer(reply.choices);
    await setHistory([
      { question: prompt, answers: reply.choices },
      ...history,
    ]);
    await console.log(reply);
  };

  return (
    <form id="completion" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="question">Ask a question:</label>
        <br />
        <input id="question" type="text"></input>
      </div>
      <button type="submit">Submit</button>
      {!question && !answer ? null : (
        <main>
          <div>
            You asked: {history[0].question}
            <br />
            Her response:
            <ul>
              {history[0].answers.map((answer) => {
                return <li key={answer.index}>{answer.text}</li>;
              })}
            </ul>
          </div>
          <section>
            Previous Queries:
            {slicedHist.map((input) => {
              console.log(input);
              return (
                <div >
                  <div>You: {input.question}</div>
                  <ul>
                    Her:
                    {input.answers.map((answer) => {
                      return <li key={answer.index}>{answer.text}</li>;
                    })}
                  </ul>
                </div>
              );
            })}
          </section>
        </main>
      )}
    </form>
  );
}

export default Form;
