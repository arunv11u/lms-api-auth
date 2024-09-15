import { Repository } from "../../../utils";
import { StudentEntity } from "../entity";


export abstract class StudentRepository extends Repository {
	abstract getId(): string;
	abstract getUserIdWithStudentId(id: string): Promise<string>;
	abstract register(student: StudentEntity): Promise<StudentEntity>;
	abstract signInWithEmail(
		email: string, 
		password: string
	): Promise<{ isValidCredentials: boolean }>;
	abstract getUserWithEmail(email: string): Promise<StudentEntity>;
}