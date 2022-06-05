// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16;

//contract for user login and signup using struct
contract Campaings {
    struct Campaing {
        uint256 id;
        string name;
        uint256 tvm;
        uint256 goalview;
        string description;
        uint256 totalview;
        uint256 user;
    }
    Campaing[] public campaings;
    uint256 public nextId = 1;

    function create(
        string memory _name,
        uint256 _tvm,
        uint256 _goalview,
        string memory _description,
        uint256 _user
    ) public {
        campaings.push(
            Campaing(nextIdUser, _name, _tvm, _goalview, _description, 0, _user)
        );
        nextId++;
    }

    function findById(uint256 _id)
        public
        view
        returns (
            uint256,
            string memory,
            uint256,
            uint256,
            string memory,
            uint256,
            uint256
        )
    {
        for (uint256 i = 0; i < campaings.length; i++) {
            if (campaings[i].id == _id) {
                return (
                    campaings[i].id,
                    campaings[i].name,
                    campaings[i].tvm,
                    campaings[i].goalview,
                    campaings[i].description,
                    campaings[i].totalview,
                    campaings[i].user
                );
            }
        }
        revert("Campanha nao existe");
    }

    function findByUserAndId(uint256 _id, uint256 _userId)
        public
        view
        returns (
            uint256,
            string memory,
            uint256,
            uint256,
            string memory,
            uint256,
            uint256
        )
    {
        for (uint256 i = 0; i < campaings.length; i++) {
            if (campaings[i].id == _id && campaings[i].user == _userId) {
                return (
                    campaings[i].id,
                    campaings[i].name,
                    campaings[i].tvm,
                    campaings[i].goalview,
                    campaings[i].description,
                    campaings[i].totalview,
                    campaings[i].user
                );
            }
        }
        revert("Campanha nao encontrada");
    }

    function listAllCampainActiveByUser(uint256 idUser)
        public
        view
        returns (Campaing[] memory)
    {
        Campaing[] activeCampaings;
        for (uint256 i = 0; i < campaings.length; i++) {
            if (
                campaings[i].user == idUser &&
                campaings[i].totalview < campaings[i].goalview
            ) {
                activeCampaings.push(campaings[i]);
            }
        }

        return activeCampaings;
    }

    function listAllCampainInactiveByUser(uint256 idUser)
        public
        view
        returns (Campaing[] memory)
    {
        Campaing[] inactiveCampaings;
        for (uint256 i = 0; i < campaings.length; i++) {
            if (
                campaings[i].user == idUser &&
                campaings[i].totalview >= campaings[i].goalview
            ) {
                inactiveCampaings.push(campaings[i]);
            }
        }

        return inactiveCampaings;
    }

    function watchCampaign(uint256 _id, uint256 _idUser) public {
        uint256 currentTotalView = getTotalView(_id);

        for (uint256 i = 0; i < campaings.length; i++) {
            if (campaings[i].id == _id && campaings[i].user != _idUser) {
                campaings[i].totalview = ++currentTotalView;
            }
        }
    }

    function update(
        uint256 _id,
        string memory _name,
        uint256 _tvm,
        uint256 _goalview,
        string memory _description,
        uint256 _user
    ) public {
        for (uint256 i = 0; i < campaings.length; i++) {
            if (campaings[i].id == _id && campaings[i].user == _user) {
                campaings[i].name = _name;
                campaings[i].tvm = _tvm;
                campaings[i].goalview = _goalview;
                campaings[i].description = _description;
            }
        }
    }

    function destroy(uint256 _id, uint256 _user) public {
        for (uint256 i = 0; i < campaings.length; i++) {
            if (campaings[i].id == _id && campaings[i].user == _user) {
                delete campaings[i];
            }
        }
    }

    function getTotalView(uint256 _id) internal pure returns (uint256) {
        for (uint256 i = 0; i < campaings.length; i++) {
            if (campaings[i].id == _id) {
                return campaings[i].totalview;
            }
        }
        revert("Campanha nao existe");
    }

    function convert(string memory value) internal pure returns (bytes32) {
        return keccak256(abi.encode(value));
    }
}
