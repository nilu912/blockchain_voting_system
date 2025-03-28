const mongoose = require('mongoose')

const Schema = mongoose.schema;
const ObjectId = mongoose.ObjectId;

const usersSchema = new Schema({
    user_id: {type: Number, unique: true, require: true},
    username: {type: String, require: true},
    wallet_address: {type: String, unique: true, require: true},
    created_at: {type: Date, default: Date.now}
})
const electionsSchema = new Schema({
    elec_id: {type: Number, unique:true, require: true},
    elec_title: {type: String, require: true},
    elec_start_date: {type: Date, default: Date.now, require: true},
    elec_end_date: {type: Date, require: true},
    is_private: {type: Boolean, default: false},
    is_active: {type: Boolean, default: false},
    elec_created_at: {type: Date, default: Date.now}
})
const candidatesSchema = new Schema({
    cand_id: {type: Number, unique: true, require: true},
    user_id: {type: Number, ref: 'user'},
    elec_id: {type: Number, ref: 'election'},
    party_name: {type: String, require: true},
    vote_count: {type: Number, default: 0},
})
const votesSchema = new Schema({
    vote_id: {type: Number, unique: true, require: true},
    user_id: {type: Number, ref: 'user', require: true},
    elec_id: {type: Number, ref: 'election', require: true},
    cand_id: {type: Number, ref: 'candidate', require: true},
    vote_date: {type: Date, default: Date.now}
})
const privateVotingSchema = new Schema({
    private_vid: {type: Number, unique: true, require: true},
    user_id: {type: Number, ref: 'user', require: true},
    cand_id: {type: Number, ref: 'candidate', require: true}
})
const nonceSchema = new Schema({
    wallet_address: {type: String, unique: true, require: true},
    nonce: {type: Number, require: true}
})

const usersModel = mongoose.model('user', usersSchema)
const electionsModel = mongoose.model('election', electionsSchema)
const candidatesModel = mongoose.model('candidate', candidatesSchema)
const votesModel = mongoose.model('vote', votesSchema)
const privateVotingModel = mongoose.model('privateVoting', privateVotingSchema)
const nonceModel = mongoose.model('nonce', nonceSchema)

module.exports = {
    usersModel,
    electionsModel,
    candidatesModel,
    votesModel,
    privateVotingModel,
    nonceModel
}