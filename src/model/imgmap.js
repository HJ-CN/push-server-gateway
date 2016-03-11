import mongoose from'mongoose';
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let ImgmapSchema = new Schema({
	imgType: {type: String, default: '.jpg', required: true},
	//type: {type: String, default: 'global', required: true},
	src: { type: String, require: true, default:''},
    isDelete: { type: Boolean, default: false },
    create_time: { type: Number, default: Date.now() },
    update_time: { type: Number, default: Date.now() }
});

ImgmapSchema.pre('save', function(next) {
    this.update_time = Date.now();
    next();
});

let Imgmap = mongoose.model('Imgmap', ImgmapSchema);

export {Imgmap};