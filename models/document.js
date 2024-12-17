import mongoose, {model,models, Schema} from "mongoose";

delete mongoose.connection.models['Document'];

const paragraphSchema = new Schema({

    title:{
        type: String,
    },
    body:{
        type: String,
    },
    image: {
        type: String,
    },
    addedBy:{
        type:String,
    }
})



const documentSchema = new Schema({

    name:{
        type: String,
    },
    area:{
        type:String,
    },
    dueDate:{
        type:String,
    },
    revision:{
        type:Number,
    },
    notify:{
        type:Number,
        default: 30
    },
    version:{
        type: Number,
        default:1,
    },

    createdBy:{
        type:String,
    },

    approvedBy:{
        type:String,
    },

    reviewedBy:{
        type:String,
    },

    pdf:{
        type:String
    },

    content:[
        paragraphSchema
    ],

    access: {
        type: [
          {
            role: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Organization.roles', // Referencia al subdocumento de roles en el modelo Organization
            },
            permissionLevel: {
              type: String,
              enum: ['read', 'write', 'admin'],
              default: 'read',
            },
          },
        ],
        default: [],
      },

    status:{
        type: String,
        default: "draft",
        enum: ['draft', 'created', 'reviewed', 'approved','published','obsolete']
    },

    organization:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },

    isActive: {
        type: Boolean,
        default: false,
    },
    revisionCreated:{
        type: Boolean,
        default:false
    }
},
{
    timestamps: true,
    toJSON: { virtuals: true }, // Habilitar virtuals para populate virtual
    toObject: { virtuals: true },
  }
)

// Virtual populate (opcional)
documentSchema.virtual('accessRoles', {
    ref: 'Organization',
    localField: 'organization',
    foreignField: '_id',
    justOne: true, // Solo necesitamos una organización
    populate: { 
      path: 'roles',
      select: 'name', // O los campos que necesites
    },
  });

const Document = models.Document || model('Document', documentSchema);

export default Document;