import { CompressionTypes, IHeaders } from "kafkajs";
import {
	CustomProducerMessage,
	ErrorCodes,
	GenericError,
	MessagingPublisher,
	MessagingTopics,
} from "../../../../utils";
import { StudentForgotPasswordEvent } from "../event";


export class StudentForgotPasswordPublisher extends
	MessagingPublisher<StudentForgotPasswordEvent> {
	acks: number | undefined = undefined;
	timeout: number | undefined = undefined;
	topic: MessagingTopics.studentForgotPasswordEvent = 
		MessagingTopics.studentForgotPasswordEvent;
	compression?: CompressionTypes | undefined = undefined;

	private _messages: CustomProducerMessage<StudentForgotPasswordEvent>[] = [];

	get messages(): CustomProducerMessage<StudentForgotPasswordEvent>[] {
		if (!this._messages)
			throw new GenericError({
				code: ErrorCodes.kafkaProducerMessageNotAvailable,
				error: new Error("_messages should be available before publishing a topic"),
				errorCode: 500
			});

		return this._messages;
	}

	// eslint-disable-next-line max-params
	pushMessage(
		value: StudentForgotPasswordEvent["data"],
		key?: string | null,
		partition?: number,
		headers?: IHeaders,
		timestamp?: string
	): void {
		if (!key && value.id) key = value.id.toString();

		this._messages.push({ value, key, partition, headers, timestamp });
	}
}