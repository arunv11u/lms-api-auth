/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
	GenericError, 
	JSONWebToken, 
	JSONWebTokenImpl, 
	UserTypes
} from "../../../src/utils";



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
				expect(() => jsonWebToken.sign({ user: "", sessionId: "", type: UserTypes.student }, undefined as any)).rejects.toThrow(GenericError);
			});
		});

		describe("Happy Path", () => {
			it("Data and secret passed, should return string", async () => {
				const encoded = await jsonWebToken.sign({ sessionId: "sessionId", user: "userId", type: UserTypes.student }, "somesecret");

				expect(encoded).toBeDefined();
			});
		});
	});
});