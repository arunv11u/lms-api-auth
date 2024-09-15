import { CompressionTypes, IHeaders } from "kafkajs";
import {
	CustomProducerMessage,
	ErrorCodes,
	GenericError,
	MessagingPublisher,
	MessagingTopics,
} from "../../../../utils";
import { StudentCreatedEvent } from "../event";


export class StudentCreatedPublisher extends
	MessagingPublisher<StudentCreatedEvent> {
	acks: number | undefined = undefined;
	timeout: number | undefined = undefined;
	topic = MessagingTopics.studentCreatedEvent;
	compression?: CompressionTypes | undefined = undefined;

	private _messages: CustomProducerMessage<StudentCreatedEvent>[] = [];

	get messages(): CustomProducerMessage<StudentCreatedEvent>[] {
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
		value: StudentCreatedEvent["data"],
		key?: string | null,
		partition?: number,
		headers?: IHeaders,
		timestamp?: string
	): void {
		if (!key && value.id) key = value.id.toString();

		this._messages.push({ value, key, partition, headers, timestamp });
	}
}