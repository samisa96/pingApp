import mongoose from "mongoose";
const Schema = mongoose.Schema;

const postPingSchema = new Schema({
  host: {
    type: String,
    required: true,
  },
  pingCount: {
    type: Number,
    default: 0,
  },
});

const PostPing = mongoose.model("postPing", postPingSchema);
export default PostPing;
