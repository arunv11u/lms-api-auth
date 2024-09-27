import { RegisterInstructorRequestDTO } from "./register-instructor.request.dto.type";


class RegisterInstructorRequestDTOImpl implements RegisterInstructorRequestDTO {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export {
	RegisterInstructorRequestDTOImpl
};