import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Cargo = sequelize.define(
    'cargos',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        descricao: {
            type: DataTypes.TEXT,
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'create_at',
        updatedAt: 'updated_at',
    }
);


export default Cargo;