export default class ManageStorage{
    static saveValue(key:string,value:string,storageType="local"){
        if(storageType==="local") localStorage.setItem(key,value);
        else sessionStorage.setItem(key,value);
    }

    static getValueSaved(key:string,storageType="local"):string{
        if(storageType==="local") return localStorage.getItem(key) || "";
        else return sessionStorage.getItem(key) || "";
    }

    static removeValue(key:string,storageType="local"){
        if(storageType==="local") localStorage.removeItem(key);
        else sessionStorage.removeItem(key);
    }
}