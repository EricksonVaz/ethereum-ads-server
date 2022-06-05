import Web3 from "web3";

export default class Web3Obj{
    private readonly ganacheServer = "http://127.0.0.1:9545/";
    static web3?:Web3;
    static accounts:string[] = [];

    initWeb3():Promise<Web3>{
        return new Promise((resolve, reject) => {
            //@ts-expect-error
            let {ethereum=undefined,web3=undefined} = window;

            if(ethereum) {
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
                return resolve(
                    new Web3(web3.currentProvider)
                );
            }
            resolve(new Web3('http://localhost:9545'));
        });
    }

    async initContract(smartContractJSON:any){
        const deploymentKey = Object.keys(smartContractJSON.networks)[0];
        let contarctAddress = smartContractJSON
        .networks[deploymentKey]
        .address;
        console.log("contract address",contarctAddress);
        
        Web3Obj.accounts = await Web3Obj.web3!.eth.getAccounts()
        return new Web3Obj.web3!.eth.Contract(
            smartContractJSON.abi, 
            contarctAddress
        );
    }
}