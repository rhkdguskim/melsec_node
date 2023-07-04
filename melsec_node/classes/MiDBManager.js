const Datastore = require('nedb');

const plcDB = new Datastore({ filename: 'db/PlcDB', autoload: true });
const vicsDB = new Datastore({ filename: 'db/VicsDB', autoload: true });


class DBManager {
    constructor(db) {
        this.db = db;
    }

    ReloadData() {
        this.db.loadDatabase();
    }

    async insert(params) {
        return new Promise((resolve, reject) => {
            this.db.insert(params, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    this.ReloadData();
                    resolve(result);
                }
            })
        })
    }

    async update(params) {
        return new Promise((resolve, reject) => {
            this.db.update({ _id:params._id}, { $set: params} , { upsert: false } , (err, numUpdated) => {
                if(err) {
                    reject(err);
                }
                else{
                    this.ReloadData();
                    // 수정되면 처리해주는 로직 필요
                    if(numUpdated) {
                        resolve(params);
                    }
                    else {
                        reject("No Data");
                    }
                }
            })
        })
    }
    
    async remove(params) {
        return new Promise((resolve, reject) => {
            this.db.remove({_id:params._id}, {}, (err, numRemoved) => {
                if(err) {
                    reject(err);
                }
                else{
                    if(numRemoved) {
                        this.ReloadData();
                        resolve(params)
                    }
                    else {
                        reject("No Data");
                    }
                        
                }
            })
        })

    }

    async findAll() {
        return new Promise((resolve, reject) => {
            this.db.find({},(err, list) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(list);
                }
            })
        })
    }

    async findOne(params) {
        return new Promise((resolve, reject) => {
            this.db.findOne({_id:params._id}, (err, list) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(list);
                }
            })
        })
    }
}

const plc = new DBManager(plcDB);
const vics = new DBManager(vicsDB);


module.exports = {plcDB:plc, vicsDB:vics};