var express = require("express");
const router = express.Router();
const {vicsDB} = require("../classes/MiDBManager");
const Miftp = require("../classes/MiFtp");
const MiVics = require("../classes/MiVics");
const path = require('path');

vicsDB.findAll()
.then(list => {
    //console.log(list);
})

router.get('/', async (req, res)=>{
    try {
        const list = await vicsDB.findAll();
        res.status(201).json(list);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post('/', async (req, res)=>{
    const addVics = req.body;
    try{
        const result = await vicsDB.insert(addVics);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.put('/', async (req, res)=>{
    const updateVics = req.body;
    try{
        const result = await vicsDB.update(updateVics);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json(err);
    }

})

router.delete('/', async (req, res)=>{
    const DeleteVICS = req.body;
    try{
        const result = await vicsDB.remove(DeleteVICS);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post('/camera', async (req, res)=>{
    const findVICS = req.body;
    //console.log(findVICS);
    
    try{
        const vicsClient = new MiVics(findVICS.vicsip, Number(findVICS.vicsport));
        const cameralist = await vicsClient.getVicsCameraList();
        res.json(cameralist);
    } catch (err) {
        console.log(err.message);
        res.status(400).json(err.message);
    }
})

async function checkVicsFtpIsOnline(req, res, next) {
    const capturevics = req.body; // ftpip, ftpport, ftpuserid, ftppassword, vicsip, vicsport, vicscamid, width, height
    const FTPClient = new Miftp(capturevics.ftpip, capturevics.ftpport, capturevics.ftpuserid, capturevics.ftppassword);
    const vicsClient = new MiVics(capturevics.vicsip, Number(capturevics.vicsport));
  
    try {
      await FTPClient.connect();
      await vicsClient.getVicsCameraList();
      FTPClient.disconnect();
      next();
    } catch (err) {
        res.status(400).end(err.message);
    }
}

router.post('/check/ftp', async (req, res)=> {
    const capturevics = req.body; // ftpip, ftpport, ftpuserid, ftppassword
    const FTPClient = new Miftp(capturevics.ftpip, capturevics.ftpport, capturevics.ftpuserid, capturevics.ftppassword);
    try {
        const result = await FTPClient.connect();
        res.status(201).send(result);
    } catch (err) {
        //console.log(err.message);
        res.status(400).end(err.message);
    }
    
})


router.post('/capture/ftp', checkVicsFtpIsOnline, async (req, res)=> {
    const capturevics = req.body; // ftpip, ftpport,ftpuserid, ftppassword, vicsip, vicsport, vics camid, width, height, path,pathformat, pannelname cellname
    const FTPClient = new Miftp(capturevics.ftpip, capturevics.ftpport, capturevics.ftpuserid, capturevics.ftppassword, capturevics.ftppathformat);
    const vicsClient = new MiVics(capturevics.vicsip, Number(capturevics.vicsport));
    
    try {
        await FTPClient.connect();
        const img = await vicsClient.getVicsCameraImage(capturevics.camid, capturevics.width, capturevics.height);
        const dataBuffer = Buffer.from(img);
        const date = new Date();
        const datetime = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
        let filePath = path.join(capturevics.ftppath, `${datetime}_${capturevics.pannelname}_${capturevics.cellname}_${capturevics.camname}.jpeg`);
        await FTPClient.uploadFileBinary(dataBuffer, filePath);
        await FTPClient.disconnect();
        res.end(filePath);
    } catch (err) {
        //console.log(err.message);
        res.status(400).end(err.message);
    }
})


module.exports = router