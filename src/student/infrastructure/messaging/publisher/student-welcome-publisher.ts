import { CompressionTypes, IHeaders } from "kafkajs";
import {
	CustomProducerMessage,
	ErrorCodes,
	GenericError,
	MessagingPublisher,
	MessagingTopics,
} from "../../../../utils";
import { StudentWelcomeEvent } from "../event";


export class StudentWelcomePublisher extends
	MessagingPublisher<StudentWelcomeEvent> {
	acks: number | undefined = undefined;
	timeout: number | undefined = undefined;
	topic: MessagingTopics.studentWelcomeEvent =
		MessagingTopics.studentWelcomeEvent;
	compression?: CompressionTypes | undefined = undefined;

	private _messages: CustomProducerMessage<StudentWelcomeEvent>[] = [];

	get messages(): CustomProducerMessage<StudentWelcomeEvent>[] {
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
		value: StudentWelcomeEvent["data"],
		key?: string | null,
		partition?: number,
		headers?: IHeaders,
		timestamp?: string
	): void {
		if (!key && value.id) key = value.id.toString();

		this._messages.push({ value, key, partition, headers, timestamp });
	}
}