import { MessagingTopics } from "../../../../utils";


export interface StudentUpdatedEvent {
	topic: MessagingTopics.studentUpdatedEvent;
	data: {
		id: string;
		userId: string;
		firstName: string;
		lastName: string;
		profilePicture: string | null;
		email: string;
		version: number;
	};
}