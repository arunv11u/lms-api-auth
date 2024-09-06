import { ResponseHandlerImpl, getResponseHandler } from "../../../src/utils";




describe("Helper Module", () => {

	describe("\"getResponseHandler\" method", () => {
		describe("Happy Path", () => {
			it("Should return response handler", () => {
				const responseHandler = getResponseHandler();

				expect(responseHandler).toBeInstanceOf(ResponseHandlerImpl);
			});
		});
	});
});