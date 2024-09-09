import { DataTypes, Model } from "sequelize";
import { postgresqlConnect } from "../../../utils";

const sequelize = postgresqlConnect.postgresClient;

class User extends Model { }


User.init({
	id: {
		type: DataTypes.UUIDV4,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	role: {
		type: DataTypes.ENUM,
		values: ["INSTRUCTOR", "STUDENT"]
	},
	version: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	sequelize,
	modelName: "User",
	tableName: "users",
	timestamps: true
});


export {
	User
};