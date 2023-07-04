const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);

class MiVics {

    constructor(ip, port)
    {
        this.ip = ip;
        this.port = port;
    }

    async getVicsCameraList() {
        const username = 'admin';
        const password = 'admin';
      
        try {
          const response = await axios.get(`http://${this.ip}:${this.port}/vapi/GetCamList`);
          return response.data.cVidCamera;
        } catch (error) {
          if (error.response && error.response.status === 401) {
            const wwwAuthenticateHeader = error.response.headers['www-authenticate'];
            const realmMatch = wwwAuthenticateHeader.match(/realm="([^"]*)"/);
            const nonceMatch = wwwAuthenticateHeader.match(/nonce="([^"]*)"/);
      
            if (realmMatch && nonceMatch) {
              const ha1 = crypto.createHash('md5').update(`${username}:${realmMatch[1]}:${password}`).digest('hex');
              const ha2 = crypto.createHash('md5').update(`GET:/vapi/GetCamList`).digest('hex');
              const nc = '00000001';
              const cnonce = crypto.randomBytes(16).toString('hex');
              const response = crypto.createHash('md5').update(`${ha1}:${nonceMatch[1]}:${nc}:${cnonce}:auth:${ha2}`).digest('hex');
      
              const authResponse = await axios.get(`http://${this.ip}:${this.port}/vapi/GetCamList`, {
                headers: {
                  Authorization: `Digest username="${username}", realm="${realmMatch[1]}", nonce="${nonceMatch[1]}", uri="/vapi/GetCamList", response="${response}", qop=auth, nc=${nc}, cnonce="${cnonce}"`,
                },
              });
              //console.log(authResponse.data);
              return authResponse.data.cVidCamera;
            }
          }
          //throw new Error(error);
        }
      }
    
      async getVicsCameraImage(camid, width, height) {
      const username = 'admin';
      const password = 'admin';
    
      try {
        const response = await axios.get(`http://${this.ip}:${this.port}/vapi/GetImage?strid=${camid}&width=${width}&height=${height}`, {
          responseType: 'arraybuffer',  // Set the response type to 'arraybuffer'
        });
        return response.data;
        // fs.writeFileSync(filePath, response.data);  // Write the response data to the file
        
      } catch (error) {
        if (error.response && error.response.status === 401) {
          const wwwAuthenticateHeader = error.response.headers['www-authenticate'];
          const realmMatch = wwwAuthenticateHeader.match(/realm="([^"]*)"/);
          const nonceMatch = wwwAuthenticateHeader.match(/nonce="([^"]*)"/);
    
          if (realmMatch && nonceMatch) {
            const ha1 = crypto.createHash('md5').update(`${username}:${realmMatch[1]}:${password}`).digest('hex');
            const ha2 = crypto.createHash('md5').update(`GET:/vapi/GetImage?strid=${camid}&width=${width}&height=${height}`).digest('hex');
            const nc = '00000001';
            const cnonce = crypto.randomBytes(16).toString('hex');
            const response = crypto.createHash('md5').update(`${ha1}:${nonceMatch[1]}:${nc}:${cnonce}:auth:${ha2}`).digest('hex');
    
            const authResponse = await axios.get(`http://${this.ip}:${this.port}/vapi/GetImage?strid=${camid}&width=${width}&height=${height}`, {
              headers: {
                Authorization: `Digest username="${username}", realm="${realmMatch[1]}", nonce="${nonceMatch[1]}", uri="/vapi/GetImage?strid=${camid}&width=${width}&height=${height}", response="${response}", qop=auth, nc=${nc}, cnonce="${cnonce}"`,
              },
              responseType: 'arraybuffer',  // Set the response type to 'arraybuffer'
            });
            const string = authResponse.data.toString('utf8');
            if(string.includes("Can't Get the Image!"))
                throw `[${this.ip}:${this.port}] Can't Get the Image! CameraId : ${camid}`; // Reject the Promise
                
            return authResponse.data;
            // fs.writeFileSync(filePath, authResponse.data);  // Write the authenticated response data to the file
          }
        } else {
          console.error('Failed to download image:', error);
        }
      }
    }

  async saveToVicsAllCamera(h, w){
    const height = h | 1980;
    const width = w | 1080;
    try {
        const CameraList = await this.getVicsCameraList(this.ip, this.port);
        const directoryPath = path.resolve(`./${this.ip}`);
        //console.log(directoryPath);
        if (!fs.existsSync(directoryPath)) {
            // Folder does not exist, create it
            fs.mkdirSync(directoryPath);
          
            //console.log('Folder created successfully.');
          } else {
            //console.log('Folder already exists.');
          }
        await Promise.all(CameraList.map( async (camera) => {
            const filePath = path.join(directoryPath, `${camera.strId}.jpeg`);
            try {
            const data = await this.getVicsCameraImage(camera.strId, height, width, filePath);
            await fs.promises.writeFile(filePath, data)
            //fs.writeFileSync(filePath, data)
            } catch (err) {
                console.log(err);
            }
            
        }))
        const files = await readdir(directoryPath);
        return {path:directoryPath, files:files};
    } catch (err) {
        throw err;
    }
  }

}

module.exports = MiVics;