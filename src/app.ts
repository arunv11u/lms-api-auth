import "@arunvaradharajalu/common.decorators";
import { 
	Environment, 
	Loader, 
	Winston, 
	devConfig, 
	prodConfig, 
	stagingConfig, 
	winstonLogger
} from "./utils";
import { app, server } from "./server";
import { LoaderImpl } from "./loader";


export class App {
	private _winston: Winston;
	private _loader: Loader;
	private _port: number;

	constructor() {
		this._winston = winstonLogger.winston;
		this._loader = new LoaderImpl();
		this._port = prodConfig.port;
	}

	async main() {
		try {
			if (process.env["NODE_ENV"] === Environment.STAGING)
				this._port = stagingConfig.port;
			else if (process.env["NODE_ENV"] === Environment.DEV)
				this._port = devConfig.port;

			await this._loader.load(app);

			this._winston.info("All modules loaded successfully");

			server.listen(this._port,
				() => this._winston.info(`Listening on port: ${this._port}`)
			);

		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error in loading modules ::", error);
			this._winston.error("Error in loading modules", error);
			process.exit(1);
		}
	}
}

new App().main();
