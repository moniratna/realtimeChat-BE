import { Server } from "socket.io";
import { addUser, removeUser } from "../user.js";

const chatService = (server) => {
	try {
		console.log(process.env.FE_URL);
		const io = new Server(server, {
			cors: {
				origin: `${process.env.FE_URL}`,
				methods: ["GET", "POST"],
				allowedHeaders: ["my-custom-header"],
				credentials: true,
			},
		});

		io.on("connection", (socket) => {
			const clientIp =
				socket.handshake.headers["x-real-ip"] || socket.handshake.address;
			console.log(`Client connected from IP address: ${clientIp}`);
			const clientPort = socket.handshake.headers.origin
				? new URL(socket.handshake.headers.origin).port
				: null;
			console.log(`Client connected from port: ${clientPort}`);
			socket.on("join", ({ name, room }, callBack) => {
				const { user, error } = addUser({ id: socket.id, name, room });
				console.log(user);
				if (error) return callBack(error);

				socket.join(user.room);
				socket.emit("message", {
					user: "Admin",
					text: `Welocome to ${user.room}`,
				});

				socket.broadcast.to(user.room).emit("message", {
					user: "Admin",
					text: `${user.name} ip:${clientIp} port: ${clientPort} has joined!`,
				});
				callBack(null);
			});
			socket.on("sendMessage", ({ name, room, message }) => {
				const { user, error } = addUser({ id: socket.id, name, room });
				// Broadcast the message to all users in the room except the sender
				socket.broadcast.to(room).emit("message", {
					text: message,
					user: `${clientIp}:${clientPort}`,
				});
			});
			socket.on("disconnect", () => {
				const user = removeUser(socket.id);
				io.to(user.room).emit("message", {
					user: "Admin",
					text: `${user.name} just left the room`,
				});
				console.log("A disconnection has been made");
			});
		});
	} catch (err) {
		console.log(err);
	}
};
export default chatService;
