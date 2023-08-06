using { guy.poolcheck as my } from '../db/schema';

service PoolCheckService {

  // Sync API
  entity OrpValues as projection on my.Orp   ;
entity OrpLive as projection on my.OrpLive   ;
entity RunValues as projection on my.RunValues   ;
 entity ChlorinePump as projection on my.ChlorinePump   ;
  // Async API
  event OrpValue : {
    value  : Decimal;
  }
 

} 