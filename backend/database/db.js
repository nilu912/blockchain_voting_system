const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const usersSchema = new Schema({
    user_id: {type: Number, unique: true, required: true},
    username: {type: String, required: true},
    wallet_address: {type: String, unique: true, required: true},
    created_at: {type: Date, default: Date.now},
    // has_voted: {type: Boolean, default: false}
})
const electionsSchema = new Schema({
    elec_id: {type: Number, unique:true, required: true},
    elec_title: {type: String, required: true},
    elec_discription: {type: String},
    elec_start_date: {type: Date, default: Date.now, required: true},
    elec_end_date: {type: Date, required: true},
    is_private: {type: Boolean, default: false},
    is_active: {type: Boolean, default: false},
    elec_created_at: {type: Date, default: Date.now}
})
const candidatesSchema = new Schema({
    cand_id: {type: Number, unique: true, required: true},
    user_id: {type: Number, ref: 'users'},
    elec_id: {type: Number, ref: 'elections'},
    party_name: {type: String, required: true},
    vote_count: {type: Number, default: 0},
})
const votesSchema = new Schema({
    vote_id: {type: Number, unique: true, required: true},
    user_id: {type: Number, ref: 'users', required: true},
    elec_id: {type: Number, ref: 'elections', required: true},
    cand_id: {type: Number, ref: 'candidates', required: true},
    transaction_hash: { type: String, required: true },
    vote_date: {type: Date, default: Date.now}
})
const privateVotingSchema = new Schema({
    private_vid: {type: Number, unique: true, required: true},
    user_id: {type: Number, ref: 'users', required: true},
    // cand_id: {type: Number, ref: 'candidates', required: true},
    elec_id: {type: Number, required: true, ref: 'elections'}
})
const nonceSchema = new Schema({
    wallet_address: {type: String, unique: true, required: true},
    nonce: {type: Number, required: true}
})
const votesRequestsSchema = new Schema({
    req_id: {type: Number, unique: true, required: true},
    user_id: {type: Number, ref: 'users', required: true},
    username: {type: String, required: true},
    elec_id: {type: Number, ref: 'elections', required: true},
    timestamp: {type: Date, default: Date.now},
    wallet_address: {type: String, required: true},
    status: {
        type: String,
        enum: ['pending', 'accepted', 'denied'],
        default: 'pending',
        required: true
    }
})


const usersModel = mongoose.model('users', usersSchema)
const electionsModel = mongoose.model('elections', electionsSchema)
const candidatesModel = mongoose.model('candidates', candidatesSchema)
const votesModel = mongoose.model('votes', votesSchema)
const privateVotingModel = mongoose.model('privateVoting', privateVotingSchema)
const nonceModel = mongoose.model('nonce', nonceSchema)
const votesRequestsModel = mongoose.model('voterReq', votesRequestsSchema)

module.exports = {
    usersModel,
    electionsModel,
    candidatesModel,
    votesModel,
    privateVotingModel,
    nonceModel,
    votesRequestsModel
}