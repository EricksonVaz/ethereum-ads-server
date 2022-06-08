// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16;
pragma experimental ABIEncoderV2;

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

    //uint256 public balance = address(this).balance;

    function balance() public view returns (uint256) {
        return address(this).balance;
    }

    //test done
    function create(
        string memory _name,
        uint256 _tvm,
        uint256 _goalview,
        string memory _description,
        uint256 _user
    ) public {
        campaings.push(
            Campaing(nextId, _name, _tvm, _goalview, _description, 0, _user)
        );
        nextId++;
    }

    //test done
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

    function findValidCampaing(uint256 _id, uint256 _userId)
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
            if (
                (campaings[i].id == _id && campaings[i].user != _userId) &&
                campaings[i].totalview < campaings[i].goalview
            ) {
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

    //test done
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

    //test done
    function listAllCampainActiveByUser(uint256 idUser)
        public
        view
        returns (Campaing[] memory)
    {
        Campaing[] memory activeCampaings = new Campaing[](
            totalActiveCampaingByUser(idUser)
        );
        uint256 n = 0;
        for (uint256 i = 0; i < campaings.length; i++) {
            if (
                campaings[i].user == idUser &&
                campaings[i].totalview < campaings[i].goalview
            ) {
                activeCampaings[n] = campaings[i];
                n++;
            }
        }

        return activeCampaings;
    }

    function listAllCampainActive() public view returns (Campaing[] memory) {
        Campaing[] memory activeCampaings = new Campaing[](
            totalActiveCampaing()
        );
        uint256 n = 0;
        for (uint256 i = 0; i < campaings.length; i++) {
            if (campaings[i].totalview < campaings[i].goalview) {
                activeCampaings[n] = campaings[i];
                n++;
            }
        }

        return activeCampaings;
    }

    function listAllCampainActiveFromDiferentUsers(uint256 idUser)
        public
        view
        returns (Campaing[] memory)
    {
        Campaing[] memory activeCampaings = new Campaing[](
            totalActiveCampaingFromDiferentUsers(idUser)
        );
        uint256 n = 0;
        for (uint256 i = 0; i < campaings.length; i++) {
            if (
                campaings[i].user != idUser &&
                campaings[i].totalview < campaings[i].goalview
            ) {
                activeCampaings[n] = campaings[i];
                n++;
            }
        }

        return activeCampaings;
    }

    //test done
    function listAllCampainInactiveByUser(uint256 idUser)
        public
        view
        returns (Campaing[] memory)
    {
        Campaing[] memory inactiveCampaings = new Campaing[](
            totalInactiveCampaingByUser(idUser)
        );
        uint256 n = 0;
        for (uint256 i = 0; i < campaings.length; i++) {
            if (
                campaings[i].user == idUser &&
                campaings[i].totalview >= campaings[i].goalview
            ) {
                inactiveCampaings[n] = campaings[i];
            }
        }

        return inactiveCampaings;
    }

    //test done
    function watchCampaign(uint256 _id, uint256 _idUser) public {
        uint256 currentTotalView = getTotalView(_id);

        for (uint256 i = 0; i < campaings.length; i++) {
            if (campaings[i].id == _id && campaings[i].user != _idUser) {
                campaings[i].totalview = ++currentTotalView;
                return;
            }
        }

        revert("Nao pode assistir campanha");
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
                return;
            }
        }
        revert("Nao pode atualizar a campanha");
    }

    function destroy(uint256 _id, uint256 _user) public {
        for (uint256 i = 0; i < campaings.length; i++) {
            if (campaings[i].id == _id && campaings[i].user == _user) {
                delete campaings[i];
                return;
            }
        }
        revert("Nao pode deletar esta campanha");
    }

    function getTotalView(uint256 _id) internal view returns (uint256) {
        for (uint256 i = 0; i < campaings.length; i++) {
            if (campaings[i].id == _id) {
                return campaings[i].totalview;
            }
        }
        revert("Campanha nao existe");
    }

    function totalActiveCampaingByUser(uint256 idUser)
        internal
        view
        returns (uint256)
    {
        uint256 n = 0;
        for (uint256 i = 0; i < campaings.length; i++) {
            if (
                campaings[i].user == idUser &&
                campaings[i].totalview < campaings[i].goalview
            ) {
                n++;
            }
        }
        return n;
    }

    function totalActiveCampaing() internal view returns (uint256) {
        uint256 n = 0;
        for (uint256 i = 0; i < campaings.length; i++) {
            if (campaings[i].totalview < campaings[i].goalview) {
                n++;
            }
        }
        return n;
    }

    function totalActiveCampaingFromDiferentUsers(uint256 idUser)
        internal
        view
        returns (uint256)
    {
        uint256 n = 0;
        for (uint256 i = 0; i < campaings.length; i++) {
            if (
                campaings[i].user != idUser &&
                campaings[i].totalview < campaings[i].goalview
            ) {
                n++;
            }
        }
        return n;
    }

    function totalInactiveCampaingByUser(uint256 idUser)
        internal
        view
        returns (uint256)
    {
        uint256 n = 0;
        for (uint256 i = 0; i < campaings.length; i++) {
            if (
                campaings[i].user == idUser &&
                campaings[i].totalview >= campaings[i].goalview
            ) {
                n++;
            }
        }
        return n;
    }

    function payWatch(address payable _seller) internal {
        _seller.transfer(1 ether);
    }

    function convert(string memory value) internal pure returns (bytes32) {
        return keccak256(abi.encode(value));
    }
}
