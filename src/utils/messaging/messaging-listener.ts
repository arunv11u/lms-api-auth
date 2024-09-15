import { KafkaMessage, Message } from "kafkajs";
import { CustomConsumerMessage } from "../types";


// eslint-disable-next-line @typescript-eslint/no-explicit-any, max-len
export abstract class MessagingListener<T extends { topic: string, data: any }> {
	abstract topic: T["topic"];
	abstract fromBeginning: boolean | undefined;

	abstract subscribe(): Promise<void>;
	abstract onMessages(
		message: CustomConsumerMessage<T>,
		heartbeat?: () => Promise<void>
	): Promise<void>;

	private parseMessage<T>(msg: Message): T | null {
		const data = msg.value;

		if (!data) return null;

		if (typeof data === "string") {
			const stringifiedData = data.toString();
			return JSON.parse(stringifiedData);
		} else return JSON.parse(data.toString("utf8"));
	}

	private convert(message: KafkaMessage): CustomConsumerMessage<T> {
		const key = message.key?.toString();
		const value = this.parseMessage<T["data"]>(message);
		const size = message.size ?? 0;

		return {
			...message,
			key,
			value,
			size
		};
	}

	async listen(message: KafkaMessage, heartbeat?: () => Promise<void>) {
		const convertedRecord = this.convert(message);
		await this.onMessages(convertedRecord, heartbeat);
	}
}