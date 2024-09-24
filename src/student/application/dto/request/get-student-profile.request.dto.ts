import { GetStudentProfileRequestDTO } from "./get-student-profile.request.dto.type";


class GetStudentProfileRequestDTOImpl implements
	GetStudentProfileRequestDTO {
	authorizationToken: string;
}

export {
	GetStudentProfileRequestDTOImpl
};