import { UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { InstructorObject, InstructorRepository } from "../../domain";
import { ForgotInstructorPasswordRequestDTO } from "../dto";
import { ForgotInstructorPasswordUseCase } from "./forgot-instructor-password.use-case.type";



export class ForgotInstructorPasswordUseCaseImpl implements
	ForgotInstructorPasswordUseCase, InstructorObject {
	private _unitOfWork: UnitOfWork;
	private _forgotInstructorPasswordRequestDTO:
		ForgotInstructorPasswordRequestDTO;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
	}

	set forgotInstructorPasswordRequestDTO(
		forgotInstructorPasswordRequestDTO: ForgotInstructorPasswordRequestDTO
	) {
		this._forgotInstructorPasswordRequestDTO =
			forgotInstructorPasswordRequestDTO;
	}

	async execute(): Promise<void> {
		const instructorRepository = this._unitOfWork.getRepository("InstructorRepository") as InstructorRepository;

		await instructorRepository.forgotInstructorPassword(
			this._forgotInstructorPasswordRequestDTO.email
		);
	}
}