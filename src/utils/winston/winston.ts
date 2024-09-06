import winston from "winston";
import "winston-daily-rotate-file";
import util from "util";
import { GenericError } from "../errors";
import {
	Environment,
	ErrorCodes,
	Logger,
	LogPath,
	Winston
} from "../types";



class WinstonLogger implements Logger {
	private _winston: Winston = winston;


	get winston() {
		return this._winston;
	}


	start(environment: Environment, logPath?: LogPath | null) {

		const consolePrint = this._winston.format.combine(
			this._winston.format.timestamp({
				format: "YYYY-MM-DD hh:mm:ss.SSS A",
			}),
			this._winston.format.errors({ stack: true }),
			this._winston.format.printf((info) => {
				const _info = JSON.parse(JSON.stringify(info));
				delete _info.level;
				delete _info.message;
				delete _info.timestamp;

				const infoObjInText = Object.keys(_info).length > 0 ?
					`${JSON.stringify(_info)}` :
					"";

				return `${info.level} : ${util.inspect(`${info.timestamp} : ${info.message} ${infoObjInText}`, {
					colors: true
				})}`;
			})
		);


		const filePrint = this._winston.format.combine(
			this._winston.format.timestamp({
				format: "YYYY-MM-DD hh:mm:ss.SSS A",
			}),
			this._winston.format.errors({ stack: true }),
			this._winston.format.printf((info) => {
				const _info = JSON.parse(JSON.stringify(info));
				delete _info.level;
				delete _info.message;
				delete _info.timestamp;

				const infoObjInText = Object.keys(_info).length > 0 ?
					`${JSON.stringify(_info)}` :
					"";

				return `${util.inspect(`${info.level} : ${info.timestamp} : ${info.message} ${infoObjInText}`, {
					colors: false
				})}`;
			})
		);

		const logger = this._winston.createLogger({});

		if (environment === Environment.DEV ||
			environment === Environment.TEST
		) {
			logger.add(new this._winston.transports.Console({
				level: "silly",
				format: this._winston.format.colorize({ all: true })
			}));
		}

		logger.format = consolePrint;

		if (environment === Environment.PRODUCTION ||
			environment === Environment.STAGING
		) {
			if (!logPath)
				throw new GenericError({
					code: ErrorCodes.invalidInput,
					error: new Error(
						`Log path is required for ${environment} environment.`
					),
					errorCode: 500
				});

			logger.format = filePrint;

			logger.add(new this._winston.transports.DailyRotateFile({
				filename: logPath.combinedLogPath,
				level: "info",
				maxSize: "200m",
				maxFiles: 3
			}));

			logger.add(new this._winston.transports.DailyRotateFile({
				filename: logPath.errorLogPath,
				level: "error",
				maxSize: "200m",
				maxFiles: 3
			}));
		}

		this._winston.add(logger);

		if (environment === Environment.PRODUCTION)
			this._winston.info("IN PRODUCTION MODE");

		if (environment === Environment.STAGING)
			this._winston.info("IN STAGING MODE");

		if (environment === Environment.TEST)
			this._winston.info("IN TEST MODE");

		if (environment === Environment.DEV)
			this._winston.info("IN DEVELOPMENT MODE");
	}
}

const winstonLogger = new WinstonLogger();

export {
	WinstonLogger,
	winstonLogger
};
