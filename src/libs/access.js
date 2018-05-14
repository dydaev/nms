
export const accessConsts = {
    ALL: 0,
    USER: 1,
    MANAGER: 2,
    ADMIN: 7,
}

const User = {
    token: true,
    name: '',
    privilege: 0,
    checkToken: () => User.token,
    checkPrivilege: arrPrivilege => (User.checkToken() && arrPrivilege.includes(User.privilege)),
    isAdmin: () => User.checkPrivilege([accessConsts.ADMIN]),
}

export default User;