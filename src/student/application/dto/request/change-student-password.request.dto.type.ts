

interface ChangeStudentPasswordRequestDTO {
	authorizationToken: string;
	password: string;
	oldPassword: string;
}

export {
	ChangeStudentPasswordRequestDTO
};