import { CompressionTypes, IHeaders } from "kafkajs";
import {
	CustomProducerMessage,
	ErrorCodes,
	GenericError,
	MessagingPublisher,
	MessagingTopics,
} from "../../../../utils";
import { InstructorWelcomeEvent } from "../event";


export class InstructorWelcomePublisher extends
	MessagingPublisher<InstructorWelcomeEvent> {
	acks: number | undefined = undefined;
	timeout: number | undefined = undefined;
	topic: MessagingTopics.instructorWelcomeEvent =
		MessagingTopics.instructorWelcomeEvent;
	compression?: CompressionTypes | undefined = undefined;

	private _messages: CustomProducerMessage<InstructorWelcomeEvent>[] = [];

	get messages(): CustomProducerMessage<InstructorWelcomeEvent>[] {
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
		value: InstructorWelcomeEvent["data"],
		key?: string | null,
		partition?: number,
		headers?: IHeaders,
		timestamp?: string
	): void {
		if (!key && value.id) key = value.id.toString();

		this._messages.push({ value, key, partition, headers, timestamp });
	}
}