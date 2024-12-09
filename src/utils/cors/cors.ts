/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import { CorsOptions } from "cors";
import { Environment, ErrorCodes } from "../types";
import { GenericError } from "../errors";


export const corsOptions = function (req: Request, callback: any) {
	const whitelist: string[] = [];
	let isCorsOriginEnabled = true;


	if (process.env.NODE_ENV === Environment.PRODUCTION)
		whitelist.push();
	else if (process.env.NODE_ENV === Environment.STAGING)
		whitelist.push();
	else if (process.env.NODE_ENV === Environment.DEV)
		whitelist.push("http://localhost:4200", "https://api.lms-staging.com", "http://localhost", "https://student.lms-staging.com", "https://instructor.lms-staging.com");
	else if (process.env.NODE_ENV === Environment.TEST)
		isCorsOriginEnabled = false;
	else
		throw new GenericError({
			code: ErrorCodes.invalidEnvironment,
			error: new Error("Invalid Environment found in CORS Options."),
			errorCode: 404
		});

	const corsOptions: CorsOptions = {
		methods: ["POST", "GET", "PATCH", "DELETE", "PUT", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true
	};

	if (isCorsOriginEnabled) {
		corsOptions.origin = function (origin: any, callback: any) {
			if (whitelist.indexOf(origin) !== -1 || !origin)
				callback(null, true);
			else callback(new GenericError({
				code: ErrorCodes.invalidOrigin,
				error: new Error("Not allowed by CORS"),
				errorCode: 500
			}));
		};
	}

	callback(null, corsOptions);
};
