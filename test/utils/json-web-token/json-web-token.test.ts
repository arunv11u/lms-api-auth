/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericError, JSONWebToken, JSONWebTokenImpl, JWTPayload } from "../../../src/utils";



describe("JSON web token module", () => {
	let jsonWebToken: JSONWebToken;

	beforeEach(() => {
		jsonWebToken = new JSONWebTokenImpl();
	});

	describe("\"sign\" method", () => {
		describe("Exception Path", () => {
			it("Data is undefined, should throw an error", () => {
				expect(() => jsonWebToken.sign(undefined as any, "somesecret")).rejects.toThrow(GenericError);
			});

			it("secret is undefined, should throw an error", () => {
				expect(() => jsonWebToken.sign({ user: "", sessionId: "" }, undefined as any)).rejects.toThrow(GenericError);
			});
		});

		describe("Happy Path", () => {
			it("Data and secret passed, should return string", async () => {
				const encoded = await jsonWebToken.sign({ sessionId: "sessionId", user: "userId" }, "somesecret");

				expect(encoded).toBeDefined();
			});
		});
	});

	describe("\"verify\" method", () => {
		describe("Exception Path", () => {
			it("Token is undefined, should throw an error", () => {
				expect(() => jsonWebToken.verify(undefined as any, "somesecret")).rejects.toThrow(GenericError);
			});

			it("Secret is undefined, should throw an error", () => {
				expect(() => jsonWebToken.verify("sometoken", undefined as any)).rejects.toThrow(GenericError);
			});
		});

		describe("Happy Path", () => {
			it("Token and secret passed, should return string", async () => {

				const data: JWTPayload = { sessionId: "sessionId", user: "userId" };
				const secret = "somesecret";

				const encoded = await jsonWebToken.sign(data, secret);

				const decoded = await jsonWebToken.verify(encoded, secret);

				expect(decoded).toMatchObject(decoded);
			});
		});
	});
});