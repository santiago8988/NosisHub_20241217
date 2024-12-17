import mongoose, {model,models, Schema} from "mongoose";


delete mongoose.connection.models['Files'];


const fileSchema = new Schema({

    data: {
        type: Buffer
    },
    contentType: {
       type: String
    },
    originalFileName: {
        type: String
    },
},
{
    timestamps: { currentTime: () => new Date() }, // Guardar las fechas en formato local
}
)


const File = models.File || model('File', fileSchema);

export default File;