import mongoose from'mongoose';
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let AudioSchema = new Schema({
  name: { type: String, require: true, default: '' },
  src: { type: String, require: true, default: ''},
  isDelete: { type: Boolean, 'default': false },
  create_time: { type: Number, 'default': Date.now() },
  update_time: { type: Number, 'default': Date.now() }
});

AudioSchema.pre('save', function(next) {
  this.update_time = Date.now();
  next();
});

let Audio = mongoose.model('Audio', AudioSchema);

export {Audio};