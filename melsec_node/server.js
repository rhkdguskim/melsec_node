const plc = require('./routes/plc');
const vics = require('./routes/vics');
const user = require('./routes/user');
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const logger = require('./classes/MiLogger');
var cors = require('cors');
const path = require("path");

app.use(express.static(path.join(__dirname, './build')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({
  origin: '*',  // 모든 도메인에서 요청 허용
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // 허용하는 HTTP 메소드
  allowedHeaders: ['Content-Type', 'Authorization']  // 허용하는 HTTP 헤더
}));

app.use((req, res, next) => {
res.header("Access-Control-Allow-Origin", "*");
 next();
});

app.use('/user', user);
app.use('/plc', plc);
app.use('/vics', vics);

app.listen(process.env.PORT, () => {
    logger.info(`server is listening on port ${process.env.PORT}`);
});