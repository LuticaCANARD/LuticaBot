```mermaid
erDiagram

  "CasinoChat" {
    String guildId "🗝️"
    String chatId 
    }
  

  "CasinoEvent" {
    DateTime time "🗝️"
    String userId "🗝️"
    }
  

  "CasinoInternHistory" {
    String userId "🗝️"
    String RoleName "🗝️"
    }
  

  "CasinoMember" {
    String GuildId "🗝️"
    String name 
    String userId "🗝️"
    Boolean intern 
    Boolean exeJoin "❓"
    }
  

  "CasinoRoles" {
    String GuildId "🗝️"
    Int Priority "🗝️"
    String RoleName 
    }
  

  "DateWeek" {
    Int DateId "🗝️"
    DateTime STCS_DT 
    String DAY_DV_CD_NM 
    String BIZ_DD_STG_CD_NM 
    }
  

  "DiscordServer" {
    String GuildId "🗝️"
    }
  

  "RailStnStat" {
    Int DateId "🗝️"
    Int EXTR_STN_CD "🗝️"
    Int HR_UNIT_HR_DV_CD "🗝️"
    Int ABRD_PRNB 
    Int GOFF_PRNB 
    }
  

  "ServerPref" {
    String prefKey "🗝️"
    String value 
    }
  

  "StnName" {
    Int HR_UNIT_HR_DV_CD "🗝️"
    String STN_NM 
    }
  

  "User" {
    Int id "🗝️"
    String email 
    String name 
    }
  

  "VoteExecutor" {
    Int ServerId "🗝️"
    Int UserId "🗝️"
    }
  

  "AdminRoleId" {
    String GuildId "🗝️"
    String RoleId "🗝️"
    }
  

  "InternRoleId" {
    String GuildId "🗝️"
    String RoleId "🗝️"
    }
  
```
