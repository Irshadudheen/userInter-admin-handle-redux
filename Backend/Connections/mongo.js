import mongoose from 'mongoose'

const DbUrl = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.URL_Mongoo)
        console.log(conn.connection.host);
    } catch (error) {
        console.error(error.message)
        process.exit(1); 
    }
}
export default DbUrl