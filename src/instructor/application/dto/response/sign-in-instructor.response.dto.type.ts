

interface SignInInstructorResponseDTO {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	accessToken: string;
	refreshToken: string;
	profilePicture: string | null;
}

export {
	SignInInstructorResponseDTO
};