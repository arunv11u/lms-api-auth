

interface SignInInstructorResponseDTO {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	designation: string | null;
	accessToken: string;
	refreshToken: string;
	profilePicture: string | null;
}

export {
	SignInInstructorResponseDTO
};