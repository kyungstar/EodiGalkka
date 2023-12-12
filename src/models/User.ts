import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,               // 문자열 타입
        required: [true, "User must type name"],   // 필수 속성, 빈 값이거나 없으면 에러
        unique: true               // 중복 방지, 동일한 이름의 사용자가 없도록 함
    },
    // 사용자 토큰
    token: {
        type: String               // 문자열 타입
    },
    // 온라인 상태 여부
    online: {
        type: Boolean,             // 불리언 타입
        default: false             // 기본값은 false, 사용자의 기본 온라인 상태는 오프라인
    }
})


const UserModel = mongoose.model("User", userSchema);

export default UserModel;