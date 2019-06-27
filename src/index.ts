import express from 'express';
import bodyParser = require("body-parser");
import { UserRepository } from './repo/user';
import mongoose from 'mongoose';
import { User } from './schemas/user';
import { Project } from './schemas/project';
import { ProjectStatus } from './schemas/status';
import moment from 'moment';

var Conf:{[key:string]:string} = {
    "MONGOURI": "mongodb://localhost:27017/projects",
}
for(let key in Conf) {
    if(key in process.env && process.env[key] != undefined) Conf[key] = <string>process.env[key];
}
const asyncMiddleware = (fn: any) =>
    (req: Request, res: Response, next: any) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };

const app = express();

var userRepo: UserRepository = new UserRepository();

var connected:boolean = false;

async function start() {

    app.use((req,res,next) => {
        if(!connected) {
            mongoose.connect(Conf.MONGOURI, {
                useNewUrlParser: true
            }).then(() => { connected = true; next() }).catch(next);
        } else {
            next();
        }
    });
    
    app.use(bodyParser.json());
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.get('/', (request, response) => {
        response.send('Hello world!');
    });

    app.get('/users', (request, response) => {
        var users = userRepo.getAllUsers()
            .then((data) => { response.send(data); });
    })

    app.post("/user", (request, response, next) => {
        let postData = request.body;
        console.log(request);
        let entity = new User(postData);
        entity.save((err, entity) => {
            if (err) response.send("Error: " + err);
            else response.send(JSON.stringify(entity));
        })
    });

    app.get('/projects', async (request, response, next) => {
        let date = moment().format("YYYYMMDD");
        if('date' in request.query) date = request.query.date;
        try {
            let projects = await Project.find().lean();
            let allPromises = [];
            for (let project of projects) {
                allPromises.push(new Promise((resolve, reject) => {
                    ProjectStatus.findOne({ "project": project._id, "date":date }, (err, status) => {
                        if (err) reject();
                        if (status) {
                            //@ts-ignore
                            project.status = status.status;
                            //@ts-ignore
                            project.commentaire = status.commentaire;
                            //@ts-ignore
                            project.dateStatus = status.date;
                            console.log(project);
                        }
                        console.log(projects);

                        resolve();
                    });
                }));
            }
            Promise.all(allPromises).then(() => { console.log("fin"); response.send(JSON.stringify(projects)) });
        } catch (e) { next(e); }
    })

    app.post("/project", (request, response) => {
        let postData = request.body;
        let entity = new Project(postData);
        entity.save((err, entity) => {
            if (err) response.send("Error: " + err);
            else response.send(JSON.stringify(entity));
        })
    })

    app.post("/projectStatus", (request, response) => {
        let postData = request.body;
        console.log(request);
        let entity = new ProjectStatus(postData);
        entity.save((err, entity) => {
            if (err) response.send("Error: " + err);
            else response.send(JSON.stringify(entity));
        })
    })


    app.listen(5000, function () {
        console.log("Server started on port 5000");
    });
}

start();