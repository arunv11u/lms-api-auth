import { SignInStudentWithGmailRequestDTO } from "./sign-in-student-with-gmail.request.dto.type";


class SignInStudentWithGmailRequestDTOImpl implements
	SignInStudentWithGmailRequestDTO {
	authCode: string;
	redirectUri: string;
}

export {
	SignInStudentWithGmailRequestDTOImpl
};