import { db } from '../utils//db/db';

const meme_ = await db.selectFrom('CasinoMember').select(['CasinoMember.userId','CasinoMember.name']).execute();
const roles_ = await db.selectFrom('CasinoRoles').select(['CasinoRoles.RoleName']).orderBy('CasinoRoles.Priority').execute();
let sttr = ''
console.log('---')
meme_.sort(() => Math.random()-0.5) // 섞음

const role_addt = new Map();
let counter = 0;
console.log('---')
for(let rl of roles_){
	const rname = rl["RoleName"];
	const res_member = meme_[counter];
	console.log(res_member)
	if(res_member) sttr += `${rname} : ${res_member.name}\n`
	if(counter > meme_.length) break;
	counter++;
}
console.log('---')
console.log(sttr)
