const Campaings = artifacts.require("Campaings");

contract("Campaings",()=>{
    let campaings = null;
    before(async ()=>{
        campaings = await Campaings.deployed();
    });

    it("Should create new Campaing",async ()=>{
        await campaings.create("Camapanha 1",12,2,"descricao test",2);
        const campaing = await campaings.findById(1);
        assert(campaing[0].toNumber() === 1);
        assert(campaing[1] === "Camapanha 1");
        assert(campaing[2].toNumber() === 12);
        assert(campaing[3].toNumber() === 2);
        assert(campaing[4] === "descricao test");
        assert(campaing[5].toNumber() === 0);
        assert(campaing[6].toNumber() === 2);
    });

    it("Should find Campaing by user and id",async ()=>{
        const campaing = await campaings.findByUserAndId(1,2);
        assert(campaing[0].toNumber() === 1);
        assert(campaing[1] === "Camapanha 1");
        assert(campaing[2].toNumber() === 12);
        assert(campaing[3].toNumber() === 2);
        assert(campaing[4] === "descricao test");
        assert(campaing[5].toNumber() === 0);
        assert(campaing[6].toNumber() === 2);
    });

    it("Should NOT find Campaing by id",async ()=>{
        try {
            await campaings.findById(2);
        } catch(e) {
            assert(e.message.includes("Campanha nao existe"));
            return;
        }
        assert(false);
    });

    it("Should NOT find Campaing by user and id",async ()=>{
        try {
            await campaings.findByUserAndId(2,1);
        } catch(e) {
            assert(e.message.includes("Campanha nao encontrada"));
            return;
        }
        assert(false);
    });

    it("Should list active Campaings",async ()=>{
        const campaingsList = await campaings.listAllCampainActiveByUser(2);
        const campaing = campaingsList[0];
        assert(campaing["id"].toNumber() === 1);
        // assert(campaing[1] === "Camapanha 1");
        // assert(campaing[2].toNumber() === 12);
        // assert(campaing[3].toNumber() === 2);
        // assert(campaing[4] === "descricao test");
        // assert(campaing[5].toNumber() === 0);
        // assert(campaing[6].toNumber() === 2);
    });

    it("Should watch Campaing 2x",async ()=>{
        await campaings.watchCampaign(1,1);
        await campaings.watchCampaign(1,1);
        const campaing = await campaings.findById(1);
        assert(campaing[5].toNumber() === 2);
    });

    it("Should list inactive Campaings",async ()=>{
        const campaingsList = await campaings.listAllCampainInactiveByUser(2);
        const campaing = campaingsList[0];
        assert(campaing[0].toNumber() === 1);
        assert(campaing[1] === "Camapanha 1");
        assert(campaing[2].toNumber() === 12);
        assert(campaing[3].toNumber() === 2);
        assert(campaing[4] === "descricao test");
        assert(campaing[5].toNumber() === 2);
        assert(campaing[6].toNumber() === 2);
    });
});