const edge = require('edge-js');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const assemblyFilePath = path.join(__dirname, '../lib/MiMXComponentWrapper.dll')
const utlTypePLCManager = "MiMXComponentWrapper.UtlTypePLCManager"

const utlInit = edge.func({
    assemblyFile: assemblyFilePath,
    typeName: utlTypePLCManager,
    methodName: 'AddInstance',
});

const utlClose = edge.func({
    assemblyFile: assemblyFilePath,
    typeName: utlTypePLCManager,
    methodName: 'DelInstance',
});

const utlConnect = edge.func({
    assemblyFile: assemblyFilePath,
    typeName: utlTypePLCManager,
    methodName: 'Connect',
});

const utlDisconnect = edge.func({
    assemblyFile: assemblyFilePath,
    typeName: utlTypePLCManager,
    methodName: 'Disconnect',
});


const utlGetCpuType = edge.func({
    assemblyFile: assemblyFilePath,
    typeName: utlTypePLCManager,
    methodName: 'GetCpuType',
});

const utlReadDeviceBlock = edge.func({
    assemblyFile: assemblyFilePath,
    typeName: utlTypePLCManager,
    methodName: 'ReadDeviceBlock',
});

const utlWriteDeviceBlock = edge.func({
    assemblyFile: assemblyFilePath,
    typeName: utlTypePLCManager,
    methodName: 'WriteDeviceBlock',
});

class MiUtlTypePLC {

    constructor (stationnum)
    {
        this.uuid = uuidv4();
        this.stationnum = stationnum;
        this.onlineTimer = setTimeout(this.isOnline, 1000);

        this.Online=false;
    }

    async Connect() {
        return await new Promise((resolve, reject) => {
            utlInit({str:this.uuid, num:this.stationnum}, (err, result) => {
                if(err) {
                    reject(false);
                    console.log.error(err);
                    return;
                }
                if(result === true) {
                    utlConnect({str:this.uuid}, (err, result) => {
                        if(err) reject(err);
                        
                        if(result === 0) {
                            resolve(true);
                        }
                        else {
                            reject(false);
                        }
                        
                    });
                }
                else {
                    reject(false);
                }
                
            });
        })
    }

    async Disconnect() {
        return await new Promise((resolve, reject) => {
            utlDisconnect({str:this.uuid}, (err, result) => {
                if(err) {
                    reject(false);
                    console.log.error(err);
                }

                if(result === 0) {
                    utlClose({str:this.uuid}, (err, result) => {
                        if(err) reject(err);
    
                        resolve(result);
                    });
                }
                else {
                    reject(false);
                }
            });
        })
    }

    async GetCpu() {
        return await new Promise((resolve, reject) => {
            utlGetCpuType({str:this.uuid}, (err, result) => {
                if(err) reject(err);

                resolve(result);
            });
        })
    }

    async ReadDeviceBlock(addr, size) {
        return await new Promise((resolve, reject) => {
            utlReadDeviceBlock({str:this.uuid, szDevice:addr, size:size}, (err, result) => {
                if(err) reject(err);
    
                resolve(result);
            });
        })
    }

    async WriteDeviceBlock(addr, size, data) {
        return await new Promise((resolve, reject) => {
            utlWriteDeviceBlock({str:this.uuid, szDevice:addr, size:size , data:data}, (err, result) => {
                if(err) reject(err);

                if(result === 0) {
                    resolve(true)
                }
                else {
                    reject(false);
                }
            });
        })
    }

}

module.exports = MiUtlTypePLC;