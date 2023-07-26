const  express = require('express');
const cors =  require('cors');
const bodyParser = require("body-parser")
const http = require("http")
const session = require("express-session");
const {MemoryStore} = require("express-session");
const dotenv = require("dotenv");
const InitiateMongoServer = require('./config/initiateMongoServer');


//route Imports
// import userRoutes from './Routes/UserRoutes';
const userRoutes = require("./Routes/UserRoutes");
const authRoutes = require("./Routes/AuthRoutes");
const subjectRoutes = require("./Routes/SubjectRoutes");
const testRoutes = require("./Routes/testRoutes");
const insightRoutes = require("./Routes/insightRoutes");
// import projectRoutes from './Routes/ProjectRoutes';
// import Auth from './MiddleWare/Auth-MiddleWare';

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));



const port = process.env.PORT || 5000;

//Config for Environment variables
dotenv.config();

//Initiate Mongo Sever
InitiateMongoServer();

app.use(express.json());
//cross origin resource sharing :Set middleware

var whitelist = ['http://localhost:3000', 'https://allprojects.ml']
var corsOptions = {
  origin: ['http://localhost:3000', 'https://allprojects.ml'],
  credentials:true
}
app.use(cors(corsOptions))
app.use(session(
  { secret: "secret", store: new MemoryStore(), cookie:{maxAge: Date.now() + (30 * 86400 * 1000) 
  }
  }));
//app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/subject',subjectRoutes);
// app.use("/user",userRoutes);
app.use("/test",testRoutes);
app.use("/insight",insightRoutes);
// app.use('/project',projectRoutes);
app.use("/user",userRoutes);
app.get('/', (req, res) => {
  res.status(200).send("server has been up with some updates...");
})

server.listen(port,() => {
  console.log('Server started at ' + port);
});