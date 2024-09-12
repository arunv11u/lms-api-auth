import { Repository } from "../../../utils";



export abstract class UserRepository extends Repository {
	abstract getId(): string;
}