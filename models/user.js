import mongoose, {model,models, Schema} from "mongoose";

//si esta cacheado usar esto
delete mongoose.connection.models['User']; 

const userSchema = new Schema ({

    name: {
        type : String,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
    },
    emailVerified:{
        type: Boolean,
        default: false,
    }
    

})



//const Record = mongoose.model('Record', recordSchema);

const User = models.User || model('User', userSchema);

export default User;