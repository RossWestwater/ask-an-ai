import { useState, useEffect } from "react";
import API_Key from "../../assets/secret";

function Form() {
  const [history, setHistory] = useState([]);
  const [initial, setInitial] = useState(false);
  const slicedHist = history.slice(1);

  useEffect(() => {}, [history, initial]);

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

    await setHistory([
      { question: prompt, answers: reply.choices, id: reply.id },
      ...history,
    ]);
    await setInitial(true);
  };

  return (
    <form id="completion" onSubmit={handleSubmit} className="form">
      <div>
        <label htmlFor="question">Ask a question:</label>
        <br />
        <input id="question" type="text"></input>
      </div>
      <button type="submit">Submit</button>
      {initial === false ? null : (
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
            Previous Queries (from newest to oldest):
            <ol>
              {slicedHist.map((input) => {
                return (
                  <div key={input.id}>
                    <li>
                      <div>You: {input.question}</div>
                      Her:
                      <ul>
                        {input.answers.map((answer) => {
                          return <li key={answer.index}>{answer.text}</li>;
                        })}
                      </ul>
                    </li>
                  </div>
                );
              })}
            </ol>
          </section>
        </main>
      )}
    </form>
  );
}

export default Form;
