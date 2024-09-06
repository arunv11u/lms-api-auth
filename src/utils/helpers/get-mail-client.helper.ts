import nconf from "nconf";
import { MailClientImpl } from "../mail-client";
import {
	ErrorCodes,
	MailClient
} from "../types";
import { GenericError } from "../errors";

function getMailClient(): MailClient {

	const mailClient = new MailClientImpl();

	const host = nconf.get("mailClientHost");
	const port = nconf.get("mailClientPort");
	const user = nconf.get("mailClientUser");
	const password = nconf.get("mailClientPassword");

	if (!host) throw new GenericError({
		code: ErrorCodes.internalError,
		error: new Error("Mail Client, host must be set in configurations"),
		errorCode: 500
	});
	if (!port) throw new GenericError({
		code: ErrorCodes.internalError,
		error: new Error("Mail Client, port must be set in configurations"),
		errorCode: 500
	});
	if (!user) throw new GenericError({
		code: ErrorCodes.internalError,
		error: new Error("Mail Client, user must be set in configurations"),
		errorCode: 500
	});
	if (!password) throw new GenericError({
		code: ErrorCodes.internalError,
		error: new Error("Mail Client, password must be set in configurations"),
		errorCode: 500
	});

	mailClient.host = host;
	mailClient.port = port;
	mailClient.user = user;
	mailClient.password = password;

	mailClient.init();

	return mailClient;
}

export {
	getMailClient
};