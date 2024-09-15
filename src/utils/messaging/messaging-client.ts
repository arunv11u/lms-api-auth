import {
	Consumer,
	ConsumerConfig,
	ConsumerRunConfig,
	Kafka,
	Producer,
	ProducerConfig
} from "kafkajs";
import { ErrorCodes, MessageQueue } from "../types";
import { GenericError } from "../errors";
import { MessagingListener } from "./messaging-listener";


class MessagingClient extends MessageQueue {
	private _isProducerReq: boolean = false;
	private _isConsumerReq: boolean = false;
	private _clientId: string | null = null;
	private _brokers: string[] | null = null;
	private _kafka: Kafka | null = null;
	private _producer: Producer | null = null;
	private _consumer: Consumer | null = null;
	private _producerConfig: ProducerConfig | null = null;
	private _consumerConfig: ConsumerConfig | null = null;
	private _consumerRunConfig: ConsumerRunConfig | null = null;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, max-len
	private _listeners: MessagingListener<{topic: string, data: any}>[] | null = null;

	get producer() {
		if (!this._isProducerReq)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("Cannot get producer, if _isProducerReq is set to false"),
				errorCode: 500
			});
		if (!this._producer)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("Cannot get producer before initialising kafka client"),
				errorCode: 500
			});

		return this._producer;
	}

	get consumer() {
		if (!this._isConsumerReq)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("Cannot get consumer, if _isConsumerReq is set to false"),
				errorCode: 500
			});
		if (!this._consumer)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("Cannot get consumer before initialising kafka client"),
				errorCode: 500
			});

		return this._consumer;
	}

	get isProducerReq() {
		return this._isProducerReq;
	}

	get isConsumerReq() {
		return this._isConsumerReq;
	}

	set clientId(clientId: string) {
		if (this._clientId)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("_clientId cannot be changed once you set it"),
				errorCode: 500
			});

		this._clientId = clientId;
	}

	set brokers(brokers: string[]) {
		if (this._brokers)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("_brokers cannot be changed once you set it"),
				errorCode: 500
			});

		this._brokers = brokers;
	}

	set producerConfig(producerConfig: ProducerConfig) {
		if (this._producerConfig)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("_producerConfig cannot be changed once you set it"),
				errorCode: 500
			}
			);

		this._producerConfig = producerConfig;
	}

	set consumerConfig(consumerConfig: ConsumerConfig) {
		if (this._consumerConfig)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("_consumerConfig cannot be changed once you set it"),
				errorCode: 500
			});

		this._consumerConfig = consumerConfig;
	}

	set consumerRunConfig(consumerRunConfig: ConsumerRunConfig) {
		if (this._consumerRunConfig)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("_consumerRunConfig cannot be changed once you set it"),
				errorCode: 500
			});

		this._consumerRunConfig = consumerRunConfig;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	set listeners(listeners: MessagingListener<any>[]) {
		if (this._listeners)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("_listeners cannot be changed once you set it"),
				errorCode: 500
			});

		this._listeners = listeners;
	}

	setup(isProducerReq: boolean, isConsumerReq: boolean) {
		if (!isProducerReq && !isConsumerReq)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("Either producer or consumer is required to setup the kafka client"),
				errorCode: 500
			});

		this._isProducerReq = isProducerReq;
		this._isConsumerReq = isConsumerReq;
	}

	init(): void {
		if (!this._isProducerReq && !this._isConsumerReq)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("Either producer or consumer is required to setup the kafka client"),
				errorCode: 500
			});
		if (!this._clientId)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("_clientId must be set before kafka client init"),
				errorCode: 500
			});
		if (!this._brokers)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("_brokers must be set before kafka client init"),
				errorCode: 500
			});
		if (this._kafka)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("init method cannot be called more than once"),
				errorCode: 500
			});

		this._kafka = new Kafka({
			clientId: this._clientId,
			brokers: this._brokers,
		});

		if (this._isProducerReq) this.producerInit();
		if (this._isConsumerReq) this.consumerInit();
	}

	async onConnect(): Promise<void> {
		if (!this._isProducerReq && !this._isConsumerReq)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("Either producer or consumer is required to setup the kafka client"),
				errorCode: 500
			});

		if (this._isProducerReq) {
			if (!this._producer)
				throw new GenericError({
					code: ErrorCodes.internalError,
					error: new Error("_producer must be set before connecting kafka client"),
					errorCode: 500
				});

			await this._producer.connect();
		}

		if (this._isConsumerReq) {
			if (!this._consumer)
				throw new GenericError({
					code: ErrorCodes.internalError,
					error: new Error("_consumer must be set before connecting kafka client"),
					errorCode: 500
				});

			await this._consumer.connect();
		}
	}

	async onSubscribe(): Promise<void> {
		if (this._isConsumerReq) {
			if (!this._listeners)
				throw new GenericError({
					code: ErrorCodes.internalError,
					error: new Error("_listeners must be set before subscribing kafka topics"),
					errorCode: 500
				});
			if (!this._consumer)
				throw new GenericError({
					code: ErrorCodes.internalError,
					error: new Error("_consumer must be set before subscribing kafka topics"),
					errorCode: 500
				});
			if (!this._consumerRunConfig)
				throw new GenericError({
					code: ErrorCodes.internalError,
					error: new Error("_consumerRunConfig must be set before subscribing kafka topics"),
					errorCode: 500
				});

			const subscriberPromises = this._listeners
				.map(
					async (
						// eslint-disable-next-line max-len
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						ele: MessagingListener<{ topic: string; data: any; }>
					) => await ele.subscribe()
				);
			await Promise.all(subscriberPromises);

			await this._consumer.run(this._consumerRunConfig);
		}
	}

	private producerInit() {
		if (!this._kafka)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("_kafka must be set to initialise kafka producer"),
				errorCode: 500
			});

		if (this._producerConfig)
			this._producer = this._kafka.producer(this._producerConfig);
		else this._producer = this._kafka.producer();
	}

	private consumerInit() {
		if (!this._kafka)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("_kafka must be set to initialise kafka consumer"),
				errorCode: 500
			});
		if (!this._consumerConfig)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("_consumerConfig must be set to initialise kafka consumer"),
				errorCode: 500
			});

		this._consumer = this._kafka.consumer(this._consumerConfig);
	}
}

const messagingClient = new MessagingClient();

export {
	MessagingClient,
	messagingClient
};