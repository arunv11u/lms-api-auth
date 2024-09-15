/* eslint-disable max-classes-per-file */
import {
	Consumer,
	ConsumerConfig,
	ConsumerRunConfig,
	IHeaders,
	Producer,
	ProducerConfig
} from "kafkajs";
import { MessagingListener } from "../../messaging";



abstract class MessageQueue {
	abstract get producer(): Producer;
	abstract get consumer(): Consumer;
	abstract get isProducerReq(): boolean;
	abstract get isConsumerReq(): boolean;
	abstract set clientId(clientId: string);
	abstract set brokers(brokers: string[]);
	abstract set producerConfig(producerConfig: ProducerConfig);
	abstract set consumerConfig(consumerConfig: ConsumerConfig);
	abstract set consumerRunConfig(consumerRunConfig: ConsumerRunConfig);
	abstract set listeners(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		listeners: MessagingListener<{ topic: string, data: any }>[]
	);

	abstract setup(isProducerReq: boolean, isConsumerReq: boolean): void;
	abstract init(): void;
	abstract onConnect(): Promise<void>;
	abstract onSubscribe(): Promise<void>;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CustomProducerMessage<T extends { topic: string, data: any }> {
	key?: string | null;
	value: T["data"] | null;
	partition?: number;
	headers?: IHeaders;
	timestamp?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CustomConsumerMessage<T extends { topic: string, data: any }> {
	key: string | undefined;
	value: T["data"] | null;
	timestamp: string;
	size: number;
	attributes: number;
	offset: string;
	headers?: IHeaders;
}



export {
	MessageQueue,
	CustomProducerMessage,
	CustomConsumerMessage
};