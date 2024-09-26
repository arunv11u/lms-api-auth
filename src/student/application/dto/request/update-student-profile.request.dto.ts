import { UpdateStudentProfileRequestDTO } from "./update-student-profile.request.dto.type";


class UpdateStudentProfileRequestDTOImpl implements
	UpdateStudentProfileRequestDTO {
	authorizationToken: string;
	firstName: string | null = null;
	lastName: string | null = null;
	profilePicture: string | null = null;
}

export {
	UpdateStudentProfileRequestDTOImpl
};