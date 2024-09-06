import winston from "winston";
import { Environment } from "../config";


export type Winston = typeof winston;

export interface LogPath {
	combinedLogPath: string;
	errorLogPath: string;
}

export abstract class Logger {
	abstract get winston(): Winston;

	abstract start(environment: Environment):void;
	abstract start(environment: Environment, logPath: LogPath | null): void;
}
