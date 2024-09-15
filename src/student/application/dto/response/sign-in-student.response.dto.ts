import { SignInStudentResponseDTO } from "./sign-in-student.response.dto.type";


class SignInStudentResponseDTOImpl implements SignInStudentResponseDTO {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	accessToken: string;
	refreshToken: string;
}

export {
	SignInStudentResponseDTOImpl
};