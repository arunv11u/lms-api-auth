import { Repository } from "../../../utils";
import { InstructorEntity } from "../entity";


export abstract class InstructorRepository extends Repository {
	abstract getId(): string;
	abstract getUserIdWithInstructorId(id: string): Promise<string>;
	abstract register(instructor: InstructorEntity): Promise<InstructorEntity>;
}