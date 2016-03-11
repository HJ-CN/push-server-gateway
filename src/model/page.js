import mongoose from'mongoose';
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let PageSchema = new Schema({
 // order: { type: String, require: true, uniq: true},
  name: { type: String, default: ''},
  content: {
    items:{type:Array},
    backgroundImage:{type:String,default: ''}
  },
  magazine: { type: ObjectId, require: true, ref: 'Magazine' },
 // magazine: { type: Number, require: true },
  isDelete: { type: Boolean, 'default': false },
  create_time: { type: Number, 'default': Date.now() },
  update_time: { type: Number, 'default': Date.now() }
});

PageSchema.pre('save', function(next) {
  this.update_time = Date.now();
  next();
});

let Page = mongoose.model('Page', PageSchema);

export {Page};