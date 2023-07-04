const EventEmitter = require('events');
const Miftp = require("./MiFtp");
const dotenv = require('dotenv').config();
const MiVics = require("../classes/MiVics");
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const logger = require('../classes/MiLogger');

const {plcDB,vicsDB} = require("../classes/MiDBManager");

class MiEventManager {
    constructor()
    {
        this.eventEmmiter = new EventEmitter();
    }

}

const EventManager = new MiEventManager();

const FTPClient = new Miftp(process.env.FTPIP, process.env.FTPPORT, process.env.FTPID, process.env.FTPPW);

FTPClient.connect()
.then(() => {
    EventManager.eventEmmiter.on('plcreq', async (data) => {
        //console.log(data)
        try {
            switch(data.cmd)
            {
                case 'capturevics':
                    const directoryPath = path.resolve(`./temp`);
                    // VICS 카메라 캡처후 전송해야함.
                    await Promise.all(data.vics.map(async (item) => {
                        const vics = await vicsDB.findOne({_id:item.vicsid});
                        const vicsClient = new MiVics(vics.ip, Number(vics.port));
                        await Promise.all(item.cameralist.map( async (item) => {
                            const date = new Date();
                            const image = await vicsClient.getVicsCameraImage(item, 1980, 1080);
                            const fileName = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
                            const filePath = path.join(directoryPath, `${data.name}_${fileName}_${item}_${data.cellid}.jpeg`);
                            await fs.promises.writeFile(filePath, image)
                        }))
                    })).then( async () => {
                        const files = await readdir(directoryPath);
                        const myfile = {path:directoryPath, files:files};
                        const fileList = []
                            myfile.files.map((file) => {
                                const filepath = path.join(myfile.path, file);
                                fileList.push(filepath);
                        })
                        FTPClient.uploadFileList(fileList)
                        .then(() => {
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                        logger.info(`fileSent Succeccfully`);
                        EventManager.eventEmmiter.emit(`plcresp/${data.id}`);
                    })
                break;
    
                default:
                    break;
            }
        } catch (err) {
            console.log(err);
        }
        
    })

})

EventManager.eventEmmiter.on('sensor', (data) => {
    
})

module.exports = EventManager;