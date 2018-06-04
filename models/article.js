let mongoose = require('mongoose');

let articleSchema = mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    author:{
        type: String,
        required:true
    },
    body:{
        type: String,
        required:true
    },
});
module.exports = mongoose.model('Article', articleSchema);
// let Article = module.exports;