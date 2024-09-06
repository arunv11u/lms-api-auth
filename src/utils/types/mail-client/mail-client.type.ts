import { MailMessage, TemplateTypes } from "../../mail-client";



export abstract class MailClient {
	abstract set host(host: string);
	abstract set port(port: number);
	abstract set user(user: string);
	abstract set password(password: string);

	abstract init(): void;
	abstract sendMail(
		message: MailMessage,
		html: string,
		subject: string,
		text: string
	): Promise<void>;
	abstract getTemplateString(
		templateFolderName: string,
		type: TemplateTypes
	): Promise<string>;
	abstract compile(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		template: any,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data: { [key: string]: any; }
	): string;
}