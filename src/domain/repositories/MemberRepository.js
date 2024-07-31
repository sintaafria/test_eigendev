const MemberModel = require('../models/MemberModel')

class MemberRepository {
    async findByCode(member_code) {
        const member = await MemberModel.findOne({code: member_code});
        return member
    }
    async findAll() {
        const member = await MemberModel.find().select();
        return member
    }
    async saveBatch(members){
        const new_members = await MemberModel.insertMany(members)
        return new_members
    }
    async updateMember(member_id, new_data){
        const updated_member = await MemberModel.findByIdAndUpdate(member_id, new_data)
        return updated_member
    }
}

module.exports = new MemberRepository;
