import express from "express";
import { Server } from "node:http";
import { mockProcessExit } from "jest-mock-process";
import { 
	app, 
	errorEventHandler, 
	server 
} from "../src/server";

const mockExit = mockProcessExit();

describe("\"Server\" Module", () => {

	describe("\"Error event handler\" fn", () => {
		errorEventHandler({ code: "EADDRINUSE" });
		expect(mockExit).toHaveBeenCalled();
	});

	describe("Server startup module", () => {
		describe("Happy Path", () => {
			it("Create a http server", () => {
				expect(server).toBeInstanceOf(Server);
			});

			it("Needed Express Application, app should be express app", () => {
				const _app = express();
				expect(app.name).toBe(_app.name);
			});
		});
	});
});