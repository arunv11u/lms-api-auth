import { InstructorEntity } from "../../../instructor";
import { StudentEntity } from "../../../student";
import { Repository } from "../../../utils";


export abstract class TokenRepository extends Repository {

	abstract createAccessTokenForStudent(
		sessionId: string,
		student: StudentEntity
	): Promise<string>;

	abstract createRefreshTokenForStudent(
		sessionId: string,
		student: StudentEntity
	): Promise<string>;

	abstract validateStudentAuthorizationToken(
		authorizationToken: string
	): Promise<StudentEntity>;

	abstract createAccessTokenForInstructor(
		sessionId: string,
		instructor: InstructorEntity
	): Promise<string>;

	abstract createRefreshTokenForInstructor(
		sessionId: string,
		instructor: InstructorEntity
	): Promise<string>;

	abstract validateInstructorAuthorizationToken(
		authorizationToken: string
	): Promise<InstructorEntity>;

	abstract generateTokenPairWithRefreshToken(
		refreshToken: string
	): Promise<{ accessToken: string, refreshToken: string }>;
}