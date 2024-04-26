import redis from 'redis';
import type { RedisClientType } from '@redis/client';
export class RedisController
{
    private conn : RedisClientType;
    constructor(url:string)
    {
        this.conn = redis.createClient({
            url,
            pingInterval:500
        });
    };
    async setVal(key:string,val:number|string,option?:redis.SetOptions)
    {
        if(this.conn.isReady === false) await this.conn.connect();
        await this.conn.set(key,val,option);
    };
    async delKey(key:string)
    {
        if(this.conn.isReady === false) await this.conn.connect();
        await this.conn.del(key);
    }
    
}