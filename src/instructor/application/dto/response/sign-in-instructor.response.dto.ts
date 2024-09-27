import { SignInInstructorResponseDTO } from "./sign-in-instructor.response.dto.type";


class SignInInstructorResponseDTOImpl implements SignInInstructorResponseDTO {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	accessToken: string;
	refreshToken: string;
	profilePicture: string | null = null;
}

export {
	SignInInstructorResponseDTOImpl
};