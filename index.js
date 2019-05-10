const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');

const port = 8080;
const url = 'https://api.telegram.org/bot';
const apiToken = process.env.BOTAPIKEY;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.post('/', (req, res) => {
    var quotesContent = require('./quoteswritten.json');
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