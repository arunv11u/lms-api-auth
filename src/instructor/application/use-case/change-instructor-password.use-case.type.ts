import { UseCase } from "../../../utils";
import { ChangeInstructorPasswordRequestDTO } from "../dto";


export abstract class ChangeInstructorPasswordUseCase implements UseCase {
	abstract set changeInstructorPasswordRequestDTO(
		changeInstructorPasswordRequestDTO: ChangeInstructorPasswordRequestDTO
	);

	abstract execute(): Promise<void>;
}