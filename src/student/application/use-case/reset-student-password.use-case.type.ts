import { UseCase } from "../../../utils";
import { ResetStudentPasswordRequestDTO } from "../dto";


export abstract class ResetStudentPasswordUseCase implements UseCase {
	abstract set resetStudentPasswordRequestDTO(
		resetStudentPasswordRequestDTO: ResetStudentPasswordRequestDTO
	);

	abstract execute(): Promise<void>;
}