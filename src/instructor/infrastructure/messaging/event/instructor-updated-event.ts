import { MessagingTopics } from "../../../../utils";


export interface InstructorUpdatedEvent {
	topic: MessagingTopics.instructorUpdatedEvent;
	data: {
		id: string;
		userId: string;
		firstName: string;
		lastName: string;
		designation: string | null;
		profilePicture: string | null;
		email: string;
		version: number;
	};
}