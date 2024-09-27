import { SignInInstructorWithGmailRequestDTO } from "./sign-in-instructor-with-gmail.request.dto.type";


class SignInInstructorWithGmailRequestDTOImpl implements
	SignInInstructorWithGmailRequestDTO {
	authCode: string;
	redirectUri: string;
}

export {
	SignInInstructorWithGmailRequestDTOImpl
};