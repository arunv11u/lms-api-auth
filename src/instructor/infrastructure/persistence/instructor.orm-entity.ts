import { DataTypes, Model, Optional } from "sequelize";
import { postgresqlConnect } from "../../../utils";

enum InstructorSignupMethods {
	emailPassword = "EMAIL_PASSWORD",
	googleOAuth = "GOOGLE_OAUTH"
}

class InstructorORMEntity {
	id: string;
	user_id: string;
	first_name: string;
	last_name: string;
	profile_picture: string | null;
	email: string;
	password: string | null;
	signup_method: InstructorSignupMethods;
	created_by: string;
	last_modified_by: string;
	created_at?: Date;
	last_modified_at?: Date;
	version: number;
}

interface InstructorCreationAttributes extends Optional<InstructorORMEntity, "id" | "created_at" | "last_modified_at"> { }

type Instructor = Model<InstructorORMEntity, InstructorCreationAttributes>;

function initializeInstructorModel() {
	const sequelize = postgresqlConnect.postgresClient;

	sequelize.define<Instructor>("Instructor", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		user_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id"
			}
		},
		first_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		last_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		profile_picture: {
			type: DataTypes.STRING,
			allowNull: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true
		},
		signup_method: {
			type: DataTypes.STRING,
			values: [
				InstructorSignupMethods.emailPassword,
				InstructorSignupMethods.googleOAuth
			]
		},
		created_by: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id"
			}
		},
		last_modified_by: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id"
			}
		},
		version: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		tableName: "instructors",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "last_modified_at"
	});
}

function setupInstructorAssociations() {
	const sequelize = postgresqlConnect.postgresClient;
	const Instructor = sequelize.models["Instructor"];
	const User = sequelize.models["User"];

	Instructor.belongsTo(User, {
		foreignKey: "user_id",
		as: "user"
	});

	Instructor.belongsTo(User, {
		foreignKey: "created_by",
		as: "creator"
	});

	Instructor.belongsTo(User, {
		foreignKey: "last_modified_by",
		as: "modifier"
	});
}


export {
	InstructorSignupMethods,
	InstructorORMEntity,
	InstructorCreationAttributes,
	initializeInstructorModel,
	setupInstructorAssociations
};