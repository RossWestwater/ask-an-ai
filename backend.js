const port = 5000
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors())

app.get('/response/:prompt', (req, res) => {
      const response = 
        {
          url: `https://api.openai.com/v1/engines/text-curie-001/completions`,
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.REACT_APP_OPENAI_API_KEY,
          },
          data: {
            prompt: req.params.prompt,
            max_tokens: 200,
            temperature: 1,
          }
        }
      axios.request(response)
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        console.log(error);
      })

})


app.listen(process.env.PORT || port, () => console.log(`server is running on PORT: ${port}`))

