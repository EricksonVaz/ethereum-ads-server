const Campaings = artifacts.require("Campaings");

contract("Campaings",()=>{
    let campaings = null;
    before(async ()=>{
        campaings = await Campaings.deployed();
    });

    it("Should create new Campaing",async ()=>{
        await campaings.create("Camapanha 1",12,2,"descricao test",2);
        await campaings.create("Camapanha 2",12,2,"descricao test",2);
        await campaings.create("Camapanha 3",12,2,"descricao test",1);
        const campaing = await campaings.findById(1);
        let balance = await campaings.balance();
        console.log(balance.toString());
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
            await campaings.findById(4);
        } catch(e) {
            assert(e.message.includes("Campanha nao existe"));
            return;
        }
        assert(false);
    });

    it("Should NOT find Campaing by user and id",async ()=>{
        try {
            await campaings.findByUserAndId(4,1);
        } catch(e) {
            assert(e.message.includes("Campanha nao encontrada"));
            return;
        }
        assert(false);
    });

    it("Should list active Campaings",async ()=>{
        const campaingsList = await campaings.listAllCampainActiveByUser(2);
        const campaing = campaingsList[0];
        assert(campaing[0][0] == 1);
    });

    it("Should list all active Campaings",async ()=>{
        const campaingsList = await campaings.listAllCampainActive();
        const totalCampaing = campaingsList.length;
        assert(totalCampaing == 3);
    });

    it("Should list all active Campaings from diferent users",async ()=>{
        const campaingsList = await campaings.listAllCampainActiveFromDiferentUsers(1);
        const totalCampaing = campaingsList.length;
        assert(totalCampaing == 2);
    });

    it("Should watch Campaing 2x",async ()=>{
        await campaings.watchCampaign(1,1);
        await campaings.watchCampaign(1,1);
        const campaing = await campaings.findById(1);
        assert(campaing[5].toNumber() === 2);
    });

    it("Should NOT watch Campaing",async ()=>{
        try {
            await campaings.watchCampaign(1,2);
        } catch(e) {
            assert(e.message.includes("Nao pode assistir campanha"));
            return;
        }
        assert(false);
    });

    it("Should list 1 active Campaings from diferent users after watch",async ()=>{
        const campaingsList = await campaings.listAllCampainActiveFromDiferentUsers(1);
        const totalCampaing = campaingsList.length;
        assert(totalCampaing == 1);
    });

    it("Should list inactive Campaings",async ()=>{
        const campaingsList = await campaings.listAllCampainInactiveByUser(2);
        const campaing = campaingsList[0];
        assert(campaing[0][0] == 1);
    });

    it("Should update Campaing",async ()=>{
        await campaings.update(1,"Camapanha 122",12,2,"descricao test2",2);
        const campaing = await campaings.findById(1);
        assert(campaing[0].toNumber() === 1);
        assert(campaing[1] === "Camapanha 122");
        assert(campaing[2].toNumber() === 12);
        assert(campaing[3].toNumber() === 2);
        assert(campaing[4] === "descricao test2");
        assert(campaing[5].toNumber() === 2);
        assert(campaing[6].toNumber() === 2);
    });

    it("Should NOT update Campaing(wrong id)",async ()=>{
        try {
            await campaings.update(4,"Camapanha 1223",12,2,"descricao test23",2);
        } catch(e) {
            assert(e.message.includes("Nao pode atualizar a campanha"));
            return;
        }
        assert(false);
    });

    it("Should NOT update Campaing(wrong user)",async ()=>{
        try {
            await campaings.update(1,"Camapanha 1223",12,2,"descricao test23",3);
        } catch(e) {
            assert(e.message.includes("Nao pode atualizar a campanha"));
            return;
        }
        assert(false);
    });

    it("Should delete Campaing",async ()=>{
        try {
            await campaings.destroy(1,2);
            await campaings.findById(1);
        } catch(e) {
            assert(e.message.includes("Campanha nao existe"));
            return;
        }
        assert(false);
    });

    it("Should NOT delete Campaing (wrong id)",async ()=>{
        try {
            await campaings.destroy(5,2);
        } catch(e) {
            assert(e.message.includes("Nao pode deletar esta campanha"));
            return;
        }
        assert(false);
    });

    it("Should NOT delete Campaing (wrong user)",async ()=>{
        try {
            await campaings.destroy(2,1);
        } catch(e) {
            assert(e.message.includes("Nao pode deletar esta campanha"));
            return;
        }
        assert(false);
    });
});