import { MessagingTopics } from "../../../../utils";


export interface InstructorCreatedEvent {
	topic: MessagingTopics.instructorCreatedEvent;
	data: {
		id: string;
		userId: string;
		firstName: string;
		lastName: string;
		email: string;
		version: number;
	};
}