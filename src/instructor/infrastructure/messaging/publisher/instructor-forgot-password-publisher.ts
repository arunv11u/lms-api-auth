import { CompressionTypes, IHeaders } from "kafkajs";
import {
	CustomProducerMessage,
	ErrorCodes,
	GenericError,
	MessagingPublisher,
	MessagingTopics,
} from "../../../../utils";
import { InstructorForgotPasswordEvent } from "../event";


export class InstructorForgotPasswordPublisher extends
	MessagingPublisher<InstructorForgotPasswordEvent> {
	acks: number | undefined = undefined;
	timeout: number | undefined = undefined;
	topic: MessagingTopics.instructorForgotPasswordEvent =
		MessagingTopics.instructorForgotPasswordEvent;
	compression?: CompressionTypes | undefined = undefined;

	private _messages:
		CustomProducerMessage<InstructorForgotPasswordEvent>[] = [];

	get messages(): CustomProducerMessage<InstructorForgotPasswordEvent>[] {
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
		value: InstructorForgotPasswordEvent["data"],
		key?: string | null,
		partition?: number,
		headers?: IHeaders,
		timestamp?: string
	): void {
		if (!key && value.id) key = value.id.toString();

		this._messages.push({ value, key, partition, headers, timestamp });
	}
}