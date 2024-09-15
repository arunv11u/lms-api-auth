import { MessagingTopics } from "../../../../utils";


export interface StudentCreatedEvent {
	topic: MessagingTopics.studentCreatedEvent;
	data: {
		id: string;
		userId: string;
		firstName: string;
		lastName: string;
		email: string;
		version: number;
	};
}