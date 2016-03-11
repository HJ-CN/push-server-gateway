import mongoose from'mongoose';
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let VideoSchema = new Schema({
  name: { type: String, require: true },
  src: { type: String, require: true },
  imgsrc: { type: String, require: true },
  isDelete: { type: Boolean, 'default': false },
  create_time: { type: Number, 'default': Date.now() },
  update_time: { type: Number, 'default': Date.now() }
});

VideoSchema.pre('save', function(next) {
  this.update_time = Date.now();
  next();
});

let Video = mongoose.model('Video', VideoSchema);

export {Video};