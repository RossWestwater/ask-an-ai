import { useState, useEffect } from 'react';
import API_Key from '../../assets/secret'

function Form(props) {
  const [ question, setQuestion ] = useState('')
  const [ answer, setAnswer ] = useState('')

  useEffect(() => {
    console.log('updated state', question);
    console.log('updated state', answer);
  }, [question, answer])

  const handleSubmit = async (e) => {
    let prompt = document.getElementById('question').value
    e.preventDefault();
    
    await console.log(API_Key);
    const response = await fetch(`https://api.openai.com/v1/engines/text-curie-001/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_Key}`
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 20,
        temperature: 1,
        n: 2
      })
    })
    let reply = await response.json()
    await setQuestion(prompt)
    await setAnswer(reply.choices)
    await console.log('reply',reply);
    await console.log('answer',answer);
  }

  return (
    <form id="completion" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="question">Ask a question:</label>
        <br/>
        <input id="question" type="text"></input>
      </div>
      <button type="submit">Submit</button>
      {!question && !answer ? null : 
      <div> You asked: {question}
      <br/>
      Her response:
      <ul>
        {answer.map((answer) => {
          return (
            <li>{answer.text}</li>
          )
        })
        }
      </ul>
      </div>
      }
    </form>
  )
}

export default Form;
