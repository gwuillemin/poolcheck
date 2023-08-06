namespace guy.poolcheck;

entity Orp {
   key date     : DateTime;
  orp      : Decimal;
  
  
}

entity OrpLive {
   key date     : DateTime;
  orp      : Decimal;
  
  
}
 
 entity RunValues {
   key date     : Date;
  onoff      : Integer;
  orp      : Decimal;
  
  
}
 entity ChlorinePump {
   key date     : DateTime;
  onoff      : String;
  
  
}

// Auto-fill Orp dates
annotate Orp with {
  date     @cds.on.insert:$now;
}
annotate OrpLive with {
  date     @cds.on.insert:$now;
}
annotate RunValues with {
  date     @cds.on.insert:$now;
}
annotate ChlorinePump with {
  date     @cds.on.insert:$now;
}
