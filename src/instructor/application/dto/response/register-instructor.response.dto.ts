import { RegisterInstructorResponseDTO } from "./register-instructor.response.dto.type";


class RegisterInstructorResponseDTOImpl implements
	RegisterInstructorResponseDTO {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	accessToken: string;
	refreshToken: string;
}

export {
	RegisterInstructorResponseDTOImpl
};