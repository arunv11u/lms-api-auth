import { CompressionTypes, IHeaders, RecordMetadata } from "kafkajs";
import { CustomProducerMessage } from "../types";
import { messagingClient } from "./messaging-client";



// eslint-disable-next-line @typescript-eslint/no-explicit-any, max-len
export abstract class MessagingPublisher<T extends { topic: string, data: any }> {
	abstract topic: T["topic"];
	abstract acks?: number;
	abstract timeout?: number
	abstract compression?: CompressionTypes;

	abstract get messages(): CustomProducerMessage<T>[];
	abstract pushMessage(value: T["data"], key?: string | null, partition?: number, headers?: IHeaders, timestamp?: string): void;

	publish(): Promise<RecordMetadata[]> {
		let compression: CompressionTypes = CompressionTypes.Snappy;
		if (this.compression) compression = this.compression;

		const producer = messagingClient.producer;
		
		this.messages.forEach(ele => {
			ele.value = JSON.stringify(ele.value);
		});

		return producer.send({
			topic: this.topic,
			messages: this.messages,
			acks: this.acks,
			timeout: this.timeout,
			compression
		});
	}
}