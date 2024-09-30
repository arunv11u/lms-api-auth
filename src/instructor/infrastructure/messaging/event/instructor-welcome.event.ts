import { MessagingTopics } from "../../../../utils";


export interface InstructorWelcomeEvent {
	topic: MessagingTopics.instructorWelcomeEvent;
	data: {
		id: string;
		userId: string;
		firstName: string;
		lastName: string;
		email: string;
		version: number;
	};
}