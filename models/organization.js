import mongoose, { model, models, Schema } from 'mongoose';
import Role from './role';
// Verificar y eliminar el modelo si ya existe en la conexión actual
if (models && models.Organization) {
    delete mongoose.connection.models['Organization'];
}

const areaSchema = new Schema({
    name: {
        type: String,
    },
    areaLeader: {
        type: String,
    },
    collaborators: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AllowedUser',
        },
    ],
});

const qualityAssuranceSchema=new Schema({
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'AllowedUser',
          required: true
        },
        roles: [{
          type: String,
          enum: ['revisar', 'aprobar', 'publicar'],
          required: true
        }]    
})


const organizationSchema = new Schema({
    name: {
        type: String,
    },
    qualityAssurance: [qualityAssuranceSchema],
    areas: [areaSchema],
    roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Role',                        
        },
      ],
    organizationEmail: {
        type: String,
    },
});

// Virtual para poblar colaboradores
areaSchema.virtual('populatedCollaborators', {
    ref: 'AllowedUser', // Referencia al modelo AllowedUser
    localField: 'collaborators', // Campo local en areaSchema que contiene los IDs de los colaboradores
    foreignField: '_id',        // Campo en AllowedUser que se usará para la coincidencia
  });

  organizationSchema.virtual('populatedQualityAssurance', {
    ref: 'AllowedUser', // Modelo al que se hace referencia
    localField: 'qualityAssurance.user', // Campo local que contiene el ID del usuario
    foreignField: '_id',               // Campo en el modelo AllowedUser que se usará para la coincidencia
    justOne: false, // Indica que cada elemento de qualityAssurance puede tener varios usuarios
  });

// Crear el modelo si no existe, si existe, usar el existente
const Organization = models.Organization || model('Organization', organizationSchema);

export default Organization;



/*import mongoose, {model,models, Schema} from "mongoose";

delete mongoose.connection.models['Organization']; 


const areaSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    areaLeader:{
        type: String,
    },
    collaborators :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        
    ],
})

const roleSchema = new mongoose.Schema({
        name:{
            type: String,
        },
        createdBy:{
            type: String,
        }
    },
    {
        timestamps: { currentTime: () => new Date() }, // Guardar las fechas en formato local
    }
)

const organizationSchema = new Schema({
    name:{
        type:String,
    },
    qualityAssurance:[
        {
            type:String,
        }
    ],
    areas : [
        areaSchema
    ],
    roles: [
        roleSchema,
    ],
    organizationEmail:{
        type:String,
    }
})

const Organization = models.Organization || model('Organization', organizationSchema);


export default Organization;*/