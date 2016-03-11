import mongoose from 'mongoose';
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let TemplateSchema = new Schema({
	//imageUrl: {type: String, require: true, default: ''},
	name: {type: String, require: true, default: ''},
    imageUrl:{type: String, require: true, default: ''},
	content: {type: Object, require: true, default: ''},
    isDelete: { type: Boolean, default: false },
  	create_time: { type: Number, default: Date.now() },
 	update_time: { type: Number, default: Date.now() }
});

TemplateSchema.pre('save', function(next) {
  this.update_time = Date.now();
  next();
});

let Template = mongoose.model('Template', TemplateSchema);

export {Template};