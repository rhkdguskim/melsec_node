var express = require("express");
const router = express.Router();
const MiProgTypePLC = require("../classes/MiProgTypePLC");
const MiEventEmmiter = require("../classes/MiEventManager");
const {plcDB} = require("../classes/MiDBManager");
const { v4: uuidv4 } = require('uuid');

const MiPLCMap = new Map();

plcDB.findAll()
.then(list => {
    list.map( async (plc) => {
        const miPlc = new MiProgTypePLC(plc._id,plc.name,plc.ip, Number(plc.port), plc.password, plc.type, MiEventEmmiter);
        MiPLCMap.set(plc._id, miPlc);
        const vicsinfo = [{vicsid:plc.vicsid, cameralist:plc.cameralist}];
        miPlc.setVicsinfo(vicsinfo); 
        miPlc.setAddr('M16', 'M1',"D1000",9, 500);
        try {
            const data = await miPlc.connect()
        } catch (err) {
            //console.log(err);
        }
    })
});

router.get('/', async (req, res)=>{
    try {
        const list = await plcDB.findAll();
        res.status(201).json(list);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post('/', async (req, res)=>{
    const addPLC = req.body;
    try{
        const result = await plcDB.insert(addPLC);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.put('/', async (req, res)=>{
    const updatePLC = req.body;
    try{
        const result = await plcDB.update(updatePLC);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.delete('/', async (req, res)=>{
    const DeletePLC = req.body;
    try{
        const result = await plcDB.remove(DeletePLC);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post('/getdevice', async (req, res) => {
    const _id = req.body._id;
    const addr = req.body.addr;
    try {
        const data = await MiPLCMap.get(_id).getDevice(addr);
        res.send(data);
    } catch(err) {
        res.status(500).json(err);
    }
    
})

router.post('/setdevice', async (req, res) => {
    const _id = req.body._id;
    const addr = req.body.addr;
    const value = req.body.value;
    try {
        const data = await MiPLCMap.get(_id).setDevice(addr, Number(value));
        res.send(data);
    } catch(err) {
        res.status(500).json(err);
    }
})

router.post('/readdeviceblock', async (req, res) => {
    const _id = req.body._id;
    const addr = req.body.addr;
    const size = req.body.size;
    try {
        const data = await MiPLCMap.get(_id).readDeviceBlock(addr, Number(size));
        res.send(data);
    } catch(err) {
        res.status(500).json(err);
    }
    
})

router.post('/writedeviceblock', async (req, res) => {
    const _id = req.body._id;
    const addr = req.body.addr;
    const value = req.body.value;
    try {
        const data = await MiPLCMap.get(_id).writeDeviceBlock(addr, String(value));
        res.send(data);
    } catch(err) {
        res.status(500).json(err);
    }
})

router.post('/setaddr', (req, res) => {
    const _id = req.body._id;
    const addr = req.body.addr;
    const time = req.body.time;
    MiPLCMap.get(_id).setAddr(addr, time);
    const data = MiPLCMap.get(_id).startCheck();
    res.send(data);
})


router.post('/online', async (req, res) => {
    const ip = req.body.ip;
    const port = req.body.port;
    const password = req.body.password;
    const type = {
        ActProtocolType:5, // PROTOCOL_TCPIP(5)
        ActCpuType:210, // CPU_Q04UDVCPU(210)
        ActUnitType:44, // UNIT_QNETHER(44)
        ActTimeOut:2000, // Connection Timeout
    }
    const uuid = uuidv4();
    const PLC = new MiProgTypePLC(uuid,"Fake", ip, Number(port), password, type);
    try {
        const result = await PLC.isOnline();
        console.log(result);
        if(result === true) {
            res.status(201).json({online:true});
        }
        else {
            res.status(201).json({online:false});
        }
    } catch (err) {
        res.status(500).json({online:false});
        console.log(err);
    } finally {
        try {
            await PLC.disconnect();
        } catch (err) {
            console.log(err);
        }
    }
})


module.exports = router;