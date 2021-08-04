import express from 'express';
import { processing } from './resData.js';

const app = express()
const port = 3000

app.get('/dashboard/:role/:codeFarm', processing);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})