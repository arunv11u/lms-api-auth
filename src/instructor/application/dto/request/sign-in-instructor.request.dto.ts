import { SignInInstructorRequestDTO } from "./sign-in-instructor.request.dto.type";


class SignInInstructorRequestDTOImpl implements SignInInstructorRequestDTO {
	email: string;
	password: string;
}

export {
	SignInInstructorRequestDTOImpl
};