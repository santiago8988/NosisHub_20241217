// models/role.js
import mongoose, { model, models, Schema } from 'mongoose';

delete mongoose.connection.models['Role'];

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        createdBy: {
            type: String,
        },
        organization:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization', 
        }
    },
    {
        timestamps: { currentTime: () => new Date() }, // Guardar las fechas en formato local
    }
);

const Role = models.Role || model('Role', roleSchema);
export default Role;