import organization from "@/app/organization/page";
import mongoose, {model,models, Schema} from "mongoose";

//si esta cacheado usar esto
delete mongoose.connection.models['Record']; 

const actionSchema = new mongoose.Schema({

    actionKey : {
        type: String
    },
    mappings: {
        type: Object,
    },
    recordField :{
        type : String,
    }, 
    writeOnRecord : {
        type : String,
    },   
    writeOnField : {
        type : String,
    },
    quantityType: {
            type : String
    },
    quantityField :{
        type : String,
    },
    quantityNumber:{
        type : Number,
    },
    createdBy : {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
 
  });

const recordSchema = new Schema ({

    name : {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required:true,
    },
    periodicity: {
        type : Number,
    },
    notify: {
        type : Number,
    },
    description:{
        type: String,
    },
    nextReview: {
        type : Number,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AllowedUser',
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    version: {
        type : Number,
        default:1,
    },
    isActive : {
        type: Boolean,
        default: true,
    },
    own: {
        type: Object,
    },
    identifier: [{
        type : String,
    }
    ],
    actions : [
        actionSchema
    ],
    collaborators :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AllowedUser'
        } 
    ],
    organization:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    }
    

})



//const Record = mongoose.model('Record', recordSchema);

const Record = models.Record || model('Record', recordSchema);

export default Record;