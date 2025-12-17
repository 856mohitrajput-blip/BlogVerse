import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    blogId: {
        type: String,
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        default: '',
    },
    comment: {
        type: String,
        required: true,
    },
    approved: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

commentSchema.index({ blogId: 1, createdAt: -1 });

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export default Comment;

