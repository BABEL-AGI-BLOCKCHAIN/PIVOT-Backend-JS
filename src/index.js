import app from './app.js' ;
import { configDotenv } from 'dotenv';
import initEventListeners from './events/eventListener.event.js';

configDotenv();
const port = process.env.PORT || 5000 ;

initEventListeners();

app.get('/', (req, res) => {
    res.send('Hello World!') ;
})

app.listen(port , () => {
    console.log(`Server is running on port http://localhost:${port}`) ;
})