const edge = require('edge-js');
const path = require('path');
const EventEmitter = require('events');
const logger = require('../classes/MiLogger');

const assemblyFilePath = path.join(__dirname, '../lib/MiMXComponentWrapper.dll')
const ProgTypePLCManager = "MiMXComponentWrapper.ProgTypePLCManager"

const progInit = (arg1) => {
    return new Promise((resolve, reject) => {
        edge.func({
            assemblyFile: assemblyFilePath,
            typeName: ProgTypePLCManager,
            methodName: 'AddInstance',
        })(arg1, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
              }
        });
    });
}

const progClose = (arg1) => {
    return new Promise((resolve, reject) => {
        edge.func({
            assemblyFile: assemblyFilePath,
            typeName: ProgTypePLCManager,
            methodName: 'DelInstance',
        })(arg1, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
              }
        });
    });
}

const progConnect = (arg1) => {
    return new Promise((resolve, reject) => {
    edge.func({
        assemblyFile: assemblyFilePath,
        typeName: ProgTypePLCManager,
        methodName: 'Connect',
      })(arg1, (error, result) => {
        if (error) {
            reject(error);
        } else {
            resolve(result);
          }
      });
    });
}

const progDisconnect = (arg1) => {
    return new Promise((resolve, reject) => {
        edge.func({
            assemblyFile: assemblyFilePath,
            typeName: ProgTypePLCManager,
            methodName: 'Disconnect',
        })(arg1, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
                }
            });
    });
}


const progGetCpuType = (arg1) => {
    return new Promise((resolve, reject) => {
        edge.func({
            assemblyFile: assemblyFilePath,
            typeName: ProgTypePLCManager,
            methodName: 'GetCpuType',
        })(arg1, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
                }
            });
    });
}

const progReadDeviceBlock = (arg1) =>
{
    return new Promise((resolve, reject) => {
        edge.func({
            assemblyFile: assemblyFilePath,
            typeName: ProgTypePLCManager,
            methodName: 'ReadDeviceBlock',
        })(arg1, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
                }
            });
    });
}


const progWriteDeviceBlock = (arg1) => {
    return new Promise((resolve, reject) => {
        edge.func({
            assemblyFile: assemblyFilePath,
            typeName: ProgTypePLCManager,
            methodName: 'WriteDeviceBlock',
        })(arg1, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
                }
            });
    });
} 

