import { MessagingTopics } from "../../../../utils";


export interface StudentForgotPasswordEvent {
	topic: MessagingTopics.studentForgotPasswordEvent;
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