const ftp = require('ftp');
const path = require('path');
const logger = require('../classes/MiLogger');

class MiFtp {

    constructor(ip, port, user, password, pathformat) {
        this.ip = ip;
        this.port = port,
        this.user = user,
        this.password = password,
        this.client = new ftp();
        this.connected = false;
        this.pathformat = pathformat;
    }
    async connect()
    {
        return new Promise((resolve, reject) => {
        // Connect to the FTP server
            try {
                this.client.connect({
                    host: this.ip,
                    port: this.port,
                    user: this.user,
                    password: this.password,
                    connTimeout: 5000,
                });
        
                this.client.on('ready', () => {
                    this.connected = true;
                    logger.info(`FTP Server Connected ${this.ip}:${this.port} , ${this.user}`)
                    resolve(true)
                });

                this.client.on('close', () => {
                    logger.error(`FTP Server Closed `);
                    this.connected = false;
                })

                this.client.on('error', (err) => {
                    logger.error(`FTP Server Err ${err}`);
                    reject(err);
                })
                
            } catch(err) {
                reject(err);
            }
        })
    }

    checkOnline() {
        this.clearCheckOnline();

        const ftp = this.client;
        const host = this.ip;
        const port =  this.port;
        const user = this.user;
        const password = this.password;

        this.checkOnlinetimer = setInterval( () => {
            ftp.connect({
                host: host,
                port: port,
                user: user,
                password: password,
                connTimeout: 5000,
            })
        }, (5000));
    }

    clearCheckOnline() {
        if(this.checkOnlinetimer)
            clearInterval(this.checkOnlinetimer);
    }

    disconnect()
    {
        this.client.end();
    }

    async uploadFile(localPath, remotePath) {
        return new Promise((resolve, reject) => {
          this.client.put(localPath, remotePath, (error) => {
            if (error) {
              reject(error);
            } else {
              resolve(true);
            }

          });
        });
    }

    async uploadFileBinary(data, remotePath) {
        return new Promise((resolve, reject) => {
            let filePath = path.join(remotePath);
            if(this.pathformat === "linux") {
                filePath = filePath.replace(/\\/g, '/'); // Replace backslashes with forward slashes
            }
          this.client.put(data, filePath, (error) => {
            if (error) {
              reject(error);
            } else {
              resolve(true);
            }
          });
        });
    }

    async uploadFileList(fileList) {
            try {
                for (const file of fileList) {
                    const localPath = file;
                    const filepath = path.basename(file);
                    const remotePath = `/home/mirero/samba/vicstest/${filepath}`;
                    let sendPath = remotePath;
                    if(this.pathformat === "linux") {
                        sendPath = sendPath.replace(/\\/g, '/'); // Replace backslashes with forward slashes
                    }
                    await this.uploadFile(localPath, sendPath);
                }
            } catch (err) {
                console.log(err);
            }
    }
}



module.exports = MiFtp;