import { HandsEngine, User } from "./HandsEngine";
import express from "express";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

const handsEngine = new HandsEngine();

const app = express();
let http = require("http").Server(app);
let port = process.env.PORT || 3005

const server = http.listen(port, function() {
  console.log("listening on *:" + port);
});
app.use(express.static(path.join(__dirname, '../../client/out')));

interface UserRegistration {
  name: string
}

let io = require("socket.io")(http);

io.on("connect", (socket: any) => {

  if (!socket.user) {
    var userName = socket.handshake.query['userName'];
    console.log("Registering User %s", userName);
    const user: User = {
      id: uuidv4(),
      name: userName,
      wantsToTalk: false,
      queuedAt: null
    };
    handsEngine.registerUser(user);
    socket.user = user;
  }
  const usr: User = socket.user;

  socket.on("toggleHands", () => {
    handsEngine.toggleHands(usr);
  })

  socket.on('disconnect', () => {
    console.log("Un-Registering User %s", usr.name);
    handsEngine.deRegisterUser(usr)
  })

  handsEngine.registerStateChangeHook((state) => {
    io.emit("state", state);
  })

  socket.on("msg", (msg: string) => {
    console.log("Got message by %s - %s", socket.userName, msg);
    io.emit("msg", socket.userName + " - " + msg);
  });

});
