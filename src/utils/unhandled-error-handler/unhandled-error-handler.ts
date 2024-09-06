
function unhandledErrorHandler () {
	process.on("uncaughtException", (error) => {
		// eslint-disable-next-line no-console
		console.error(error);
	});

	process.on("unhandledRejection", (error) => {
		// eslint-disable-next-line no-console
		console.error(error);
	});
}

export {
	unhandledErrorHandler
};
