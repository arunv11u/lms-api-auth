import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

export const errorEventHandler = (error: { code: string }) => {
	if (error.code === "EADDRINUSE") {
		// eslint-disable-next-line no-console
		console.error("Address in use, exiting...");

		process.exit(1);
	}
};

server.on("error", errorEventHandler);

export { server, app };