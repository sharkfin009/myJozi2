SELECT ANDROIDID, TIMESTMP, ACTIVITYNAME, LONGITUDE, LATITUDE FROM ACTIVITYLOCATION 
   WHERE STR_TO_DATE(TIMESTMP , '%d\/%m\/%Y %H:%i') BETWEEN STR_TO_DATE('2016-09-09' , '%Y%m%d') AND STR_TO_DATE('2016-10-15' , '%Y%m%d') AND ANDROIDID IN (a09727247b591873) 