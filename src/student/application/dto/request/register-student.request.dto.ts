import { RegisterStudentRequestDTO } from "./register-student.request.dto.type";


class RegisterStudentRequestDTOImpl implements RegisterStudentRequestDTO {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export {
	RegisterStudentRequestDTOImpl
};