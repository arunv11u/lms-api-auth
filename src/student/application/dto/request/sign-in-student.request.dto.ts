import { SignInStudentRequestDTO } from "./sign-in-student.request.dto.type";


class SignInStudentRequestDTOImpl implements SignInStudentRequestDTO {
	email: string;
	password: string;
}

export {
	SignInStudentRequestDTOImpl
};