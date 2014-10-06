/*!
 * uk-numberplates
 * https://github.com/CapitalReg/uk-numberplate-validation
 *
 * Copyright 2014 Aaron Kenney
 * Released under the GNU GENERAL PUBLIC LICENSE
 */
 
// Analyse a string, returning correctly formatted version of reg and other details...
var validate = function(input,callback) {

	input = input.trim().toUpperCase();
	input = input.replace(" ","");
	input = input.replace("\r","");
	input = input.replace("\n","");
	
	var reg = input.replace(/[\W\s]+/g,"");
		
	var irishi = false;
	var irishz = false;
	var qflag = false;
	
	var data = {};
	var err = false;						// ERROR CODE : 
											// false = OK 				
											// 1 = UNKNOWN FORMAT			
											// 2 = INVALID CHARS 			
											// 3 = ASTERISK IN REG			
											// 4 = Q IN REG (NOT PREFIX)		
											// 5 = I BUT NOT IRISH                 
											// 6 = Z BUT NOT IRISH OR MILL          
											// 7 = MILLENNIUM Z IN FIRST 2 CHAR     
											// 8 = INVALID NUMBER (LEADING ZERO)
											
	data['plate']=input;					// CORRECTLY SPACED PLATE 
	data['plate_format']=null;     			// PLATE FORMAT CODE 
	data['irish']=false;        			// IRISH FLAG, false=NO true=YES 

	data['prefix']=null;        			// PREFIX (YEAR ID)    	 	
	data['suffix']=null;        			// SUFFIX (INDEX)   	
	data['number']=null;      				// NUMBER 	   	
		
	data['year_of_issue']=null;				// ESTIMATED YEAR OF ISSUE
	data['year_of_issue_expiry']=null;		// WHAT YEAR DID THE FOLLOWING SEQUENCE SUPERCEED THIS?
	data['month_of_issue']=null;			// ESTIMATED MONTH OF ISSUE
	data['month_of_issue_expiry']=null;		// WHAT MONTH DID THE FOLLOWING SEQUENCE SUPERCEED THIS?
		
	//------------------------------------------------------------------------------------------------
	
	if(input!=reg) {
	
		err=2;
		if(input.indexOf("*")!==-1)
		{ 	err=3;   	}
	
	} 	
	
	//------------------------------------------------------------------------------------------------

	if(!err) {
	
		var format = new Array();
		
		format['P1'] = '[A-Z]{1}[0-9]{1}[A-Z]{3}';	// A1 ABC
		format['P2'] = '[A-Z]{1}[0-9]{2}[A-Z]{3}';	// A12 ABC
		format['P3'] = '[A-Z]{1}[0-9]{3}[A-Z]{3}';	// A123 ABC
		
		format['S1'] = '[A-Z]{3}[0-9]{1}[A-Z]{1}';	// ABC 1A
		format['S2'] = '[A-Z]{3}[0-9]{2}[A-Z]{1}';	// ABC 12A
		format['S3'] = '[A-Z]{3}[0-9]{3}[A-Z]{1}';	// ABC 123A
		
		format['MILLENNIUM'] = '[A-Z]{2}[0-9]{2}[A-Z]{3}';	// AB12 ABC
	
		format['1CT4D'] = '[A-Z]{1}[0-9]{4}';	// A 1234
		format['1CT3D'] = '[A-Z]{1}[0-9]{3}';	// A 123
		format['1CT2D'] = '[A-Z]{1}[0-9]{2}';	// A 12
		format['1CT1D'] = '[A-Z]{1}[0-9]{1}';	// A 1
		
		format['2CT4D'] = '[A-Z]{2}[0-9]{4}';	// AA 1234
		format['2CT3D'] = '[A-Z]{2}[0-9]{3}';	// AA 123
		format['2CT2D'] = '[A-Z]{2}[0-9]{2}';	// AA 12
		format['2CT1D'] = '[A-Z]{2}[0-9]{1}';	// AA 1
		
		format['3CT4D'] = '[A-Z]{3}[0-9]{4}';	// AAA 1234 - IRISH MAINLY
		format['3CT3D'] = '[A-Z]{3}[0-9]{3}';	// AAA 123
		format['3CT2D'] = '[A-Z]{3}[0-9]{2}';	// AAA 12
		format['3CT1D'] = '[A-Z]{3}[0-9]{1}';	// AAA 1
	
		format['4DT1C'] = '[0-9]{4}[A-Z]{1}';	// 1234 A
		format['3DT1C'] = '[0-9]{3}[A-Z]{1}';	// 123 A
		format['2DT1C'] = '[0-9]{2}[A-Z]{1}';	// 12 A
		format['1DT1C'] = '[0-9]{1}[A-Z]{1}';	// 1 A
		
		format['4DT2C'] = '[0-9]{4}[A-Z]{2}';	// 1234 AA
		format['3DT2C'] = '[0-9]{3}[A-Z]{2}';	// 123 AA
		format['2DT2C'] = '[0-9]{2}[A-Z]{2}';	// 12 AA
		format['1DT2C'] = '[0-9]{1}[A-Z]{2}';	// 1 AA
	
		format['4DT3C'] = '[0-9]{4}[A-Z]{3}';	// 1234 AAA
		format['3DT3C'] = '[0-9]{3}[A-Z]{3}';	// 123 AAA
		format['2DT3C'] = '[0-9]{2}[A-Z]{3}';	// 12 AAA
		format['1DT3C'] = '[0-9]{1}[A-Z]{3}';	// 1 AAA
		
		for(k in format) {
			var v = "^" + format[k] + "$";
			if(reg.match(String(v))) {
				data['plate_format'] = k;
				break;
			}		
		}
			
		if(data['plate_format']!=null) {
		
			if(reg.indexOf("I")!=-1)
			{       irishi=true;   	}
			if(reg.indexOf("Z")!=-1)
			{       irishz=true;   	}
			if(reg.indexOf("Q")!=-1)
			{       qflag=true;    	}
			
			reg_array = reg.split("");
	
			switch (data['plate_format'])
			{
				case "1CT4D":
				data['plate'] = reg_array[0] + " " + reg_array[1] + reg_array[2] + reg_array[3] + reg_array[4];
				data['prefix'] = null;
				data['suffix'] = reg_array[0];
				data['number'] = reg_array[1] + reg_array[2] + reg_array[3] + reg_array[4];
				break;
				case "1CT3D":
				data['plate'] = reg_array[0] + " " + reg_array[1] + reg_array[2] + reg_array[3];
				data['prefix'] = null;
				data['suffix'] = reg_array[0];
				data['number'] = reg_array[1] + reg_array[2] + reg_array[3];
				break;
				case "1CT2D":
				data['plate'] = reg_array[0] + " " + reg_array[1] + reg_array[2];
				data['prefix'] = null;
				data['suffix'] = reg_array[0];
				data['number'] = reg_array[1] + reg_array[2];
				break;
				case "1CT1D":
				data['plate'] = reg_array[0] + " " + reg_array[1];
				data['prefix'] = null;
				data['suffix'] = reg_array[0];
				data['number'] = reg_array[1];
				break;
				case "4DT1C":
				data['plate'] = reg_array[0] + reg_array[1] + reg_array[2] + reg_array[3] + " " + reg_array[4];
				data['prefix'] = null;
				data['suffix'] = reg_array[4];
				data['number'] = reg_array[0] + reg_array[1] + reg_array[2] + reg_array[3];
				break;
				case "3DT1C":
				data['plate'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3];
				data['prefix'] = null;
				data['suffix'] = reg_array[3];
				data['number'] = reg_array[0] + reg_array[1] + reg_array[2];
				break;
				case "2DT1C":
				data['plate'] = reg_array[0] + reg_array[1] + " " + reg_array[2];
				data['prefix'] = null;
				data['suffix'] = reg_array[2];
				data['number'] = reg_array[0] + reg_array[1];
				break;
				case "1DT1C":
				data['plate'] = reg_array[0] + " " + reg_array[1];
				data['prefix'] = null;
				data['suffix'] = reg_array[1];
				data['number'] = reg_array[0];
				break;
				case "2CT4D":
				data['plate'] = reg_array[0] + reg_array[1] + " " + reg_array[2] + reg_array[3] + reg_array[4] + reg_array[5];
				data['prefix'] = null;
				data['suffix'] = reg_array[0] + reg_array[1];
				data['number'] = reg_array[2] + reg_array[3] + reg_array[4] + reg_array[5];
				break;
				case "2CT3D":
				data['plate'] = reg_array[0] + reg_array[1] + " " + reg_array[2] + reg_array[3] + reg_array[4];
				data['prefix'] = null;
				data['suffix'] = reg_array[0] + reg_array[1];
				data['number'] = reg_array[2] + reg_array[3] + reg_array[4];
				break;
				case "2CT2D":
				data['plate'] = reg_array[0] + reg_array[1] + " " + reg_array[2] + reg_array[3];
				data['prefix'] = null;
				data['suffix'] = reg_array[0] + reg_array[1];
				data['number'] = reg_array[2] + reg_array[3];
				break;
				case "2CT1D":
				data['plate'] = reg_array[0] + reg_array[1] + " " + reg_array[2];
				data['prefix'] = null;
				data['suffix'] = reg_array[0] + reg_array[1];
				data['number'] = reg_array[2];
				break;
				case "4DT2C":
				data['plate'] = reg_array[0] + reg_array[1] + reg_array[2] + reg_array[3] + " " + reg_array[4] + reg_array[5];
				data['prefix'] = null;
				data['suffix'] = reg_array[4] + reg_array[5];
				data['number'] = reg_array[0] + reg_array[1] + reg_array[2] + reg_array[3];
				break;
				case "3DT2C":
				data['plate'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3] + reg_array[4];
				data['prefix'] = null;
				data['suffix'] = reg_array[3] + reg_array[4];
				data['number'] = reg_array[0] + reg_array[1] + reg_array[2];
				break;
				case "2DT2C":
				data['plate'] = reg_array[0] + reg_array[1] + " " + reg_array[2] + reg_array[3];
				data['prefix'] = null;
				data['suffix'] = reg_array[2] + reg_array[3];
				data['number'] = reg_array[0] + reg_array[1];
				break;
				case "1DT2C":
				data['plate'] = reg_array[0] + " " + reg_array[1] + reg_array[2];
				data['prefix'] = null;
				data['suffix'] = reg_array[1] + reg_array[2];
				data['number'] = reg_array[0];
				break;
				case "3CT4D":
				data['plate'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3] + reg_array[4] + reg_array[5] + reg_array[6];
				data['prefix'] = null;
				data['suffix'] = reg_array[0] + reg_array[1] + reg_array[2];
				data['number'] = reg_array[3] + reg_array[4] + reg_array[5] + reg_array[6];
				break;
				case "3CT3D":
				data['plate'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3] + reg_array[4] + reg_array[5];
				data['prefix'] = null;
				data['suffix'] = reg_array[0] + reg_array[1] + reg_array[2];
				data['number'] = reg_array[3] + reg_array[4] + reg_array[5];
				break;
				case "3CT2D":
				data['plate'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3] + reg_array[4];
				data['prefix'] = null;
				data['suffix'] = reg_array[0] + reg_array[1] + reg_array[2];
				data['number'] = reg_array[3] + reg_array[4];
				break;
				case "3CT1D":
				data['plate'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3];
				data['prefix'] = null;
				data['suffix'] = reg_array[0] + reg_array[1] + reg_array[2];
				data['number'] = reg_array[3];
				break;
				case "4DT3C":
				data['plate'] = reg_array[0] + reg_array[1] + reg_array[2] + reg_array[3] + " " + reg_array[4] + reg_array[5] + reg_array[6];
				data['prefix'] = null;
				data['suffix'] = reg_array[4] + reg_array[5] + reg_array[6];
				data['number'] = reg_array[0] + reg_array[1] + reg_array[2] + reg_array[3];
				break;
				case "3DT3C":
				data['plate'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3] + reg_array[4] + reg_array[5];
				data['prefix'] = null;
				data['suffix'] = reg_array[3] + reg_array[4] + reg_array[5];
				data['number'] = reg_array[0] + reg_array[1] + reg_array[2];
				break;
				case "2DT3C":
				data['plate'] = reg_array[0] + reg_array[1] + " " + reg_array[2] + reg_array[3] + reg_array[4];
				data['prefix'] = null;
				data['suffix'] = reg_array[2] + reg_array[3] + reg_array[4];
				data['number'] = reg_array[0] + reg_array[1];
				break;
				case "1DT3C":
				data['plate'] = reg_array[0] + " " + reg_array[1] + reg_array[2] + reg_array[3];
				data['prefix'] = null;
				data['suffix'] = reg_array[1] + reg_array[2] + reg_array[3];
				data['number'] = reg_array[0];
				break;
				case "P1":
				data['plate'] = reg_array[0] + reg_array[1] + " " + reg_array[2] + reg_array[3] + reg_array[4];
				data['prefix'] = reg_array[0];
				data['suffix'] = reg_array[2] + reg_array[3] + reg_array[4];
				data['number'] = reg_array[1];
				break;
				case "P2":
				data['plate'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3] + reg_array[4] + reg_array[5];
				data['prefix'] = reg_array[0];
				data['suffix'] = reg_array[3] + reg_array[4] + reg_array[5];
				data['number'] = reg_array[1] + reg_array[2];
				break;
				case "P3":
				data['plate'] = reg_array[0] + reg_array[1] + reg_array[2] + reg_array[3] + " " + reg_array[4] + reg_array[5] + reg_array[6];
				data['prefix'] = reg_array[0];
				data['suffix'] = reg_array[4] + reg_array[5] + reg_array[6];
				data['number'] = reg_array[1] + reg_array[2] + reg_array[3];
				break;
				case "S1":
				data['plate'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3] + reg_array[4];
				data['prefix'] = reg_array[4];
				data['suffix'] = reg_array[0] + reg_array[1] + reg_array[2];
				data['number'] = reg_array[3];
				break;
				case "S2":
				data['plate'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3] + reg_array[4] + reg_array[5];
				data['prefix'] = reg_array[5];
				data['suffix'] = reg_array[0] + reg_array[1] + reg_array[2];
				data['number'] = reg_array[3] + reg_array[4];
				break;
				case "S3":
				data['plate'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3] + reg_array[4] + reg_array[5] + reg_array[6];
				data['prefix'] = reg_array[6];
				data['suffix'] = reg_array[0] + reg_array[1] + reg_array[2];
				data['number'] = reg_array[3] + reg_array[4] + reg_array[5];
				break;
				case "MILLENNIUM":
				data['plate'] = reg_array[0] + reg_array[1] + reg_array[2] + reg_array[3] + " " + reg_array[4] + reg_array[5] + reg_array[6];
				data['prefix'] = reg_array[0] + reg_array[1];
				data['suffix'] = reg_array[4] + reg_array[5] + reg_array[6];
				data['number'] = reg_array[2] + reg_array[3];
				break;
			}

			//--------------------------------------------------------------------------------------------
			
			// Number starting zero, but isn't millennium!
			if(data['plate_format']!="MILLENNIUM" && data['number'][0]=="0") {	
				err=8;
			}
			
			//--------------------------------------------------------------------------------------------
		
			if(qflag && !err) {
			
				if (data['plate_format']!="P1" && data['plate_format']!="P2" && data['plate_format']!="P3") {	
					
					// Q ONLY valid in prefix reg...
					err=4;
					
				} else {
				
					// And then, only valid in prefix letter slot!
				
					if (data['plate_format']=="P1") {
						if(reg_array[2]=="Q" || reg_array[3]=="Q" || reg_array[4]=="Q") {	
							err=4;
						}
					}
				
					else if (data['plate_format']=="P2") {
						if (reg_array[3]=="Q" || reg_array[4]=="Q" || reg_array[5]=="Q") {	
							err=4; 
						}
					}
				
					else if (data['plate_format']=="P3") {
						if (reg_array[4]=="Q" || reg_array[5]=="Q" || reg_array[6]=="Q") {	
							err=4;
						}
					}
					
				}
				
			}
	
			//--------------------------------------------------------------------------------------------
		
			if(irishi && !err) {
			
				if(data['plate_format']=="P1" || data['plate_format']=="P2" || data['plate_format']=="P3" || data['plate_format']=="S1" || data['plate_format']=="S2" || data['plate_format']=="S3" || data['plate_format']=="MILLENNIUM" || data['plate_format']=="1CT1D" || data['plate_format']=="1CT2D" || data['plate_format']=="1CT3D" || data['plate_format']=="1CT4D" || data['plate_format']=="1DT1C" || data['plate_format']=="2DT1C" || data['plate_format']=="3DT1C" || data['plate_format']=="4DT1C") {
					
					// Plate contains an I but isn't of Irish format
					err=5;
				
				} else {       
					
					data['irish']=true;
				
				}		
			
			}
		
			//--------------------------------------------------------------------------------------------
		
			if(irishz && !err) {
			
				if(data['plate_format']=="P1" || data['plate_format']=="P2" || data['plate_format']=="P3" || data['plate_format']=="S1" || data['plate_format']=="S2" || data['plate_format']=="S3" || data['plate_format']=="1CT1D" || data['plate_format']=="1CT2D" || data['plate_format']=="1CT3D" || data['plate_format']=="1CT4D" || data['plate_format']=="1DT1C" || data['plate_format']=="2DT1C" || data['plate_format']=="3DT1C" || data['plate_format']=="4DT1C") {
					
					// Plate contains a Z but isn't of Irish format
					err=5;
				
				} else if (data['plate_format']=="MILLENNIUM") {
				
					if(reg_array[0]=="Z" || reg_array[1]=="Z") {
						// Z not valid in first 2 letters!
						err=7;
					}
		
				} else {       
					
					data['irish']=true;    
				
				}		
			
			}	

			//--------------------------------------------------------------------------------------------
			
			if(!err) {
	
				if (data['plate_format']=="P1" || data['plate_format']=="P2" || data['plate_format']=="P3") {
				
					switch (data['prefix'])
					{
						case "A":
						data['year_of_issue']="1983";
						data['year_of_issue_expiry']="1984";
						break;
						case "B":
						data['year_of_issue']="1984";
						data['year_of_issue_expiry']="1985";
						break;
						case "C":
						data['year_of_issue']="1985";
						data['year_of_issue_expiry']="1986";
						break;
						case "D":
						data['year_of_issue']="1986";
						data['year_of_issue_expiry']="1987";
						break;
						case "E":
						data['year_of_issue']="1987";
						data['year_of_issue_expiry']="1988";
						break;
						case "F":
						data['year_of_issue']="1988";
						data['year_of_issue_expiry']="1989";
						break;
						case "G":
						data['year_of_issue']="1989";
						data['year_of_issue_expiry']="1990";
						break;
						case "H":
						data['year_of_issue']="1990";
						data['year_of_issue_expiry']="1991";
						break;
						case "J":
						data['year_of_issue']="1991";
						data['year_of_issue_expiry']="1992";
						break;
						case "K":
						data['year_of_issue']="1992";
						data['year_of_issue_expiry']="1993";
						break;
						case "L":
						data['year_of_issue']="1993";
						data['year_of_issue_expiry']="1994";
						break;
						case "M":
						data['year_of_issue']="1994";
						data['year_of_issue_expiry']="1995";
						break;
						case "N":
						data['year_of_issue']="1995";
						data['year_of_issue_expiry']="1996";
						break;
						case "P":
						data['year_of_issue']="1996";
						data['year_of_issue_expiry']="1997";
						break;
						case "R":
						data['year_of_issue']="1997";
						data['year_of_issue_expiry']="1998";
						break;
						case "S":
						data['year_of_issue']="1998";
						data['year_of_issue_expiry']="1999";
						break;
						case "T":
						data['year_of_issue']="1999";
						data['year_of_issue_expiry']="1999";
						break;
						case "V":
						data['year_of_issue']="1999";
						data['year_of_issue_expiry']="2000";
						break;
						case "W":
						data['year_of_issue']="2000";
						data['year_of_issue_expiry']="2000";
						break;
						case "X":
						data['year_of_issue']="2000";
						data['year_of_issue_expiry']="2001";
						break;
						case "Y":
						data['year_of_issue']="2001";
						data['year_of_issue_expiry']="2001";
						break;
					}
				
				}
	
				else if (data['plate_format']=="MILLENNIUM") {
				
					if (parseInt(data['number'])>50) {				
						// Number > 50 means released second half of the year (early May)
						var year2=(parseInt(data['number'])-50);
						if (year2<10)
						{
							var yeary = "0" + year2;
							year2 = yeary;
						}
						var year = "20" + String(year2);
					} else {
						// <= 50 means released first half of the year (early October)
						var year = "20" + String(data['number']);
					}
	
					data['year_of_issue'] = year;
					if (parseInt(data['number'])>50) {		
						data['year_of_issue_expiry']=String(parseInt(year) + 1);
					} else {
						data['year_of_issue_expiry']=String(parseInt(year));
					}
					
				}
	
				else if (data['plate_format']=="S1" || data['plate_format']=="S2" || data['plate_format']=="S3") {
				
					switch (data['prefix'])
					{
						case "A":
						data['year_of_issue']="1963";
						data['year_of_issue_expiry']="1964";
						break;
						case "B":
						data['year_of_issue']="1964";
						data['year_of_issue_expiry']="1965";
						break;
						case "C":
						data['year_of_issue']="1965";
						data['year_of_issue_expiry']="1966";
						break;
						case "D":
						data['year_of_issue']="1966";
						data['year_of_issue_expiry']="1967";
						break;
						case "E":
						data['year_of_issue']="1967";
						data['year_of_issue_expiry']="1967";
						break;
						case "F":
						data['year_of_issue']="1967";
						data['year_of_issue_expiry']="1968";
						break;
						case "G":
						data['year_of_issue']="1968";
						data['year_of_issue_expiry']="1969";
						break;
						case "H":
						data['year_of_issue']="1969";
						data['year_of_issue_expiry']="1970";
						break;
						case "J":
						data['year_of_issue']="1970";
						data['year_of_issue_expiry']="1971";
						break;
						case "K":
						data['year_of_issue']="1971";
						data['year_of_issue_expiry']="1972";
						break;
						case "L":
						data['year_of_issue']="1972";
						data['year_of_issue_expiry']="1973";
						break;
						case "M":
						data['year_of_issue']="1973";
						data['year_of_issue_expiry']="1974";
						break;
						case "N":
						data['year_of_issue']="1974";
						data['year_of_issue_expiry']="1975";
						break;
						case "P":
						data['year_of_issue']="1975";
						data['year_of_issue_expiry']="1976";
						break;
						case "R":
						data['year_of_issue']="1976";
						data['year_of_issue_expiry']="1977";
						break;
						case "S":
						data['year_of_issue']="1977";
						data['year_of_issue_expiry']="1978";
						break;
						case "T":
						data['year_of_issue']="1978";
						data['year_of_issue_expiry']="1979";
						break;
						case "V":
						data['year_of_issue']="1979";
						data['year_of_issue_expiry']="1980";
						break;
						case "W":
						data['year_of_issue']="1980";
						data['year_of_issue_expiry']="1981";
						break;
						case "X":
						data['year_of_issue']="1981";
						data['year_of_issue_expiry']="1982";
						break;
						case "Y":
						data['year_of_issue']="1982";
						data['year_of_issue_expiry']="1983";
						break;
					}
					
				}
	
				else {
				
					data['year_of_issue']="DAT";

				}
			
			}
			
			//--------------------------------------------------------------------------------------------
			
			if(!err) {

				if (data['plate_format']=="P1" || data['plate_format']=="P2" || data['plate_format']=="P3") {
					switch (data['prefix']) {
						case "A":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "B":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "C":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "D":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "E":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "F":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "G":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "H":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "J":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "K":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "L":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "M":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "N":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "P":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "R":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "S":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="03";
						break;
						case "T":
						data['month_of_issue']="03";
						data['month_of_issue_expiry']="09";
						break;
						case "V":
						data['month_of_issue']="09";
						data['month_of_issue_expiry']="03";
						break;
						case "W":
						data['month_of_issue']="03";
						data['month_of_issue_expiry']="09";
						break;
						case "X":
						data['month_of_issue']="09";
						data['month_of_issue_expiry']="03";
						break;
						case "Y":
						data['month_of_issue']="03";
						data['month_of_issue_expiry']="09";
						break;
					}
				}

				else if (data['plate_format']=="MILLENNIUM") {
					if (parseInt(data['number'])>50)
					{	
						data['month_of_issue']="09";	
						data['month_of_issue_expiry']="03";
					}
					else
					{	
						data['month_of_issue']="03";  
						data['month_of_issue_expiry']="09";
					}
				}

				else if (data['plate_format']=="S1" || data['plate_format']=="S2" || data['plate_format']=="S3") {
					switch (data['prefix']) {
						case "A":
						data['month_of_issue']="02";
						data['month_of_issue_expiry']="01";
						break;
						case "B":
						data['month_of_issue']="01";
						data['month_of_issue_expiry']="01";
						break;
						case "C":
						data['month_of_issue']="01";
						data['month_of_issue_expiry']="01";
						break;
						case "D":
						data['month_of_issue']="01";
						data['month_of_issue_expiry']="01";
						break;
						case "E":
						data['month_of_issue']="01";
						data['month_of_issue_expiry']="08";
						break;
						case "F":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "G":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "H":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "J":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "K":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "L":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "M":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "N":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "P":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "R":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "S":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "T":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "V":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "W":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "X":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
						case "Y":
						data['month_of_issue']="08";
						data['month_of_issue_expiry']="08";
						break;
					}
				}

			}

		}
	
		//--------------------------------------------------------------------------------------------	
		
		else {
		
			// No known format!
			err=1;
			
		}	
		
	}
	
	//------------------------------------------------------------------------------------------------	
	
	delete data['plate_format'];
	callback(err,data);
	
}

module.exports = {
  validate: validate
};
