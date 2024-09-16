import { SignInStudentWithGmailResponseDTO } from "./sign-in-student-with-gmail.response.dto.type";


class SignInStudentWithGmailResponseDTOImpl implements
	SignInStudentWithGmailResponseDTO {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	accessToken: string;
	refreshToken: string;
}

export {
	SignInStudentWithGmailResponseDTOImpl
};