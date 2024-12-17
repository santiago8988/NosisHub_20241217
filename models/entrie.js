import mongoose, {model,models, Schema} from "mongoose";


delete mongoose.connection.models['Entrie']; 


const entrieSchema = new Schema ({

    record: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Record'
    },
    dueDate : {
        type : String,
    },
    nextCreated : {
        type : Boolean,
        default: false,
    },
    completedBy : {
        type : String,
    },
    completed : {
        type : Boolean,
        default: false,
    },
    pdf:{
        type:String
    },
    createdBy: {
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    values: {
        type: Object,
        required: true,
    },
    isActive: {
        type:Boolean,
        default: true,
    },
    comment: {
        type: String,
        maxlength: 5000, // Establece la longitud máxima del campo comment a 5000 caracteres
    },
    organization:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },
},{
    timestamps: { currentTime: () => new Date() }, // Guardar las fechas en formato local
}
)

const Entrie = models.Entrie || model('Entrie', entrieSchema);

export default Entrie;