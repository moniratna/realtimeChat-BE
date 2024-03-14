import http from "http";
import express from "express";
import chatService from "./services/chatService.js";
import "dotenv/config.js";

const app = express();
const server = http.createServer(app);

const PORT = 5000;

server.listen(PORT, async () => {
	console.log(process.env.FE_URL, process.env.PORT);
	console.log(`Server is Quannected to Port ${PORT}`);
	await chatService(server);
});
