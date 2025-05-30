import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Parametro = sequelize.define(
    'parametros',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        chave: {
            type: DataTypes.STRING(100),
        },
        valor: {
            type: DataTypes.INTEGER,
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'create_at',
        updatedAt: 'updated_at',
    }
);


export default Parametro;