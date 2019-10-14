// DOTENV CONFIG
require('dotenv').config();

const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;

// Telegram Config
const url = 'https://api.telegram.org/bot';
const apiToken = process.env.BOTAPIKEY;

let quotesContent = require('./quoteswritten.json');
// Middleware Config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.enable('trust proxy', true);
app.disable('x-powered-by');

/**
 * CORS
 */

app.use((req, res, next) => {
    req.userip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT, DELETE');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, authtoken, contentType, Content-Type, authorization'
    );
    next();
});

app.post('/', (req, res) => {
    var random = quotesContent.quoteswritten[Math.floor(Math.random() * quotesContent.quoteswritten.length)];
    const chatId = req.body.message.chat.id;
    const sentMessage = req.body.message.text || req.body.message.sticker.file_id;
    if (sentMessage.match(/start/gi)) {
        axios.post(`${url}${apiToken}/sendMessage`, {
            chat_id: chatId,
            text: 'Hi I am Bot 🤖',
        })
            .then((response) => {
                res.status(200).send(response);
            }).catch((error) => {
                res.send(error);
            });
    } else if (sentMessage.match(/quotes/gi)) {
        axios.post(`${url}${apiToken}/sendMessage`, {
            chat_id: chatId,
            text: random.quotes,
        })
            .then((response) => {
                res.status(200).send(response);
            }).catch((error) => {
                res.send(error);
            });
    } else {
        axios.post(`${url}${apiToken}/sendMessage`, {
            chat_id: chatId,
            text: 'Request not understood,\nSorry Sir/Madam I am not Programmed for All Keywords\nUse this Below Commands\n/start\n/quotes',
        })
            .then((response) => {
                res.status(200).send(response);
            }).catch((error) => {
                res.send(error);
            });
    }
});


// 404 handler

app.use((req, res) => {
    res.status(404).json({
        error: 1,
        message: 'URL Not Found'
    });
});

// Listenting Server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

