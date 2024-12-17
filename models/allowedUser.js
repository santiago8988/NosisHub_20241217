import mongoose, {model,models, Schema} from "mongoose";


delete mongoose.connection.models['AllowedUser'];


const allowedUserSchema = new Schema({

    fullName:{
        type: String,
        unique:true,
    },
    email:{
        type:String,
    },
    mobile:{
        type: String,
    },
    role:{
        type:String,
        enum:['owner','admin','user']
    },
    position: {
        type: [String], // Definir como un array de strings
    },
    
    area:{
        type:String,
    },
    createdBy:{
        type:String,
    },

    isActive: {
        type: String,
        default: 'active',
        enum: ['active','inactive']
    },
    organization:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    }
},
{
    timestamps: { currentTime: () => new Date() }, // Guardar las fechas en formato local
}
)


const AllowedUser = models.AllowedUser || model('AllowedUser', allowedUserSchema);

export default AllowedUser;