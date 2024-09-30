import { MessagingTopics } from "../../../../utils";


export interface InstructorForgotPasswordEvent {
	topic: MessagingTopics.instructorForgotPasswordEvent;
	data: {
		id: string;
		userId: string;
		firstName: string;
		lastName: string;
		email: string;
		verificationCode: string;
		version: number;
	};
}