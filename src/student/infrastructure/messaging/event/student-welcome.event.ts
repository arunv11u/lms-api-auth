import { MessagingTopics } from "../../../../utils";


export interface StudentWelcomeEvent {
	topic: MessagingTopics.studentWelcomeEvent;
	data: {
		id: string;
		userId: string;
		firstName: string;
		lastName: string;
		email: string;
		version: number;
	};
}