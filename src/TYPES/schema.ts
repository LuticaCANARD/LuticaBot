import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type AdminRoleId = {
    GuildId: string;
    RoleId: string;
};
export type CasinoChat = {
    guildId: string;
    chatId: string;
};
export type CasinoEvent = {
    time: Timestamp;
    userId: string;
};
export type CasinoInternHistory = {
    userId: string;
    RoleName: string;
};
export type CasinoMember = {
    GuildId: string;
    name: string;
    userId: string;
    intern: boolean;
    exeJoin: boolean | null;
};
export type CasinoRoles = {
    GuildId: string;
    Priority: Generated<number>;
    RoleName: string;
};
export type DateWeek = {
    DateId: number;
    STCS_DT: Timestamp;
    DAY_DV_CD_NM: string;
    BIZ_DD_STG_CD_NM: string;
};
export type DiscordServer = {
    GuildId: string;
};
export type InternRoleId = {
    GuildId: string;
    RoleId: string;
};
export type RailStnStat = {
    DateId: number;
    EXTR_STN_CD: number;
    HR_UNIT_HR_DV_CD: number;
    ABRD_PRNB: number;
    GOFF_PRNB: number;
};
export type ServerPref = {
    prefKey: string;
    value: string;
};
export type StnName = {
    HR_UNIT_HR_DV_CD: number;
    STN_NM: string;
};
export type User = {
    id: Generated<number>;
    email: string;
    name: string;
};
export type VoteExecutor = {
    ServerId: number;
    UserId: number;
};
export type DB = {
    AdminRoleId: AdminRoleId;
    CasinoChat: CasinoChat;
    CasinoEvent: CasinoEvent;
    CasinoInternHistory: CasinoInternHistory;
    CasinoMember: CasinoMember;
    CasinoRoles: CasinoRoles;
    DateWeek: DateWeek;
    DiscordServer: DiscordServer;
    InternRoleId: InternRoleId;
    RailStnStat: RailStnStat;
    ServerPref: ServerPref;
    StnName: StnName;
    User: User;
    VoteExecutor: VoteExecutor;
};
