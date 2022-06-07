import swal from "sweetalert";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";

export default class Web3Obj{
    private readonly ganacheServer = "http://127.0.0.1:9545/";
    static web3?:Web3;
    static accounts:string[] = [];

    initWeb3():Promise<Web3>{
        return new Promise((resolve, reject) => {
            //@ts-expect-error
            let {ethereum=undefined,web3=undefined} = window;

            if(ethereum) {
                console.log("ethereun")
                //const web3 = new Web3(ethereum);
                ethereum.enable()
                .then(() => {
                    resolve(
                        new Web3(ethereum)
                    );
                })
                .catch((e:Error) => {
                    reject(e);
                });
                return;
            }
            if(web3) {
                console.log("old")
                return resolve(
                    new Web3(web3.currentProvider)
                );
            }
            console.log("ganache")
            resolve(new Web3('http://localhost:9545'));
        });
    }

    async initContract(smartContractJSON:any){
        const deploymentKey = Object.keys(smartContractJSON.networks)[0];
        let contarctAddress = smartContractJSON
        .networks[deploymentKey]
        .address;
        console.log("contract address",contarctAddress);
        
        Web3Obj.accounts = await Web3Obj.web3!.eth.getAccounts();
        console.log("contract chain id",Web3Obj.web3?.eth.getChainId());
        return new Web3Obj.web3!.eth.Contract(
            smartContractJSON.abi, 
            contarctAddress
        );
    }

    static async contract(contractJSON:any):Promise<Contract|unknown>{
        try{
            let web3Obj = new Web3Obj();
            if(!Web3Obj.web3){
                let web3 = await web3Obj.initWeb3()
                Web3Obj.web3 = web3;
            }
            return await web3Obj.initContract(contractJSON);
        }catch(e){
            swal({
                title:"Ooops!!!",
                text:"Erro ao conectar na blockchain",
                icon:"error"
            });
            return e
        }
    }
}