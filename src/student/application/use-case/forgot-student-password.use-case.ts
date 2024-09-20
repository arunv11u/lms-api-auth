import { UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { StudentObject, StudentRepository } from "../../domain";
import { ForgotStudentPasswordRequestDTO } from "../dto";
import { ForgotStudentPasswordUseCase } from "./forgot-student-password.use-case.type";



export class ForgotStudentPasswordUseCaseImpl implements
	ForgotStudentPasswordUseCase, StudentObject {
	private _unitOfWork: UnitOfWork;
	private _forgotStudentPasswordRequestDTO: ForgotStudentPasswordRequestDTO;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
	}

	set forgotStudentPasswordRequestDTO(
		forgotStudentPasswordRequestDTO: ForgotStudentPasswordRequestDTO
	) {
		this._forgotStudentPasswordRequestDTO = forgotStudentPasswordRequestDTO;
	}

	async execute(): Promise<void> {
		const studentRepository = this._unitOfWork.getRepository("StudentRepository") as StudentRepository;

		await studentRepository.forgotStudentPassword(
			this._forgotStudentPasswordRequestDTO.email
		);
	}
}