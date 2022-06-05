// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16;

//contract for user login and signup using struct
contract Users {
    struct User {
        uint256 id;
        string email;
        string password;
    }
    User[] public users;
    uint256 public nextIdUser = 1;

    function signup(string memory _email, string memory _password) public {
        users.push(User(nextIdUser, _email, _password));
        nextIdUser++;
    }

    function login(string memory _email, string memory _password)
        public
        view
        returns (
            uint256,
            string memory,
            string memory
        )
    {
        for (uint256 i = 0; i < users.length; i++) {
            if (
                convert(users[i].email) == convert(_email) &&
                convert(users[i].password) == convert(_password)
            ) {
                return (users[i].id, users[i].email, users[i].password);
            }
        }
        revert("User ou password incorrecto");
    }

    function findById(uint256 _id)
        public
        view
        returns (
            uint256,
            string memory,
            string memory
        )
    {
        for (uint256 i = 0; i < users.length; i++) {
            if (users[i].id == _id) {
                return (users[i].id, users[i].email, users[i].password);
            }
        }
        revert("User nao existe");
    }

    function findByEmail(string memory _email)
        public
        view
        returns (
            uint256,
            string memory,
            string memory
        )
    {
        for (uint256 i = 0; i < users.length; i++) {
            if (convert(users[i].email) == convert(_email)) {
                return (users[i].id, users[i].email, users[i].password);
            }
        }
        revert("User nao existe");
    }

    function convert(string memory value) internal pure returns (bytes32) {
        return keccak256(abi.encode(value));
    }
}
