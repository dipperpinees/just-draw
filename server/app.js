const express = require("express");
const {sortListPlayer, handleScore, randomListWord} = require("./handleQuiz");
const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server, {
    cors: {
      origin: '*',
    }
});

server.listen(process.env.PORT || 8000);

const listRoom = {};
const listClient = {};

const randomId = () => {
    const listChar = "abcdefghijklmnopqrstuvwxyz0123456789";
    while (true) {
        let roomId = "";
        const lengthList = listChar.length;
        for(let i = 0; i<6; i++) {
            roomId += listChar[Math.floor(Math.random() * lengthList)];
        }
        if(!listRoom[roomId]) {
            return roomId;
        }
    }
}

io.on('connection', async (socket) => {
    console.log("new user connected");
    if(socket.handshake.query.type === 'create') {
        const roomId = randomId().toString();
        listRoom[roomId] = {masterId: socket.id, indexPlayed: -1, listPlayer: [], listPlayerInGame: [], countAnswer: 0, isPlayed: false, listQuiz: []}; 
        socket.emit('create', roomId);
        listClient[socket.id] = {type: 'create', roomId: roomId};
    } 

    if(socket.handshake.query.type === "join") {
        const name = socket.handshake.query.name;
        const roomId = socket.handshake.query.roomId;
        const avatar = socket.handshake.query.avatar;
        listClient[socket.id] = {type: 'join', roomId: roomId, name: name};
        if(listRoom[roomId] && !listRoom[roomId].isPlayed) {
            socket.join(roomId);
            socket.emit("join", {roomId: roomId, socketId: socket.id});
            listRoom[roomId]?.listPlayer?.push({name: name, avatar: avatar, socketId: socket.id});
            io.to(listRoom[roomId].masterId).emit("playerjoin", listRoom[roomId].listPlayer);
        } else {
            socket.emit("join", "error");
        }
    }

    socket.on('newquiz', async (args) => {
        const {roomId, category} = args;
        if(socket.id !== listRoom[roomId].masterId) {
            return ;
        }

        if(!listRoom[roomId].isPlayed) {
            listRoom[roomId].listPlayerInGame = listRoom[roomId].listPlayer.map(a => ({...a, isAnswer: false, isPaint: false, score: 0}))
            listRoom[roomId].isPlayed = true;
            listRoom[roomId].countAnswer = 0;
            listRoom[roomId].listQuiz = await randomListWord(category, listRoom[roomId].listPlayerInGame.length)
        } 

        const indexPlayed = ++listRoom[roomId].indexPlayed;
        if(indexPlayed === listRoom[roomId].listPlayer.length) {
            listRoom[roomId].isPlayed = false;
            io.to(listRoom[roomId].masterId).emit('endgame', {summaryList: listRoom[roomId].listPlayerInGame, listPlayer: listRoom[roomId].listPlayer});
            io.to(roomId).emit('endgame', true);
            listRoom[roomId].indexPlayed = -1;
        } else {
            listRoom[roomId].countAnswer = 0;

            const paintId = listRoom[roomId].listPlayer[indexPlayed].socketId;
            const paintName = listRoom[roomId].listPlayer[indexPlayed].name;
            handleResetNewQuiz(listRoom[roomId].listPlayerInGame, paintId);
            io.to(listRoom[roomId].masterId).emit('newquiz', {paintId: paintId, word: listRoom[roomId].listQuiz[indexPlayed], paintName: paintName, listPlayer: listRoom[roomId].listPlayerInGame})
            io.to(roomId).emit('newquiz', {paintId: paintId, quiz: listRoom[roomId].listQuiz[indexPlayed]});
        }
    })

    socket.on('answer', (args) => {
        const {isTrue, answer, roomId} = args;
        if(isTrue) {
            ++listRoom[roomId].countAnswer;
            const paintId = listRoom[roomId].listPlayer[listRoom[roomId].indexPlayed].socketId;
            listRoom[roomId]?.listPlayerInGame?.forEach((player) => {
                if(player.socketId === socket.id) {
                    player.score += handleScore(listRoom[roomId].countAnswer);
                    player.isAnswer = true;
                }
                if(player.socketId === paintId) {
                    player.score += 20;
                }
            })
            sortListPlayer(listRoom[roomId].listPlayerInGame);
            io.to(listRoom[roomId]?.masterId).emit('answer', {type: true, listPlayer: listRoom[roomId].listPlayerInGame, answer: answer, answerId: socket.id})
            if(listRoom[roomId].countAnswer === listRoom[roomId].listPlayerInGame.length - 1) {
                io.to(listRoom[roomId].masterId).emit('endquiz', {listPlayer: listRoom[roomId].listPlayerInGame});
                io.to(roomId).emit('endquiz', true);
            }
        } else {
            io.to(listRoom[roomId]?.masterId).emit('answer', {type: false, listPlayer: listRoom[roomId].listPlayerInGame, answer: answer, answerId: socket.id, name: listClient[socket.id].name })
        }
    })

    socket.on('endquiz', (args) => {
        const {roomId} = args;
        io.to(listRoom[roomId]?.masterId).emit('endquiz', true)
        io.to(roomId).emit('endquiz', true);
    })

    //player side
    socket.on("leave", (args) => {
        const {type, roomId} = listClient[socket.id];
        delete listClient[socket.id];
        listRoom[roomId].listPlayer = listRoom[roomId].listPlayer.filter((member) => member.socketId !== socket.id);
        io.to(listRoom[roomId]?.masterId).emit('playerjoin', listRoom[roomId].listPlayer);
    })

    socket.on("paint", (args) => {
        const {roomId, base64} = args;
        if(listRoom[roomId]) {
            io.to(listRoom[roomId].masterId).emit("paint", base64);
        }
    })

    socket.on('disconnect', (args) => {
        const {type, roomId} = listClient[socket.id];
        delete listClient[socket.id];
        if(type === 'create') {
            io.to(roomId).emit("status", {type: 'error'});
            delete listRoom[roomId];
        }
        
        if(listRoom[roomId] && type === 'join') {
            // removeMember(socket.id, listRoom[roomId].listPlayer);
            listRoom[roomId].listPlayer = listRoom[roomId].listPlayer.filter((member) => member.socketId !== socket.id);
            
            if(!listRoom[roomId].isPlayed) {
                io.to(listRoom[roomId]?.masterId).emit('playerjoin', listRoom[roomId].listPlayer);
            } else {
                listRoom[roomId].listPlayerInGame = listRoom[roomId].listPlayerInGame.filter((member) => member.socketId !== socket.id);
                io.to(listRoom[roomId]?.masterId).emit('status', {type: 'memberleave', listPlayer: listRoom[roomId].listPlayerInGame})
            }
        }
    });
});

const handleResetNewQuiz = (list, paintId) => {
    list.forEach((player) => {
        player.isAnswer = false;
        player.isPaint = false;
    })
    list.forEach((player) => {
        if(player.socketId === paintId) {
            player.isPaint = true;
        }
    })
}
