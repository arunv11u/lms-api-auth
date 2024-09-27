import { GetInstructorProfileResponseDTO } from "./get-instructor-profile.response.dto.type";


class GetInstructorProfileResponseDTOImpl implements
	GetInstructorProfileResponseDTO {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	profilePicture: string | null = null;
}

export {
	GetInstructorProfileResponseDTOImpl
};