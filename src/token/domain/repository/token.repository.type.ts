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
}