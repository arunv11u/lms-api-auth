import { UseCase } from "../../../utils";
import { ChangeStudentPasswordRequestDTO } from "../dto";


export abstract class ChangeStudentPasswordUseCase implements UseCase {
	abstract set changeStudentPasswordRequestDTO(
		changeStudentPasswordRequestDTO: ChangeStudentPasswordRequestDTO
	);

	abstract execute(): Promise<void>;
}