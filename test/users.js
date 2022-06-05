const passwordHash = require('password-hash');

const Users = artifacts.require("Users");

contract('Users',()=>{
    let users = null;
    let passwordHashed = null;
    let password = "123456"
    before(async ()=>{
        users = await Users.deployed();
        passwordHashed = passwordHash.generate(password);
    });

    it('Should register a new user', async () => {
        await users.signup('ericksoncv1@outlook.com',passwordHashed);
        const user = await users.findById(1);
        assert(user[0].toNumber() === 1);
        assert(user[1] === 'ericksoncv1@outlook.com');
        assert(user[2] === passwordHashed);
    });

    it('Should login user', async () => {
        const user = await users.findByEmail('ericksoncv1@outlook.com');
        assert(user[0].toNumber() === 1);
        assert(user[1] === 'ericksoncv1@outlook.com');
        assert(passwordHash.verify(password,user[2]))
    });

    it('Should NOT find user by id', async () => {
        try {
            await users.findById(2);
        } catch(e) {
            assert(e.message.includes("User nao existe"));
            return;
        }
        assert(false);
    });

    it('Should NOT find user by email', async () => {
        try {
            await users.findById(2);
        } catch(e) {
            assert(e.message.includes("User nao existe"));
            return;
        }
        assert(false);
    });
})