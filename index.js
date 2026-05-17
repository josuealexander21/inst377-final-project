import express from 'express';
import bodyParser from 'body-parser';
import * as supabaseClient from '@supabase/supabase-js';
import { isValidStateAbbreviation } from 'usa-state-validator';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;
dotenv.config();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/final-project-home.html');
});


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get('/customers', async (req, res) => {
  console.log('Attempting to get all customers!');

  const { data, error } = await supabase.from('customer').select();

  if (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
  } else {
    console.log('Recieved Data:', data);
    res.json(data);
  }
});

app.post('/customer', async (req, res) => {
  console.log('Adding Customer');
  console.log(`Request: ${JSON.stringify(req.body)}`);

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const state = req.body.state;

  if (!isValidStateAbbreviation(state)) {
    console.log(`State: ${state} is invalid`);
    res.statusCode = 400;
    res.json({
      message: `${state} is not a valid 2 Letter Abbreviation for State`,
    });
    return;
  }

  const { data, error } = await supabase
    .from('customer')
    .insert({
      customer_first_name: firstName,
      customer_last_name: lastName,
      customer_state: state,
    })
    .select();

  if (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
  } else {
    res.json(data);
  }
});

app.listen(port, () => {
  console.log(`App is available on port: ${port}`);
});
