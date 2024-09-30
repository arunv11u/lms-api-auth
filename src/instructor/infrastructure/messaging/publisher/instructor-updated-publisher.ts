import { CompressionTypes, IHeaders } from "kafkajs";
import {
	CustomProducerMessage,
	ErrorCodes,
	GenericError,
	MessagingPublisher,
	MessagingTopics,
} from "../../../../utils";
import { InstructorUpdatedEvent } from "../event";


export class InstructorUpdatedPublisher extends
	MessagingPublisher<InstructorUpdatedEvent> {
	acks: number | undefined = undefined;
	timeout: number | undefined = undefined;
	topic: MessagingTopics.instructorUpdatedEvent = 
		MessagingTopics.instructorUpdatedEvent;
	compression?: CompressionTypes | undefined = undefined;

	private _messages: CustomProducerMessage<InstructorUpdatedEvent>[] = [];

	get messages(): CustomProducerMessage<InstructorUpdatedEvent>[] {
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
		value: InstructorUpdatedEvent["data"],
		key?: string | null,
		partition?: number,
		headers?: IHeaders,
		timestamp?: string
	): void {
		if (!key && value.id) key = value.id.toString();

		this._messages.push({ value, key, partition, headers, timestamp });
	}
}