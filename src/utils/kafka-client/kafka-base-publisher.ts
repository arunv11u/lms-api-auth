import { CompressionTypes, IHeaders, RecordMetadata } from "kafkajs";
import { KafkaClient } from "./kafka-client";
import { CustomProducerMessage } from "../types";


const kafkaClient = KafkaClient.getInstance();


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class Publisher<T extends { topic: string, data: any }> {
	abstract topic: T["topic"];
	abstract acks?: number;
	abstract timeout?: number
	abstract compression?: CompressionTypes;



	abstract get messages(): CustomProducerMessage<T>[];
	abstract pushMessage(value: T["data"], key?: string | null, partition?: number, headers?: IHeaders, timestamp?: string): void;

	publish(): Promise<RecordMetadata[]> {
		let compression: CompressionTypes = CompressionTypes.Snappy;
		if (this.compression) compression = this.compression;

		const producer = kafkaClient.producer;
		
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