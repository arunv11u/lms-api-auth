/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import path from "path";
import fs from "fs";
import { MailConnectionError } from "@arunvaradharajalu/common.errors";
import {
	ErrorCodes,
	MailClient
} from "../types";
import { GenericError } from "../errors";
import {
	MailMessage,
	TemplateTypes
} from "./mail-message";


export class MailClientImpl implements MailClient {

	private _host: string | null = null;
	private _port: number | null = null;
	private _user: string | null = null;
	private _password: string | null = null;
	private _mailClient: nodemailer.Transporter | null = null;

	set host(host: string) {
		this._host = host;
	}

	set port(port: number) {
		this._port = port;
	}

	set user(user: string) {
		this._user = user;
	}

	set password(password: string) {
		this._password = password;
	}

	init(): void {

		if (!this._host)
			throw new MailConnectionError("SMTP, host must be set before initialization");

		if (!this._port)
			throw new MailConnectionError("SMTP, port must be set before initialization");

		if (!this._user)
			throw new MailConnectionError("SMTP, user must be set before initialization");

		if (!this._password)
			throw new MailConnectionError("SMTP, password must be set before initialization");

		this._mailClient = nodemailer.createTransport({
			host: this._host,
			port: this._port,
			auth: {
				user: this._user,
				pass: this._password
			}
		});
	}

	// eslint-disable-next-line max-params
	async sendMail(
		message: MailMessage,
		html: string,
		subject: string,
		text: string
	): Promise<void> {

		if (!this._mailClient)
			throw new MailConnectionError("Mail client must be initialized before sending mail");

		message.html = html;
		message.subject = subject;
		message.text = text;

		await this._mailClient.sendMail(message);
	}

	async getTemplateString(
		templateFolderName: string,
		type: TemplateTypes
	): Promise<string> {
		let templateFileName: string | null = null;

		if (type === TemplateTypes.html) templateFileName = "html.hbs";
		if (type === TemplateTypes.subject) templateFileName = "subject.hbs";
		if (type === TemplateTypes.text) templateFileName = "text.hbs";

		if (!templateFileName) throw new GenericError({
			code: ErrorCodes.internalError,
			error: new Error("Email template file name is invalid"),
			errorCode: 500
		});

		const templatePath = path.join(
			__dirname,
			"../",
			"./assets/templates/emails/",
			templateFolderName,
			templateFileName
		);

		const template = await new Promise<string>((resolve, reject) => {
			fs.readFile(templatePath, (
				err: NodeJS.ErrnoException | null,
				data: Buffer
			) => {
				if (err) return reject(new GenericError({
					code: ErrorCodes.internalError,
					error: new Error(`Error in getting template while sending email for "${templateFolderName}" email`),
					errorCode: 500
				}));

				resolve(data.toString("utf-8"));
			});
		});

		return template;
	}

	compile(
		template: any,
		data: { [key: string]: any; }
	): string {
		const _template = handlebars.compile(template);

		return _template(data);
	}
}