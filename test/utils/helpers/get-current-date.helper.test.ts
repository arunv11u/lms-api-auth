import { getCurrentDate } from "../../../src/utils";





describe("Helper Module", () => {

	describe("\"getCurrentDate\" method", () => {
		describe("Happy Path", () => {
			it("Should return today's date", () => {
				const date = getCurrentDate();

				expect(date).toBeInstanceOf(Date);
			});
		});
	});
});