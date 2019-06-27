import { MongoClient, Db } from "mongodb";
import { IUser } from "../entities/user";

var defaultConf: {[key:string]:string} = {
    mongoDatabase: "test",
    mongoUrl: "mongodb://localhost:27017/",
};

class ConfigServiceClass {
    public getKey(key:string):string {
        return defaultConf[key];
    }
}
var ConfigService = new ConfigServiceClass();

export class UserRepository {
    private connection: MongoClient | null = null;

    private async connect(): Promise<Db> {
        return new Promise((resolve, reject) => {
            if (this.connection && this.connection.isConnected()) {
                // Cached connection is OK
                resolve(this.connection.db(ConfigService.getKey("mongoDatabase")))
            } else {
                // Open a new connection
                MongoClient.connect(ConfigService.getKey("mongoUrl"), { useNewUrlParser: true }, (err, client) => {
                    if (err) reject(err);
                    else {
                        this.connection = client;
                        resolve(client.db(ConfigService.getKey("mongoDatabase")));
                    }
                });
            }
        });
    }

    async getAllUsers():Promise<IUser[]> {
        let db = await this.connect();
        return new Promise((resolve, reject) => {
            db.collection('users').find().toArray()
                .then(docs => {
                    if (docs) {
                        resolve(docs);
                    } else {
                        reject({ code: "UNKNOWN_ERROR", error: "Erreur dans la récupération des produits à exporter" });
                    }
                })
                .catch(reject);
        });
    }

}