import { RegisterStudentResponseDTO } from "./register-student.response.dto.type";


class RegisterStudentResponseDTOImpl implements RegisterStudentResponseDTO {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	accessToken: string;
	refreshToken: string;
}

export {
	RegisterStudentResponseDTOImpl
};