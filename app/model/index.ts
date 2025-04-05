import mongoose, {models,model, Schema} from "mongoose"



export const connectDB = async() => {

    try {
        if(mongoose.connection.readyState === 1)
            return
        await mongoose.connect(process.env.DB_URI as string)
        console.log("Connected")
    } catch (error) {
        console.error(error)
    }
   
}


const grp_sch = new Schema({
    group_name: {type: String, required: true},
    group_id: {type: String, required: true, unique: true},
    members: [{user_id: String, username: {type: String}}]
})


export default models.Group || model("Group", grp_sch)