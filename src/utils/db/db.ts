import { Kysely } from 'kysely'
import { XataDialect } from '@xata.io/kysely';
import type { DB } from '../../TYPES/schema';
import { getXataClient } from '../xata/xata'; // Generated client
const xata = getXataClient();

export const db:Kysely<DB> = new Kysely<DB>({
	dialect : new XataDialect({xata})
})
