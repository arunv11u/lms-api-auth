import { UpdateInstructorProfileResponseDTO } from "./update-instructor-profile.response.dto.type";


class UpdateInstructorProfileResponseDTOImpl implements
	UpdateInstructorProfileResponseDTO {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	designation: string | null = null;
	profilePicture: string | null = null;
}

export {
	UpdateInstructorProfileResponseDTOImpl
};