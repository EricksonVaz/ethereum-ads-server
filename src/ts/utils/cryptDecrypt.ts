import Cryptr from "cryptr";

export default class CryptDecrypt{
    static readonly SECRET_KEY = "4b8ee3021ad413ddb";
    private static cryptr:Cryptr = new Cryptr(CryptDecrypt.SECRET_KEY);
   
    static encryptedString(value:string):string{
        return CryptDecrypt.cryptr.encrypt(value);
    }

    static decryptedString(encryptedString:string):string{
        return CryptDecrypt.cryptr.decrypt(encryptedString);
    }
}