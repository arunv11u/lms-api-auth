import { CompressionTypes, IHeaders } from "kafkajs";
import {
	CustomProducerMessage,
	ErrorCodes,
	GenericError,
	MessagingPublisher,
	MessagingTopics,
} from "../../../../utils";
import { InstructorCreatedEvent } from "../event";


export class InstructorCreatedPublisher extends
	MessagingPublisher<InstructorCreatedEvent> {
	acks: number | undefined = undefined;
	timeout: number | undefined = undefined;
	topic: MessagingTopics.instructorCreatedEvent = 
		MessagingTopics.instructorCreatedEvent;
	compression?: CompressionTypes | undefined = undefined;

	private _messages: CustomProducerMessage<InstructorCreatedEvent>[] = [];

	get messages(): CustomProducerMessage<InstructorCreatedEvent>[] {
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
		value: InstructorCreatedEvent["data"],
		key?: string | null,
		partition?: number,
		headers?: IHeaders,
		timestamp?: string
	): void {
		if (!key && value.id) key = value.id.toString();

		this._messages.push({ value, key, partition, headers, timestamp });
	}
}