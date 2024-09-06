import express, {
	Request,
	Response,
	NextFunction,
	Express
} from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { appRouter } from "@arunvaradharajalu/common.app-router";
import { errorHandler } from "@arunvaradharajalu/common.errors";
import { defaultRoutePath } from "./global-config";
import {
	Environment,
	ErrorCodes,
	GenericError,
	Routes,
	Winston,
	corsOptions,
	setSecurityHeaders,
	winstonLogger
} from "./utils";
import swaggerDocument from "./swagger.json";
import "./load-controllers";


class RoutesImpl implements Routes {
	private _winston: Winston;

	constructor() {
		this._winston = winstonLogger.winston;
	}

	listen(app: Express): boolean {
		app.disable("x-powered-by");
		app.enable("trust proxy");
		app.use(setSecurityHeaders);
		app.use(cors(corsOptions));
		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));

		if (process.env.NODE_ENV === Environment.DEV)
			app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
				swaggerOptions: {
					"syntaxHighlight": false
				}
			}));

		app.use((req: Request, res: Response, next: NextFunction) => {
			if (req.method !== "OPTIONS")
				this._winston.info(`${req.method} : ${req.originalUrl}`);
			next();
		});

		app.use(
			"/health-check",
			(req: Request, res: Response) => {
				return res.status(200).send();
			}
		);

		app.use(defaultRoutePath, appRouter);

		app.use("/**", function () {
			throw new GenericError({
				code: ErrorCodes.noUseCase,
				error: new Error("There is no use case to process your request."),
				errorCode: 404
			});
		});

		app.use(errorHandler);

		return true;
	}
}

export const routes = new RoutesImpl();
