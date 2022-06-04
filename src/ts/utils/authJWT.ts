import jwt, { JwtPayload } from "jsonwebtoken";

export default class AuthJWT{
    private sessionPrivateKey:string;
    static authJWT:AuthJWT;

    constructor(){
        this.sessionPrivateKey = Math.random().toString(16);
        AuthJWT.authJWT = this;
    }

    generateToken(objJson:object){
        return jwt.sign(objJson, this.sessionPrivateKey);
    }

    decodeToken(token:string):string|JwtPayload{
        try{
            return jwt.verify(token,this.sessionPrivateKey);
        }catch(e){
            console.log("JWT error",e);
            return "";
        }
    }
}