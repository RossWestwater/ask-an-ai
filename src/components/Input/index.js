import { useState, useEffect } from "react";
import { Button, Form, Card } from 'react-bootstrap';

function Input() {
  const [history, setHistory] = useState([]);
  const [initial, setInitial] = useState(false);
  const slicedHist = history.slice(1);

  useEffect(() => {}, [history, initial]);

  const handleSubmit = async (e) => {
    let prompt = document.getElementById("question").value;
    e.preventDefault();
    let reply;
    try {
      const response = await fetch(
        `https://api.openai.com/v1/engines/text-curie-001/completions`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.REACT_APP_OPENAI_API_KEY,
          },
          body: JSON.stringify({
            prompt: prompt,
            max_tokens: 30,
            temperature: 1,
            n: 2,
          }),
        }
      );
      reply = await response.json();
      await setHistory([
        { question: prompt, answers: reply.choices, id: reply.id },
        ...history,
      ]);
      await setInitial(true);
    } catch (error) {
      return error;
    }
  };

  return (
    <Form id="completion" onSubmit={handleSubmit} className="container-fluid m-0 bg-light vh-100">
      <div className="pb-3 border-bottom border-secondary">
        <Form.Label className="pt-3" htmlFor="question"><h3>Ask a question:</h3></Form.Label>
        <br />
        <Form.Control id="question" type="text"></Form.Control>
      <Button className="mt-3" type="submit">Submit</Button>
      </div>
      {initial === false ? null : (
        <section className="bg-light row">
          <Card className="mt-5 mb-5 col-10 mx-auto border-success">
            <div className="">
            <div className=""><b>You asked:</b> <u>{history[0].question}</u></div>
            <div className=""><b>response:</b></div>
            </div>
            <ul>
              {history[0].answers.map((answer) => {
                return <li className="" key={answer.index}>{answer.text}</li>;
              })}
            </ul>
          </Card>
          {history.length > 1 && 
          <section>
            <h4 className="pl-2 mb-4">Previous Queries (from newest to oldest):</h4>
              <div className="row mx-auto">
              {slicedHist.map((input) => {
                return (
                  <div className="p-2 col-6" key={input.id}>
                    <div className="border border-info rounded mx-3 p-2"> {input.index}
                      <div><b>You asked:</b> <u>{input.question}</u></div>
                      <div><b>Response:</b><ul>
                        {input.answers.map((answer) => {
                          return <li key={answer.index}>{answer.text}</li>;
                        })}
                      </ul>
                      </div>    
                    </div>
                  </div>
                );
              })}
              </div>
          </section>
          }
        </section>
      )}
    </Form>
  );
}

export default Input;
