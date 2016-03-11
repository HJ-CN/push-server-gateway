import mongoose from'mongoose';
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let ChannelSchema = new Schema({
    name: { type: String, require: true, default: '默认名称'},
    isDelete: { type: Boolean, 'default': false },
    create_time: { type: Number, 'default': Date.now() },
    update_time: { type: Number, 'default': Date.now() }
});

ChannelSchema.pre('save', function(next) {
    this.update_time = Date.now();
    next();
});

let Channel = mongoose.model('Channel', ChannelSchema);

export {Channel};