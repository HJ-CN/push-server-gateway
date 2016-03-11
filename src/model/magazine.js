import mongoose from'mongoose';
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let MagazineSchema = new Schema({
    title: { type: String, require: true, default:''},
    journal: { type: String, require: true, default: ''},
    author: { type: String, require: true, default:'' },
    copyright:{ type: String, require: true, default:'' },
    state: { type: String, require: true, default: '未发布'},
    tag: { type: Array, require: true, default: []}, //待定，如果这里的标签是可以更改的，那么这里需要存id
    channel: { type: ObjectId, require: true, ref: 'Channel'},
    //channel: { type: Number, require: true},
    backgroundAudio: { type: String, default:'' },
    pageList: { type: Array, require: true, default: []},//记录所以页面的_id,用于排序页面
    isDelete: { type: Boolean, 'default': false },
    create_time: { type: Number, 'default': Date.now() },
    update_time: { type: Number, 'default': Date.now() }
});

MagazineSchema.pre('save', function(next){
    this.update_time = Date.now();
    next();
});

let Magazine = mongoose.model('Magazine', MagazineSchema);

export {Magazine};