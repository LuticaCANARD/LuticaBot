import { keycapCode } from "../../../utils/constant";
export const getRoleDisplayString = async(roles:{
    Priority: number;
    RoleName: string;
}[]) =>{
    const display = roles.filter(r=>!r.RoleName.endsWith('2'));
    let str = '```';
    for(let i = 0; i < display.length; i++){
        // 1
        str += `${keycapCode[i%10]} : ${display[i].RoleName}\n`;
    }
    str += '```';
    return {str,len:display.length};
}
