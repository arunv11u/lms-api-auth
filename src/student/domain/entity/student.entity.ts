import { StudentObject } from "../student-object.type";
import { StudentEntity } from "./student.entity.type";



class StudentEntityImpl implements StudentEntity, StudentObject {
	private _id: string;
	private _firstName: string;
	private _lastName: string;
	private _profilePicture: string | null = null;
	private _email: string;
	private _password: string | null = null;

	get id(): string {
		return this._id;
	}
	set id(id: string) {
		this._id = id;
	}

	get firstName(): string {
		return this._firstName;
	}
	set firstName(firstName: string) {
		this._firstName = firstName;
	}

	get lastName(): string {
		return this._lastName;
	}
	set lastName(lastName: string) {
		this._lastName = lastName;
	}

	get profilePicture(): string | null {
		return this._profilePicture;
	}
	set profilePicture(profilePicture: string | null) {
		this._profilePicture = profilePicture;
	}

	get email(): string {
		return this._email;
	}
	set email(email: string) {
		this._email = email;
	}

	get password(): string | null {
		return this._password;
	}
	set password(password: string | null) {
		this._password = password;
	}
}

export {
	StudentEntityImpl
};