const progGetDevice = (arg1) => {
    return new Promise((resolve, reject) => {
        edge.func({
            assemblyFile: assemblyFilePath,
            typeName: ProgTypePLCManager,
            methodName: 'GetDevice',
        })(arg1, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

const progSetDevice = (arg1) => {
    return new Promise((resolve, reject) => {
        edge.func({
            assemblyFile: assemblyFilePath,
            typeName: ProgTypePLCManager,
            methodName: 'SetDevice',
        })(arg1, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

const progReadBuffer = (arg1) => {
    return new Promise((resolve, reject) => {
        edge.func({
            assemblyFile: assemblyFilePath,
            typeName: ProgTypePLCManager,
            methodName: 'ReadBuffer',
        })(arg1, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
 }


const progWriteBuffer = (arg1) => {
    return new Promise((resolve, reject) => {
        edge.func({
            assemblyFile: assemblyFilePath,
            typeName: ProgTypePLCManager,
            methodName: 'WriteBuffer',
        })(arg1, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
 }

const progCheckControl = (arg1) => {
    return new Promise((resolve, reject) => {
        edge.func({
            assemblyFile: assemblyFilePath,
            typeName: ProgTypePLCManager,
            methodName: 'CheckControl',
        })(arg1, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
 }


class MiProgTypePLC {
    constructor (id, name, ip, port , password, type, eventmanager)
    {
        this.uuid = id;
        this.name = name;
        this.ip = ip;
        this.port = port;
        this.password = password;
        this.Online=false;
        this.miPLCEventManager = eventmanager;
        this.miPLCInternal = new EventEmitter();
        this.RegEvent();
        const defaultType = {
            ActProtocolType: 5, // PROTOCOL_TCPIP(5)
            ActCpuType: 210, // CPU_Q04UDVCPU(210)
            ActUnitType: 44, // UNIT_QNETHER(44)
            ActBaudRate: 19200,
            ActConnectUnitNumber: 0,
            ActControl: 8,
            ActCpuTimeOut: 0,
            ActDataBits: 8,
            ActDestinationIONumber: 0,
            ActDestinationPortNumber: 0,
            ActDidPropertyBit: 1,
            ActDsidPropertyBit: 1,
            ActIntelligentPreferenceBit: 0,
            ActIONumber: 1023,
            ActMultiDropChannelNumber: 0,
            ActNetworkNumber: 0,
            ActPacketType: 1,
            ActParity: 1,
            ActSourceNetworkNumber: 0,
            ActSourceStationNumber: 0,
            ActStationNumber: 255,
            ActStopBits: 0,
            ActSumCheck: 0,
            ActTargetSimulator: 0,
            ActThroughNetworkType: 0,
            ActTimeOut: 1000,
            ActUnitNumber: 0,
          };
        
          this.type = {
            ...defaultType,
            ...type,
          };
    }
    RegEvent() {
        //console.log("Reg event")
        this.miPLCEventManager.eventEmmiter.on(`plcresp/${this.uuid}`, (data) => {
            // if(this.status === true)
            //     console.log("PLC Need to be LOW !!");

            // this.setDevice(this.writeaddr, 0);
        });

        this.miPLCInternal.on("online", () => {
            logger.info(`${this.name} : ${this.ip}: ${this.port} PLC is Online`)
            this.clearCheckOnline();
            this.startCheck();
        })

        this.miPLCInternal.on("offline", () => {
            logger.info(`${this.name} : ${this.ip}: ${this.port} PLC is Offline`)
            this.checkOnline();
            this.stopCheck();
            progDisconnect({str:this.uuid});

        })

        this.miPLCInternal.on("event", (data) => {
            //console.log("event occur : " , data);
            // this.status = data;
            this.setDevice(this.writeaddr, Number(data));

            // if(data) {
            //     this.setDevice(this.writeaddr, 1);
            // }
        })
    }
    

    setAddr(readaddr, writeaddr,cellidaddr, cellidsize, time) {
        this.readaddr = readaddr;
        this.writeaddr = writeaddr;
        this.cellidaddr = cellidaddr;
        this.cellidsize = cellidsize;
        this.time = time;
    }

    setEventManager() {
        this.eventManager = eventManager;
    }

    setVicsinfo(vicsinfo) {
        this.vicsinfo = vicsinfo;
    }

    getVicsinfo() {
        return this.vicsinfo;
    }

    checkOnline() {
        const uuid = this.uuid;
        const eventManager = this.miPLCInternal;
        if(this.checkOnlinetimer)
            this.clearCheckOnline();

        this.checkOnlinetimer = setInterval(async () => {
            try {
            const result = await progConnect({str:uuid})

            if(result.returnCode === '0x00000000') {
                eventManager.emit("online");
            }
            else {
                logger.error(this.ip, result)
            }
            } catch (err) {
                logger.error(err);
            }
        }, (this.type.ActTimeOut));
    }

    clearCheckOnline() {
        clearInterval(this.checkOnlinetimer);
    }

    startCheck() {
        const name = this.name;
        const szDevice = this.readaddr;
        const cellidaddr = this.cellidaddr;
        const cellidsize = this.cellidsize;
        const intervaltime = this.time;
        const uuid = this.uuid;
        const vicsinfo = this.vicsinfo;
        const eventManager = this.miPLCEventManager;
        const internaleventManager = this.miPLCInternal;
        let status = false;
        if(this.checkAddrtimer)
            this.stopCheck()

        this.checkAddrtimer = setInterval(async () => {
            const result = await progGetDevice({str:uuid, szDevice:szDevice});
                if(result.returnCode === '0x00000000') {
                    //console.log(result.data);
                    if((result.data) && (status===false)) {
                        const readdata = await progReadDeviceBlock({str:uuid, szDevice:cellidaddr, size:cellidsize});// Cellid 불러오기
                        logger.info(`Event Occured!!`);
                        eventManager.eventEmmiter.emit("plcreq", {cmd:"capturevics",vics:vicsinfo , id:uuid, cellid:readdata.data, name:name});
                        status = true;
                        internaleventManager.emit("event", status);
                    }
                    else if((!result.data) && (status===true)) {
                        status = false;
                        internaleventManager.emit("event", status);
                    }
                }
                else {
                    internaleventManager.emit("offline");
                }
        }, (intervaltime));
    }

    stopCheck() {
        clearInterval(this.checkAddrtimer);

        return true;
    }

    async isOnline() {
        return await new Promise( async (resolve, reject) => {
            try {
                const result = await progInit({str:this.uuid, ip:this.ip, port:this.port, password:this.password, type:this.type})
                if(result.returnCode === '0x00000000') {
                    //console.log(this.ip, ":",this.port, "Init OK ");
                    const connect = await progConnect({str:this.uuid});
                    //console.log(connect);
                    if(connect.returnCode === '0x00000000') {
                        this.disconnect();
                        resolve(connect);
                    } else {                        
                        reject(connect);
                    }
                }
                else{
                    reject(result);
                }
            } catch (err) {
                logger.error(err);
            }
         })
    }

    async connect() {
        return await new Promise( async (resolve, reject) => {
            try {
                const result = await progInit({str:this.uuid, ip:this.ip, port:this.port, password:this.password, type:this.type})
                if(result.returnCode === '0x00000000') {
                    logger.info(`${this.name} : ${this.ip} : ${this.port} Init OK`);
                    const connect = await progConnect({str:this.uuid});
                    if(connect.returnCode === '0x00000000') {
                        //console.log(this.ip, ":",this.port, "Connection OK ");
                        this.Online = true;
                        this.miPLCInternal.emit("online");
                        resolve(connect);
                    } else {
                        //console.log(this.ip, ":",this.port, "Connection Error ");
                        this.miPLCInternal.emit("offline");
                        this.checkOnline();
                        reject(connect);
                    }
                }
                else{
                    reject(result);
                }
            } catch (err) {
                logger.error(err);
                //console.log(err);
            }
         })
    }

    async disconnect() {
        return await new Promise( async (resolve, reject) => {
            try {
                const result = await progDisconnect({str:this.uuid});
                if(result.returnCode === '0x00000000') {
                    console.log(this.ip, ":",this.port, "disconnect OK ",result);
                    const close = await progClose({str:this.uuid})
                    if(close.returnCode === '0x00000000') {
                        this.Online = false;
                        console.log(this.ip, ":",this.port, "Close OK ",result);
                        resolve(result);
                    } else {
                        reject(close);
                    }
                } else {
                    reject(result);
                }
            } catch (err) {
                console.log(err);
            }
        })
    }

    async getCpu() {
        return await new Promise(async (resolve, reject) => {
            const result = await progGetCpuType({str:this.uuid});
            if(result.returnCode === '0x00000000') {
                resolve(result);
            } else {
                reject(result);
            }
        })
    }

    async readDeviceBlock(addr, size) {
        return await new Promise(async (resolve, reject) => {
            const result = await progReadDeviceBlock({str:this.uuid, szDevice:addr, size:size});
            if(result.returnCode === '0x00000000') {
                resolve(result);
            } else {
                reject(result);
            }
        })
    }

    async writeDeviceBlock(addr, data) {
        return await new Promise(async (resolve, reject) => {
            const result = await progWriteDeviceBlock({str:this.uuid, szDevice:addr, data:data});
            if(result.returnCode === '0x00000000') {
                resolve(result);
            } else {
                reject(result);
            }
        })
    }

    async getDevice(addr) {
        return await new Promise(async (resolve, reject) => {
            const result = await progGetDevice({str:this.uuid, szDevice:addr});
            if(result.returnCode === '0x00000000') {
                resolve(result);
            } else {
                reject(result);
            }
        })
    }

    async setDevice(addr, data) {
        return await new Promise(async (resolve, reject) => {
            const result = await progSetDevice({str:this.uuid, szDevice:addr, data:data});
            if(result.returnCode === '0x00000000') {
                resolve(result);
            } else {
                reject(result);
            }
        })
    }

    async readBuffer(startIO, addr, size, data) {
        return await new Promise(async (resolve, reject) => {
            const result = await  progReadBuffer({str:this.uuid, startIO:startIO, addr:addr, size:size});
            if(result.returnCode === '0x00000000') {
                resolve(result);
            } else {
                reject(result);
            }
        })
    }

    async writeBuffer(addr, data) {
        return await new Promise(async (resolve, reject) => {
            const result = await  progWriteBuffer({str:this.uuid, startIO:startIO, addr:addr, size:size, data:data});
            if(result.returnCode === '0x00000000') {
                resolve(result);
            } else {
                reject(result);
            }
        })
    }

    async checkControl() {
        return await new Promise(async (resolve, reject) => {
            const result = await progCheckControl({str:this.uuid});
            if(result.returnCode === '0x00000000') {
                resolve(result);
            } else {
                reject(result);
            }
        })
    }

}

module.exports = MiProgTypePLC;