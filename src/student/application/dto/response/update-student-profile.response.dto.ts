import { UpdateStudentProfileResponseDTO } from "./update-student-profile.response.dto.type";


class UpdateStudentProfileResponseDTOImpl implements
	UpdateStudentProfileResponseDTO {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	profilePicture: string | null = null;
}

export {
	UpdateStudentProfileResponseDTOImpl
};