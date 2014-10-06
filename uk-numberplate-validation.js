// Analyse a string, returning correctly formatted version of reg and other details...
function uk-numberplate-validation(input,callback) {

	input = input.trim().toUpperCase();
	input = input.replace(" ","");
	input = input.replace("\r","");
	input = input.replace("\n","");
	
	var reg = input.replace(/[\W\s]+/g,"");
		
	var irishi = false;
	var irishz = false;
	var qflag = false;
	
	var return_value = new Array();
	return_value['plate_display']=input;			// CORRECTLY SPACED PLATE 
	return_value['plate_format']=null;     			// PLATE FORMAT CODE 
	return_value['irish']="0";        				// IRISH FLAG, 0=NO 1=YES 

	return_value['error']=0;        				// ERROR CODE : 
													// 0 = OK 				
													// 1 = UNKNOWN FORMAT			
													// 2 = INVALID CHARS 			
													// 3 = ASTERISK IN REG			
													// 4 = Q IN REG (NOT PREFIX)		
													// 5 = I BUT NOT IRISH                 
													// 6 = Z BUT NOT IRISH OR MILL          
													// 7 = MILLENNIUM Z IN FIRST 2 CHAR     
													// 8 = INVALID NUMBER (LEADING ZERO)            

	return_value['prefix']=null;        			// PREFIX (YEAR ID)    	 	
	return_value['suffix']=null;        			// SUFFIX (INDEX)   	
	return_value['number']=null;      				// NUMBER 	   	
		
	return_value['year_of_issue']="UNK";			// ESTIMATED YEAR OF ISSUE
	return_value['year_of_issue_expiry']="UNK";		// WHAT YEAR DID THE FOLLOWING SEQUENCE SUPERCEED THIS?
	return_value['month_of_issue']="UNK";			// ESTIMATED MONTH OF ISSUE
	return_value['month_of_issue_expiry']="UNK";	// WHAT MONTH DID THE FOLLOWING SEQUENCE SUPERCEED THIS?
		
	//------------------------------------------------------------------------------------------------
	
	if(input!=reg) {
	
		return_value['error']=2;
		if(input.indexOf("*")!==-1)
		{ 	return_value['error']=3;   	}
	
	} 	
	
	//------------------------------------------------------------------------------------------------

	if(!return_value['error']) {
	
		var format = new Array();
		
		format['P1'] = '[A-Z]{1}[0-9]{1}[A-Z]{3}';	// A1 POB
		format['P2'] = '[A-Z]{1}[0-9]{2}[A-Z]{3}';	// A12 POB
		format['P3'] = '[A-Z]{1}[0-9]{3}[A-Z]{3}';	// A123 POB
		
		format['S1'] = '[A-Z]{3}[0-9]{1}[A-Z]{1}';	// POB 1A
		format['S2'] = '[A-Z]{3}[0-9]{2}[A-Z]{1}';	// POB 12A
		format['S3'] = '[A-Z]{3}[0-9]{3}[A-Z]{1}';	// POB 123A
		
		format['MILLENNIUM'] = '[A-Z]{2}[0-9]{2}[A-Z]{3}';	// AB12 POB
	
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
				return_value['plate_format'] = k;
				break;
			}		
		}
			
		if(return_value['plate_format']!=null) {
		
			if(reg.indexOf("I")!=-1)
			{       irishi=true;   	}
			if(reg.indexOf("Z")!=-1)
			{       irishz=true;   	}
			if(reg.indexOf("Q")!=-1)
			{       qflag=true;    	}
			
			reg_array = reg.split("");
	
			switch (return_value['plate_format'])
			{
				case "1CT4D":
				return_value['plate_display'] = reg_array[0] + " " + reg_array[1] + reg_array[2] + reg_array[3] + reg_array[4];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[0];
				return_value['suffix_1'] = reg_array[0];
				return_value['number'] = reg_array[1] + reg_array[2] + reg_array[3] + reg_array[4];
				return_value['number_1'] = reg_array[1];
				return_value['number_2'] = reg_array[2];
				return_value['number_3'] = reg_array[3];
				return_value['number_4'] = reg_array[4];
				return_value['english_format'] = "single character then four digit";
				break;
				case "1CT3D":
				return_value['plate_display'] = reg_array[0] + " " + reg_array[1] + reg_array[2] + reg_array[3];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[0];
				return_value['suffix_1'] = reg_array[0];
				return_value['number'] = reg_array[1] + reg_array[2] + reg_array[3];
				return_value['number_1'] = reg_array[1];
				return_value['number_2'] = reg_array[2];
				return_value['number_3'] = reg_array[3];
				return_value['english_format'] = "single character then three digit";
				break;
				case "1CT2D":
				return_value['plate_display'] = reg_array[0] + " " + reg_array[1] + reg_array[2];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[0];
				return_value['suffix_1'] = reg_array[0];
				return_value['number'] = reg_array[1] + reg_array[2];
				return_value['number_1'] = reg_array[1];
				return_value['number_2'] = reg_array[2];		
				return_value['english_format'] = "single character then two digit";
				break;
				case "1CT1D":
				return_value['plate_display'] = reg_array[0] + " " + reg_array[1];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[0];
				return_value['suffix_1'] = reg_array[0];
				return_value['number'] = reg_array[1];
				return_value['number_1'] = reg_array[1];
				return_value['english_format'] = "single character then single digit";
				break;
				case "4DT1C":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + reg_array[2] + reg_array[3] + " " + reg_array[4];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[4];
				return_value['suffix_1'] = reg_array[4];
				return_value['number'] = reg_array[0] + reg_array[1] + reg_array[2] + reg_array[3];
				return_value['number_1'] = reg_array[0];
				return_value['number_2'] = reg_array[1];
				return_value['number_3'] = reg_array[2];
				return_value['number_4'] = reg_array[3];
				return_value['english_format'] = "four digit then single character";
				break;
				case "3DT1C":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[3];
				return_value['suffix_1'] = reg_array[3];
				return_value['number'] = reg_array[0] + reg_array[1] + reg_array[2];
				return_value['number_1'] = reg_array[0];
				return_value['number_2'] = reg_array[1];
				return_value['number_3'] = reg_array[2];
				return_value['english_format'] = "three digit then single character";
				break;
				case "2DT1C":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + " " + reg_array[2];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[2];
				return_value['suffix_1'] = reg_array[2];
				return_value['number'] = reg_array[0] + reg_array[1];
				return_value['number_1'] = reg_array[0];
				return_value['number_2'] = reg_array[1];
				return_value['english_format'] = "two digit then single character";
				break;
				case "1DT1C":
				return_value['plate_display'] = reg_array[0] + " " + reg_array[1];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[1];
				return_value['suffix_1'] = reg_array[1];
				return_value['number'] = reg_array[0];
				return_value['number_1'] = reg_array[0];
				return_value['english_format'] = "single digit then single character";
				break;
				case "2CT4D":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + " " + reg_array[2] + reg_array[3] + reg_array[4] + reg_array[5];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[0] + reg_array[1];
				return_value['suffix_1'] = reg_array[0];
				return_value['suffix_2'] = reg_array[1];
				return_value['number'] = reg_array[2] + reg_array[3] + reg_array[4] + reg_array[5];
				return_value['number_1'] = reg_array[2];
				return_value['number_2'] = reg_array[3];
				return_value['number_3'] = reg_array[4];
				return_value['number_4'] = reg_array[5];
				return_value['english_format'] = "two character then four digit";
				break;
				case "2CT3D":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + " " + reg_array[2] + reg_array[3] + reg_array[4];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[0] + reg_array[1];
				return_value['suffix_1'] = reg_array[0];
				return_value['suffix_2'] = reg_array[1];
				return_value['number'] = reg_array[2] + reg_array[3] + reg_array[4];
				return_value['number_1'] = reg_array[2];
				return_value['number_2'] = reg_array[3];
				return_value['number_3'] = reg_array[4];
				return_value['english_format'] = "two character then three digit";
				break;
				case "2CT2D":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + " " + reg_array[2] + reg_array[3];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[0] + reg_array[1];
				return_value['suffix_1'] = reg_array[0];
				return_value['suffix_2'] = reg_array[1];
				return_value['number'] = reg_array[2] + reg_array[3];
				return_value['number_1'] = reg_array[2];
				return_value['number_2'] = reg_array[3];
				return_value['english_format'] = "two character then two digit";
				break;
				case "2CT1D":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + " " + reg_array[2];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[0] + reg_array[1];
				return_value['suffix_1'] = reg_array[0];
				return_value['suffix_2'] = reg_array[1];
				return_value['number'] = reg_array[2];
				return_value['number_1'] = reg_array[2];
				return_value['english_format'] = "two character then single digit";
				break;
				case "4DT2C":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + reg_array[2] + reg_array[3] + " " + reg_array[4] + reg_array[5];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[4] + reg_array[5];
				return_value['suffix_1'] = reg_array[4];
				return_value['suffix_2'] = reg_array[5];
				return_value['number'] = reg_array[0] + reg_array[1] + reg_array[2] + reg_array[3];
				return_value['number_1'] = reg_array[0];
				return_value['number_2'] = reg_array[1];
				return_value['number_3'] = reg_array[2];
				return_value['number_4'] = reg_array[3];
				return_value['english_format'] = "four digit then two character";
				break;
				case "3DT2C":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3] + reg_array[4];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[3] + reg_array[4];
				return_value['suffix_1'] = reg_array[3];
				return_value['suffix_2'] = reg_array[4];
				return_value['number'] = reg_array[0] + reg_array[1] + reg_array[2];
				return_value['number_1'] = reg_array[0];
				return_value['number_2'] = reg_array[1];
				return_value['number_3'] = reg_array[2];
				return_value['english_format'] = "three digit then two character";
				break;
				case "2DT2C":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + " " + reg_array[2] + reg_array[3];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[2] + reg_array[3];
				return_value['suffix_1'] = reg_array[2];
				return_value['suffix_2'] = reg_array[3];
				return_value['number'] = reg_array[0] + reg_array[1];
				return_value['number_1'] = reg_array[0];
				return_value['number_2'] = reg_array[1];
				return_value['english_format'] = "two digit then two character";
				break;
				case "1DT2C":
				return_value['plate_display'] = reg_array[0] + " " + reg_array[1] + reg_array[2];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[1] + reg_array[2];
				return_value['suffix_1'] = reg_array[1];
				return_value['suffix_2'] = reg_array[2];
				return_value['number'] = reg_array[0];
				return_value['number_1'] = reg_array[0];
				return_value['english_format'] = "single digit then two character";
				break;
				case "3CT4D":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3] + reg_array[4] + reg_array[5] + reg_array[6];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[0] + reg_array[1] + reg_array[2];
				return_value['suffix_1'] = reg_array[0];
				return_value['suffix_2'] = reg_array[1];
				return_value['suffix_3'] = reg_array[2];
				return_value['number'] = reg_array[3] + reg_array[4] + reg_array[5] + reg_array[6];
				return_value['number_1'] = reg_array[3];
				return_value['number_2'] = reg_array[4];
				return_value['number_3'] = reg_array[5];
				return_value['number_4'] = reg_array[6];
				return_value['english_format'] = "three character then four digit";
				break;
				case "3CT3D":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3] + reg_array[4] + reg_array[5];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[0] + reg_array[1] + reg_array[2];
				return_value['suffix_1'] = reg_array[0];
				return_value['suffix_2'] = reg_array[1];
				return_value['suffix_3'] = reg_array[2];
				return_value['number'] = reg_array[3] + reg_array[4] + reg_array[5];
				return_value['number_1'] = reg_array[3];
				return_value['number_2'] = reg_array[4];
				return_value['number_3'] = reg_array[5];
				return_value['english_format'] = "three character then three digit";
				break;
				case "3CT2D":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3] + reg_array[4];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[0] + reg_array[1] + reg_array[2];
				return_value['suffix_1'] = reg_array[0];
				return_value['suffix_2'] = reg_array[1];
				return_value['suffix_3'] = reg_array[2];
				return_value['number'] = reg_array[3] + reg_array[4];
				return_value['number_1'] = reg_array[3];
				return_value['number_2'] = reg_array[4];
				return_value['english_format'] = "three character then two digit";
				break;
				case "3CT1D":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[0] + reg_array[1] + reg_array[2];
				return_value['suffix_1'] = reg_array[0];
				return_value['suffix_2'] = reg_array[1];
				return_value['suffix_3'] = reg_array[2];
				return_value['number'] = reg_array[3];
				return_value['number_1'] = reg_array[3];
				return_value['english_format'] = "three character then single digit";
				break;
				case "4DT3C":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + reg_array[2] + reg_array[3] + " " + reg_array[4] + reg_array[5] + reg_array[6];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[4] + reg_array[5] + reg_array[6];
				return_value['suffix_1'] = reg_array[4];
				return_value['suffix_2'] = reg_array[5];
				return_value['suffix_3'] = reg_array[6];
				return_value['number'] = reg_array[0] + reg_array[1] + reg_array[2] + reg_array[3];
				return_value['number_1'] = reg_array[0];
				return_value['number_2'] = reg_array[1];
				return_value['number_3'] = reg_array[2];
				return_value['number_4'] = reg_array[3];
				return_value['english_format'] = "four digit then three character";
				break;
				case "3DT3C":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3] + reg_array[4] + reg_array[5];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[3] + reg_array[4] + reg_array[5];
				return_value['suffix_1'] = reg_array[3];
				return_value['suffix_2'] = reg_array[4];
				return_value['suffix_3'] = reg_array[5];
				return_value['number'] = reg_array[0] + reg_array[1] + reg_array[2];
				return_value['number_1'] = reg_array[0];
				return_value['number_2'] = reg_array[1];
				return_value['number_3'] = reg_array[2];
				return_value['english_format'] = "three digit then three character";
				break;
				case "2DT3C":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + " " + reg_array[2] + reg_array[3] + reg_array[4];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[2] + reg_array[3] + reg_array[4];
				return_value['suffix_1'] = reg_array[2];
				return_value['suffix_2'] = reg_array[3];
				return_value['suffix_3'] = reg_array[4];
				return_value['number'] = reg_array[0] + reg_array[1];
				return_value['number_1'] = reg_array[0];
				return_value['number_2'] = reg_array[1];
				return_value['english_format'] = "two digit then three character";
				break;
				case "1DT3C":
				return_value['plate_display'] = reg_array[0] + " " + reg_array[1] + reg_array[2] + reg_array[3];
				return_value['prefix'] = null;
				return_value['suffix'] = reg_array[1] + reg_array[2] + reg_array[3];
				return_value['suffix_1'] = reg_array[1];
				return_value['suffix_2'] = reg_array[2];
				return_value['suffix_3'] = reg_array[3];
				return_value['number'] = reg_array[0];
				return_value['number_1'] = reg_array[0];
				return_value['english_format'] = "single digit then three character";
				break;
				case "P1":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + " " + reg_array[2] + reg_array[3] + reg_array[4];
				return_value['prefix'] = reg_array[0];
				return_value['prefix_1'] = reg_array[0];
				return_value['suffix'] = reg_array[2] + reg_array[3] + reg_array[4];
				return_value['suffix_1'] = reg_array[2];
				return_value['suffix_2'] = reg_array[3];
				return_value['suffix_3'] = reg_array[4];
				return_value['number'] = reg_array[1];
				return_value['number_1'] = reg_array[1];
				return_value['english_format'] = "single digit prefix";
				break;
				case "P2":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3] + reg_array[4] + reg_array[5];
				return_value['prefix'] = reg_array[0];
				return_value['prefix_1'] = reg_array[0];
				return_value['suffix'] = reg_array[3] + reg_array[4] + reg_array[5];
				return_value['suffix_1'] = reg_array[3];
				return_value['suffix_2'] = reg_array[4];
				return_value['suffix_3'] = reg_array[5];
				return_value['number'] = reg_array[1] + reg_array[2];
				return_value['number_1'] = reg_array[1];
				return_value['number_2'] = reg_array[2];
				return_value['english_format'] = "double digit prefix";
				break;
				case "P3":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + reg_array[2] + reg_array[3] + " " + reg_array[4] + reg_array[5] + reg_array[6];
				return_value['prefix'] = reg_array[0];
				return_value['prefix_1'] = reg_array[0];
				return_value['suffix'] = reg_array[4] + reg_array[5] + reg_array[6];
				return_value['suffix_1'] = reg_array[4];
				return_value['suffix_2'] = reg_array[5];
				return_value['suffix_3'] = reg_array[6];
				return_value['number'] = reg_array[1] + reg_array[2] + reg_array[3];
				return_value['number_1'] = reg_array[1];
				return_value['number_2'] = reg_array[2];
				return_value['number_3'] = reg_array[3];
				return_value['english_format'] = "three digit prefix";
				break;
				case "S1":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3] + reg_array[4];
				return_value['prefix'] = reg_array[4];
				return_value['prefix_1'] = reg_array[4];
				return_value['suffix'] = reg_array[0] + reg_array[1] + reg_array[2];
				return_value['suffix_1'] = reg_array[0];
				return_value['suffix_2'] = reg_array[1];
				return_value['suffix_3'] = reg_array[2];
				return_value['number'] = reg_array[3];
				return_value['number_1'] = reg_array[3];
				return_value['english_format'] = "single digit suffix";
				break;
				case "S2":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3] + reg_array[4] + reg_array[5];
				return_value['prefix'] = reg_array[5];
				return_value['prefix_1'] = reg_array[5];
				return_value['suffix'] = reg_array[0] + reg_array[1] + reg_array[2];
				return_value['suffix_1'] = reg_array[0];
				return_value['suffix_2'] = reg_array[1];
				return_value['suffix_3'] = reg_array[2];
				return_value['number'] = reg_array[3] + reg_array[4];
				return_value['number_1'] = reg_array[3];
				return_value['number_2'] = reg_array[4];
				return_value['english_format'] = "double digit suffix";
				break;
				case "S3":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + reg_array[2] + " " + reg_array[3] + reg_array[4] + reg_array[5] + reg_array[6];
				return_value['prefix'] = reg_array[6];
				return_value['prefix_1'] = reg_array[6];
				return_value['suffix'] = reg_array[0] + reg_array[1] + reg_array[2];
				return_value['suffix_1'] = reg_array[0];
				return_value['suffix_2'] = reg_array[1];
				return_value['suffix_3'] = reg_array[2];
				return_value['number'] = reg_array[3] + reg_array[4] + reg_array[5];
				return_value['number_1'] = reg_array[3];
				return_value['number_2'] = reg_array[4];
				return_value['number_3'] = reg_array[5];
				return_value['english_format'] = "three digit suffix";
				break;
				case "MILLENNIUM":
				return_value['plate_display'] = reg_array[0] + reg_array[1] + reg_array[2] + reg_array[3] + " " + reg_array[4] + reg_array[5] + reg_array[6];
				return_value['prefix'] = reg_array[0] + reg_array[1];
				return_value['prefix_1'] = reg_array[0];
				return_value['prefix_2'] = reg_array[1];
				return_value['suffix'] = reg_array[4] + reg_array[5] + reg_array[6];
				return_value['suffix_1'] = reg_array[4];
				return_value['suffix_2'] = reg_array[5];
				return_value['suffix_3'] = reg_array[6];
				return_value['number'] = reg_array[2] + reg_array[3];
				return_value['number_1'] = reg_array[2];
				return_value['number_2'] = reg_array[3];
				return_value['english_format'] = "new style";
				break;
			}

			//--------------------------------------------------------------------------------------------
			
			// Number starting zero, but isn't millennium!
			if(return_value['plate_format']!="MILLENNIUM" && return_value['number'][0]=="0") {	
				return_value['error']=8;
			}
			
			//--------------------------------------------------------------------------------------------
		
			if(qflag && !return_value['error']) {
			
				if (return_value['plate_format']!="P1" && return_value['plate_format']!="P2" && return_value['plate_format']!="P3") {	
					
					// Q ONLY valid in prefix reg...
					return_value['error']=4;
					
				} else {
				
					// And then, only valid in prefix letter slot!
				
					if (return_value['plate_format']=="P1") {
						if(reg_array[2]=="Q" || reg_array[3]=="Q" || reg_array[4]=="Q") {	
							return_value['error']=4;
						}
					}
				
					else if (return_value['plate_format']=="P2") {
						if (reg_array[3]=="Q" || reg_array[4]=="Q" || reg_array[5]=="Q") {	
							return_value['error']=4; 
						}
					}
				
					else if (return_value['plate_format']=="P3") {
						if (reg_array[4]=="Q" || reg_array[5]=="Q" || reg_array[6]=="Q") {	
							return_value['error']=4;
						}
					}
					
				}
				
			}
	
			//--------------------------------------------------------------------------------------------
		
			if(irishi && !return_value['error']) {
			
				if(return_value['plate_format']=="P1" || return_value['plate_format']=="P2" || return_value['plate_format']=="P3" || return_value['plate_format']=="S1" || return_value['plate_format']=="S2" || return_value['plate_format']=="S3" || return_value['plate_format']=="MILLENNIUM" || return_value['plate_format']=="1CT1D" || return_value['plate_format']=="1CT2D" || return_value['plate_format']=="1CT3D" || return_value['plate_format']=="1CT4D" || return_value['plate_format']=="1DT1C" || return_value['plate_format']=="2DT1C" || return_value['plate_format']=="3DT1C" || return_value['plate_format']=="4DT1C") {
					
					// Plate contains an I but isn't of Irish format
					return_value['error']=5;
				
				} else {       
					
					return_value['irish']="1";
				
				}		
			
			}
		
			//--------------------------------------------------------------------------------------------
		
			if(irishz && !return_value['error']) {
			
				if(return_value['plate_format']=="P1" || return_value['plate_format']=="P2" || return_value['plate_format']=="P3" || return_value['plate_format']=="S1" || return_value['plate_format']=="S2" || return_value['plate_format']=="S3" || return_value['plate_format']=="1CT1D" || return_value['plate_format']=="1CT2D" || return_value['plate_format']=="1CT3D" || return_value['plate_format']=="1CT4D" || return_value['plate_format']=="1DT1C" || return_value['plate_format']=="2DT1C" || return_value['plate_format']=="3DT1C" || return_value['plate_format']=="4DT1C") {
					
					// Plate contains a Z but isn't of Irish format
					return_value['error']=5;
				
				} else if (return_value['plate_format']=="MILLENNIUM") {
				
					if(reg_array[0]=="Z" || reg_array[1]=="Z") {
						// Z not valid in first 2 letters!
						return_value['error']=7;
					}
		
				} else {       
					
					return_value['irish']="1";    
				
				}		
			
			}	
		
			//--------------------------------------------------------------------------------------------	
		
			if(age && !return_value['error']) {
	
				if (return_value['plate_format']=="P1" || return_value['plate_format']=="P2" || return_value['plate_format']=="P3") {
	
					switch (return_value['prefix'])
					{
						case "A":
						return_value['age']=22;
						break;
						case "B":
						return_value['age']=23;
						break;
						case "C":
						return_value['age']=24;
						break;
						case "D":
						return_value['age']=25;
						break;
						case "E":
						return_value['age']=26;
						break;
						case "F":
						return_value['age']=27;
						break;
						case "G":
						return_value['age']=28;
						break;
						case "H":
						return_value['age']=29;
						break;
						case "J":
						return_value['age']=30;
						break;
						case "K":
						return_value['age']=31;
						break;
						case "L":
						return_value['age']=32;
						break;
						case "M":
						return_value['age']=33;
						break;
						case "N":
						return_value['age']=34;
						break;
						case "P":
						return_value['age']=35;
						break;
						case "R":
						return_value['age']=36;
						break;
						case "S":
						return_value['age']=37;
						break;
						case "T":
						return_value['age']=38;
						break;
						case "V":
						return_value['age']=39;
						break;
						case "W":
						return_value['age']=40;
						break;
						case "X":
						return_value['age']=41;
						break;
						case "Y":
						return_value['age']=42;
						break;
					}
					
				}
	
				else if (return_value['plate_format']=="MILLENNIUM") {
				
					if (parseInt(return_value['number'])>50) {
						return_value['age']=43;
						var yearsplit=parseInt(return_value['number'])-51;
						yearsplit=yearsplit*2;
						return_value['age']=parseInt(return_value['age'])+yearsplit;
					} else {
						return_value['age']=44;
						var yearsplit=parseInt(return_value['number'])-2;
						yearsplit=yearsplit*2;
						return_value['age']=parseInt(return_value['age'])+yearsplit;
					}
					
				}
	
				else if (return_value['plate_format']=="S1" || return_value['plate_format']=="S2" || return_value['plate_format']=="S3") {
				
					switch (return_value['prefix'])
					{
						case "A":
						return_value['age']=1;
						break;
						case "B":
						return_value['age']=2;
						break;
						case "C":
						return_value['age']=3;
						break;
						case "D":
						return_value['age']=4;
						break;
						case "E":
						return_value['age']=5;
						break;
						case "F":
						return_value['age']=6;
						break;
						case "G":
						return_value['age']=7;
						break;
						case "H":
						return_value['age']=8;
						break;
						case "J":
						return_value['age']=9;
						break;
						case "K":
						return_value['age']=10;
						break;
						case "L":
						return_value['age']=11;
						break;
						case "M":
						return_value['age']=12;
						break;
						case "N":
						return_value['age']=13;
						break;
						case "P":
						return_value['age']=14;
						break;
						case "R":
						return_value['age']=15;
						break;
						case "S":
						return_value['age']=16;
						break;
						case "T":
						return_value['age']=17;
						break;
						case "V":
						return_value['age']=18;
						break;
						case "W":
						return_value['age']=19;
						break;
						case "X":
						return_value['age']=20;
						break;
						case "Y":
						return_value['age']=21;
						break;
					}
					
				}
	
				return_value['age'] = parseInt(return_value['age']);
				
			}
		
			//--------------------------------------------------------------------------------------------
			
			if(yearofissue && !return_value['error']) {
	
				if (return_value['plate_format']=="P1" || return_value['plate_format']=="P2" || return_value['plate_format']=="P3") {
				
					switch (return_value['prefix'])
					{
						case "A":
						return_value['year_of_issue']="1983";
						return_value['year_of_issue_expiry']="1984";
						break;
						case "B":
						return_value['year_of_issue']="1984";
						return_value['year_of_issue_expiry']="1985";
						break;
						case "C":
						return_value['year_of_issue']="1985";
						return_value['year_of_issue_expiry']="1986";
						break;
						case "D":
						return_value['year_of_issue']="1986";
						return_value['year_of_issue_expiry']="1987";
						break;
						case "E":
						return_value['year_of_issue']="1987";
						return_value['year_of_issue_expiry']="1988";
						break;
						case "F":
						return_value['year_of_issue']="1988";
						return_value['year_of_issue_expiry']="1989";
						break;
						case "G":
						return_value['year_of_issue']="1989";
						return_value['year_of_issue_expiry']="1990";
						break;
						case "H":
						return_value['year_of_issue']="1990";
						return_value['year_of_issue_expiry']="1991";
						break;
						case "J":
						return_value['year_of_issue']="1991";
						return_value['year_of_issue_expiry']="1992";
						break;
						case "K":
						return_value['year_of_issue']="1992";
						return_value['year_of_issue_expiry']="1993";
						break;
						case "L":
						return_value['year_of_issue']="1993";
						return_value['year_of_issue_expiry']="1994";
						break;
						case "M":
						return_value['year_of_issue']="1994";
						return_value['year_of_issue_expiry']="1995";
						break;
						case "N":
						return_value['year_of_issue']="1995";
						return_value['year_of_issue_expiry']="1996";
						break;
						case "P":
						return_value['year_of_issue']="1996";
						return_value['year_of_issue_expiry']="1997";
						break;
						case "R":
						return_value['year_of_issue']="1997";
						return_value['year_of_issue_expiry']="1998";
						break;
						case "S":
						return_value['year_of_issue']="1998";
						return_value['year_of_issue_expiry']="1999";
						break;
						case "T":
						return_value['year_of_issue']="1999";
						return_value['year_of_issue_expiry']="1999";
						break;
						case "V":
						return_value['year_of_issue']="1999";
						return_value['year_of_issue_expiry']="2000";
						break;
						case "W":
						return_value['year_of_issue']="2000";
						return_value['year_of_issue_expiry']="2000";
						break;
						case "X":
						return_value['year_of_issue']="2000";
						return_value['year_of_issue_expiry']="2001";
						break;
						case "Y":
						return_value['year_of_issue']="2001";
						return_value['year_of_issue_expiry']="2001";
						break;
					}
				
				}
	
				else if (return_value['plate_format']=="MILLENNIUM") {
				
					if (parseInt(return_value['number'])>50) {				
						// Number > 50 means released second half of the year (early May?)
						var year2=(parseInt(return_value['number'])-50);
						if (year2<10)
						{
							var yeary = "0" + year2;
							year2 = yeary;
						}
						var year = "20" + String(year2);
					} else {
						// <= 50 means released first half of the year (early October?)
						var year = "20" + String(return_value['number']);
					}
	
					return_value['year_of_issue'] = year;
					if (parseInt(return_value['number'])>50) {		
						return_value['year_of_issue_expiry']=String(parseInt(year) + 1);
					} else {
						return_value['year_of_issue_expiry']=String(parseInt(year));
					}
					
				}
	
				else if (return_value['plate_format']=="S1" || return_value['plate_format']=="S2" || return_value['plate_format']=="S3") {
				
					switch (return_value['prefix'])
					{
						case "A":
						return_value['year_of_issue']="1963";
						return_value['year_of_issue_expiry']="1964";
						break;
						case "B":
						return_value['year_of_issue']="1964";
						return_value['year_of_issue_expiry']="1965";
						break;
						case "C":
						return_value['year_of_issue']="1965";
						return_value['year_of_issue_expiry']="1966";
						break;
						case "D":
						return_value['year_of_issue']="1966";
						return_value['year_of_issue_expiry']="1967";
						break;
						case "E":
						return_value['year_of_issue']="1967";
						return_value['year_of_issue_expiry']="1967";
						break;
						case "F":
						return_value['year_of_issue']="1967";
						return_value['year_of_issue_expiry']="1968";
						break;
						case "G":
						return_value['year_of_issue']="1968";
						return_value['year_of_issue_expiry']="1969";
						break;
						case "H":
						return_value['year_of_issue']="1969";
						return_value['year_of_issue_expiry']="1970";
						break;
						case "J":
						return_value['year_of_issue']="1970";
						return_value['year_of_issue_expiry']="1971";
						break;
						case "K":
						return_value['year_of_issue']="1971";
						return_value['year_of_issue_expiry']="1972";
						break;
						case "L":
						return_value['year_of_issue']="1972";
						return_value['year_of_issue_expiry']="1973";
						break;
						case "M":
						return_value['year_of_issue']="1973";
						return_value['year_of_issue_expiry']="1974";
						break;
						case "N":
						return_value['year_of_issue']="1974";
						return_value['year_of_issue_expiry']="1975";
						break;
						case "P":
						return_value['year_of_issue']="1975";
						return_value['year_of_issue_expiry']="1976";
						break;
						case "R":
						return_value['year_of_issue']="1976";
						return_value['year_of_issue_expiry']="1977";
						break;
						case "S":
						return_value['year_of_issue']="1977";
						return_value['year_of_issue_expiry']="1978";
						break;
						case "T":
						return_value['year_of_issue']="1978";
						return_value['year_of_issue_expiry']="1979";
						break;
						case "V":
						return_value['year_of_issue']="1979";
						return_value['year_of_issue_expiry']="1980";
						break;
						case "W":
						return_value['year_of_issue']="1980";
						return_value['year_of_issue_expiry']="1981";
						break;
						case "X":
						return_value['year_of_issue']="1981";
						return_value['year_of_issue_expiry']="1982";
						break;
						case "Y":
						return_value['year_of_issue']="1982";
						return_value['year_of_issue_expiry']="1983";
						break;
					}
					
				}
	
				else {
				
					return_value['year_of_issue']="DAT";
					
					/*
					if (return_value['irish']=="1") {
						
						// Irish reg				
	
						if (strstr(return_value['plate_format'],"CT")) {
						
							// Character THEN Digits (CT)
	
							primeindex=substr(return_value['suffix'],0,1);
	
							if (primeindex=="A")
							{
								switch (return_value['suffix'])
								{
									case "AAZ";
									return_value['year_of_issue']="1993";
									break;
									case "ABZ";
									return_value['year_of_issue']="1987";
									break;
									case "ACZ";
									return_value['year_of_issue']="1999";
									break;
									case "ADZ";
									return_value['year_of_issue']="1985";
									break;
									case "AHZ";
									return_value['year_of_issue']="1999";
									break;
									case "AIA";
									return_value['year_of_issue']="1966";
									break;
									case "AIB";
									return_value['year_of_issue']="1972";
									break;
									case "AIJ";
									return_value['year_of_issue']="1967";
									break;
									case "AIL";
									return_value['year_of_issue']="1966";
									break;
									case "AIW";
									return_value['year_of_issue']="1973";
									break;
									case "AJZ";
									return_value['year_of_issue']="2000";
									break;
									case "AKZ";
									return_value['year_of_issue']="1998";
									break;
									case "ALZ";
									return_value['year_of_issue']="1996";
									break;
									case "ANZ";
									return_value['year_of_issue']="2000";
									break;
									case "AOI";
									return_value['year_of_issue']="1968";
									break;
									case "ATI";
									return_value['year_of_issue']="1971";
									break;
									case "AUI";
									return_value['year_of_issue']="1973";
									break;
									case "AXI";
									return_value['year_of_issue']="1982";
									break;
									case "AZ";
									return_value['year_of_issue']="1928";
									break;
								}
							}
	
							else if (primeindex=="B")
							{
								switch (return_value['suffix'])
								{
									case "BEZ";
									return_value['year_of_issue']="2005";
									break;
									case "BAZ";
									return_value['year_of_issue']="1993";
									break;
									case "BBZ";
									return_value['year_of_issue']="1988";
									break;
									case "BCZ";
									return_value['year_of_issue']="1999";
									break;
									case "BDZ";
									return_value['year_of_issue']="1986";
									break;
									case "BHZ";
									return_value['year_of_issue']="2000";
									break;
									case "BIA";
									return_value['year_of_issue']="1967";
									break;
									case "BIB";
									return_value['year_of_issue']="1974";
									break;
									case "BIJ";
									return_value['year_of_issue']="1969";
									break;
									case "BIL";
									return_value['year_of_issue']="1974";
									break;
									case "BIW";
									return_value['year_of_issue']="1976";
									break;
									case "BJI";
									return_value['year_of_issue']="1973";
									break;
									case "BJZ";
									return_value['year_of_issue']="2001";
									break;
									case "BKZ";
									return_value['year_of_issue']="1998";
									break;
									case "BLZ";
									return_value['year_of_issue']="1997";
									break;
									case "BNZ";
									return_value['year_of_issue']="2001";
									break;
									case "BOI";
									return_value['year_of_issue']="1970";
									break;
									case "BUI";
									return_value['year_of_issue']="1978";
									break;
									case "BXI";
									return_value['year_of_issue']="1982";
									break;
									case "BZ";
									return_value['year_of_issue']="1930";
									break;
								}
							}
	
							else if (primeindex=="C")
							{
								switch (return_value['suffix'])
								{
									case "CAZ";
									return_value['year_of_issue']="1993";
									break;
									case "CBZ";
									return_value['year_of_issue']="1988";
									break;
									case "CCZ";
									return_value['year_of_issue']="1999";
									break;
									case "CDZ";
									return_value['year_of_issue']="1986";
									break;
									case "CHZ";
									return_value['year_of_issue']="2001";
									break;
									case "CIA";
									return_value['year_of_issue']="1968";
									break;
									case "CIB";
									return_value['year_of_issue']="1976";
									break;
									case "CIL";
									return_value['year_of_issue']="1978";
									break;
									case "CIW";
									return_value['year_of_issue']="1977";
									break;
									case "CJI";
									return_value['year_of_issue']="1975";
									break;
									case "CJZ";
									return_value['year_of_issue']="2001";
									break;
									case "CKZ";
									return_value['year_of_issue']="1999";
									break;
									case "CLZ";
									return_value['year_of_issue']="1998";
									break;
									case "CNZ";
									return_value['year_of_issue']="2001";
									break;
									case "COI";
									return_value['year_of_issue']="1971";
									break;
									case "CU";
									return_value['year_of_issue']="1970";
									break;
									case "CXI";
									return_value['year_of_issue']="1983";
									break;
									case "CZ";
									return_value['year_of_issue']="1932";
									break;
								}
							}
	
							else if (primeindex=="D")
							{
								switch (return_value['suffix'])
								{
									case "DAZ";
									return_value['year_of_issue']="1994";
									break;
									case "DBZ";
									return_value['year_of_issue']="1989";
									break;
									case "DCZ";
									return_value['year_of_issue']="1999";
									break;
									case "DDZ";
									return_value['year_of_issue']="1987";
									break;
									case "DHZ";
									return_value['year_of_issue']="2002";
									break;
									case "DIA";
									return_value['year_of_issue']="1970";
									break;
									case "DIB";
									return_value['year_of_issue']="1978";
									break;
									case "DIJ";
									return_value['year_of_issue']="1971";
									break;
									case "DIL";
									return_value['year_of_issue']="1982";
									break;
									case "DIW";
									return_value['year_of_issue']="1979";
									break;
									case "DJI";
									return_value['year_of_issue']="1977";
									break;
									case "DJZ";
									return_value['year_of_issue']="2002";
									break;
									case "DKZ";
									return_value['year_of_issue']="1999";
									break;
									case "DLZ";
									return_value['year_of_issue']="1998";
									break;
									case "DNZ";
									return_value['year_of_issue']="2002";
									break;
									case "DOI";
									return_value['year_of_issue']="1971";
									break;
									case "DUI";
									return_value['year_of_issue']="1986";
									break;
									case "DXI";
									return_value['year_of_issue']="1983";
									break;
									case "DZ";
									return_value['year_of_issue']="1932";
									break;
								}
							}
	
							else if (primeindex=="E")
							{
								switch (return_value['suffix'])
								{
									case "EAZ";
									return_value['year_of_issue']="1994";
									break;
									case "EBZ";
									return_value['year_of_issue']="1989";
									break;
									case "ECZ";
									return_value['year_of_issue']="2000";
									break;
									case "EDZ";
									return_value['year_of_issue']="1988";
									break;
									case "EHZ";
									return_value['year_of_issue']="2003";
									break;
									case "EIA";
									return_value['year_of_issue']="1971";
									break;
									case "EIB";
									return_value['year_of_issue']="1979";
									break;
									case "EIJ";
									return_value['year_of_issue']="1972";
									break;
									case "EIL";
									return_value['year_of_issue']="1985";
									break;
									case "EIW";
									return_value['year_of_issue']="1981";
									break;
									case "EJI";
									return_value['year_of_issue']="1978";
									break;
									case "EJZ";
									return_value['year_of_issue']="2002";
									break;
									case "EKZ";
									return_value['year_of_issue']="2000";
									break;
									case "ELZ";
									return_value['year_of_issue']="1999";
									break;
									case "ENZ";
									return_value['year_of_issue']="2003";
									break;
									case "EOI";
									return_value['year_of_issue']="1972";
									break;
									case "EUI";
									return_value['year_of_issue']="1990";
									break;
									case "EXI";
									return_value['year_of_issue']="1984";
									break;
									case "EZ";
									return_value['year_of_issue']="1935";
									break;
								}
							}
	
							else if (primeindex=="F")
							{
								switch (return_value['suffix'])
								{
									case "FAZ";
									return_value['year_of_issue']="1994";
									break;
									case "FBZ";
									return_value['year_of_issue']="1990";
									break;
									case "FCZ";
									return_value['year_of_issue']="2000";
									break;
									case "FDZ";
									return_value['year_of_issue']="1988";
									break;
									case "FIA";
									return_value['year_of_issue']="1972";
									break;
									case "FIB";
									return_value['year_of_issue']="1981";
									break;
									case "FIJ";
									return_value['year_of_issue']="1973";
									break;
									case "FIL";
									return_value['year_of_issue']="1986";
									break;
									case "FIW";
									return_value['year_of_issue']="1983";
									break;
									case "FJI";
									return_value['year_of_issue']="1980";
									break;
									case "FJZ";
									return_value['year_of_issue']="2003";
									break;
									case "FKZ";
									return_value['year_of_issue']="2001";
									break;
									case "FLZ";
									return_value['year_of_issue']="1999";
									break;
									case "FOI";
									return_value['year_of_issue']="1973";
									break;
									case "FXI";
									return_value['year_of_issue']="1984";
									break;
									case "FZ";
									return_value['year_of_issue']="1938";
									break;
								}
							}
	
							else if (primeindex=="G")
							{
								switch (return_value['suffix'])
								{
									case "GAZ";
									return_value['year_of_issue']="1995";
									break;
									case "GBZ";
									return_value['year_of_issue']="1991";
									break;
									case "GCZ";
									return_value['year_of_issue']="2000";
									break;
									case "GDZ";
									return_value['year_of_issue']="1989";
									break;
									case "GIA";
									return_value['year_of_issue']="1973";
									break;
									case "GIB";
									return_value['year_of_issue']="1982";
									break;
									case "GIJ";
									return_value['year_of_issue']="1974";
									break;
									case "GIL";
									return_value['year_of_issue']="1989";
									break;
									case "GIW";
									return_value['year_of_issue']="1984";
									break;
									case "GJI";
									return_value['year_of_issue']="1982";
									break;
									case "GJZ";
									return_value['year_of_issue']="2003";
									break;
									case "GKZ";
									return_value['year_of_issue']="2001";
									break;
									case "GLZ";
									return_value['year_of_issue']="2000";
									break;
									case "GOI";
									return_value['year_of_issue']="1973";
									break;
									case "GUI";
									return_value['year_of_issue']="1983";
									break;
									case "GUI";
									return_value['year_of_issue']="1993";
									break;
									case "GXI";
									return_value['year_of_issue']="1985";
									break;
									case "GZ";
									return_value['year_of_issue']="1942";
									break;
								}
							}
	
							else if (primeindex=="H")
							{
								switch (return_value['suffix'])
								{
									case "HAZ";
									return_value['year_of_issue']="1995";
									break;
									case "HBZ";
									return_value['year_of_issue']="1991";
									break;
									case "HCZ";
									return_value['year_of_issue']="2000";
									break;
									case "HDZ";
									return_value['year_of_issue']="1989";
									break;
									case "HIA";
									return_value['year_of_issue']="1974";
									break;
									case "HIB";
									return_value['year_of_issue']="1984";
									break;
									case "HIJ";
									return_value['year_of_issue']="1975";
									break;
									case "HIW";
									return_value['year_of_issue']="1985";
									break;
									case "HKZ";
									return_value['year_of_issue']="2001";
									break;
									case "HLZ";
									return_value['year_of_issue']="2000";
									break;
									case "HOI";
									return_value['year_of_issue']="1974";
									break;
									case "HOI";
									return_value['year_of_issue']="1983";
									break;
									case "HUI";
									return_value['year_of_issue']="1995";
									break;
									case "HXI";
									return_value['year_of_issue']="1985";
									break;
									case "HZ";
									return_value['year_of_issue']="1944";
									break;
									case "HZ";
									return_value['year_of_issue']="1964";
									break;
								}
							}
	
							else if (primeindex=="I")
							{
								switch (return_value['suffix'])
								{
									case "IA";
									return_value['year_of_issue']="1921";
									break;
									case "IAZ";
									return_value['year_of_issue']="1995";
									break;
									case "IB";
									return_value['year_of_issue']="1911";
									break;
									case "IBZ";
									return_value['year_of_issue']="1992";
									break;
									case "ICZ";
									return_value['year_of_issue']="2001";
									break;
									case "IDZ";
									return_value['year_of_issue']="1990";
									break;
									case "IIA";
									return_value['year_of_issue']="1975";
									break;
									case "IIB";
									return_value['year_of_issue']="1985";
									break;
									case "IIJ";
									return_value['year_of_issue']="1976";
									break;
									case "IIL";
									return_value['year_of_issue']="1992";
									break;
									case "IIW";
									return_value['year_of_issue']="1986";
									break;
									case "IJ";
									return_value['year_of_issue']="1923";
									break;
									case "IJI";
									return_value['year_of_issue']="1984";
									break;
									case "IKZ";
									return_value['year_of_issue']="2002";
									break;
									case "IL";
									return_value['year_of_issue']="1921";
									break;
									case "ILZ";
									return_value['year_of_issue']="2001";
									break;
									case "IUI";
									return_value['year_of_issue']="1996";
									break;
									case "IW";
									return_value['year_of_issue']="1923";
									break;
									case "IXI";
									return_value['year_of_issue']="1986";
									break;
								}
							}
	
							else if (primeindex=="J")
							{
								switch (return_value['suffix'])
								{
									case "JAZ";
									return_value['year_of_issue']="1995";
									break;
									case "JBZ";
									return_value['year_of_issue']="1993";
									break;
									case "JCZ";
									return_value['year_of_issue']="2001";
									break;
									case "JDZ";
									return_value['year_of_issue']="1990";
									break;
									case "JI";
									return_value['year_of_issue']="1903";
									break;
									case "JIA";
									return_value['year_of_issue']="1975";
									break;
									case "JIB";
									return_value['year_of_issue']="1986";
									break;
									case "JIJ";
									return_value['year_of_issue']="1977";
									break;
									case "JIL";
									return_value['year_of_issue']="1993";
									break;
									case "JIW";
									return_value['year_of_issue']="1988";
									break;
									case "JJI";
									return_value['year_of_issue']="1986";
									break;
									case "JKZ";
									return_value['year_of_issue']="2002";
									break;
									case "JLZ";
									return_value['year_of_issue']="2002";
									break;
									case "JOI";
									return_value['year_of_issue']="1974";
									break;
									case "JUI";
									return_value['year_of_issue']="1998";
									break;
									case "JXI";
									return_value['year_of_issue']="1986";
									break;
									case "JZ";
									return_value['year_of_issue']="1946";
									break;
								}
							}
	
							else if (primeindex=="K")
							{
								switch (return_value['suffix'])
								{
									case "KAZ";
									return_value['year_of_issue']="1996";
									break;
									case "KBZ";
									return_value['year_of_issue']="1993";
									break;
									case "KCZ";
									return_value['year_of_issue']="2001";
									break;
									case "KDZ";
									return_value['year_of_issue']="1991";
									break;
									case "KIA";
									return_value['year_of_issue']="1976";
									break;
									case "KIB";
									return_value['year_of_issue']="1986";
									break;
									case "KIJ";
									return_value['year_of_issue']="1978";
									break;
									case "KIW";
									return_value['year_of_issue']="1989";
									break;
									case "KJI";
									return_value['year_of_issue']="1986";
									break;
									case "KKZ";
									return_value['year_of_issue']="2003";
									break;
									case "KLZ";
									return_value['year_of_issue']="2002";
									break;
									case "KOI";
									return_value['year_of_issue']="1975";
									break;
									case "KUI";
									return_value['year_of_issue']="1999";
									break;
									case "KXI";
									return_value['year_of_issue']="1987";
									break;
									case "KZ";
									return_value['year_of_issue']="1947";
									break;
								}
							}
	
							else if (primeindex=="L")
							{
								switch (return_value['suffix'])
								{
									case "LAZ";
									return_value['year_of_issue']="1996";
									break;
									case "LBZ";
									return_value['year_of_issue']="1994";
									break;
									case "LCZ";
									return_value['year_of_issue']="2001";
									break;
									case "LDZ";
									return_value['year_of_issue']="1991";
									break;
									case "LIA";
									return_value['year_of_issue']="1997";
									break;
									case "LIB";
									return_value['year_of_issue']="1988";
									break;
									case "LIJ";
									return_value['year_of_issue']="1979";
									break;
									case "LIL";
									return_value['year_of_issue']="1994";
									break;
									case "LIW";
									return_value['year_of_issue']="1990";
									break;
									case "LJI";
									return_value['year_of_issue']="1988";
									break;
									case "LKZ";
									return_value['year_of_issue']="2003";
									break;
									case "LLZ";
									return_value['year_of_issue']="2003";
									break;
									case "LOI";
									return_value['year_of_issue']="1976";
									break;
									case "LUI";
									return_value['year_of_issue']="2001";
									break;
									case "LXI";
									return_value['year_of_issue']="1987";
									break;
									case "LZ";
									return_value['year_of_issue']="1947";
									break;
								}
							}
	
							else if (primeindex=="M")
							{
								switch (return_value['suffix'])
								{
									case "MAZ";
									return_value['year_of_issue']="1996";
									break;
									case "MBZ";
									return_value['year_of_issue']="1994";
									break;
									case "MCZ";
									return_value['year_of_issue']="2002";
									break;
									case "MDZ";
									return_value['year_of_issue']="1992";
									break;
									case "MIA";
									return_value['year_of_issue']="1978";
									break;
									case "MIB";
									return_value['year_of_issue']="1988";
									break;
									case "MIJ";
									return_value['year_of_issue']="1979";
									break;
									case "MIL";
									return_value['year_of_issue']="1991";
									break;
									case "MIL";
									return_value['year_of_issue']="1995";
									break;
									case "MIW";
									return_value['year_of_issue']="1991";
									break;
									case "MJI";
									return_value['year_of_issue']="1989";
									break;
									case "MLZ";
									return_value['year_of_issue']="2003";
									break;
									case "MOI";
									return_value['year_of_issue']="1976";
									break;
									case "MUI";
									return_value['year_of_issue']="2002";
									break;
									case "MXI";
									return_value['year_of_issue']="1988";
									break;
									case "MZ";
									return_value['year_of_issue']="1964";
									break;
								}
							}
	
							else if (primeindex=="N")
							{
								switch (return_value['suffix'])
								{
									case "NCZ";
									return_value['year_of_issue']="2002";
									break;
									case "NDZ";
									return_value['year_of_issue']="1992";
									break;
									case "NIA";
									return_value['year_of_issue']="1978";
									break;
									case "NIB";
									return_value['year_of_issue']="1989";
									break;
									case "NIJ";
									return_value['year_of_issue']="1980";
									break;
									case "NIL";
									return_value['year_of_issue']="1996";
									break;
									case "NIW";
									return_value['year_of_issue']="1992";
									break;
									case "NJI";
									return_value['year_of_issue']="1990";
									break;
									case "NUI";
									return_value['year_of_issue']="2003";
									break;
									case "NXI";
									return_value['year_of_issue']="1988";
									break;
									case "NZ";
									return_value['year_of_issue']="1949";
									break;
								}
							}
	
							else if (primeindex=="O")
							{
								switch (return_value['suffix'])
								{
									case "OBZ";
									return_value['year_of_issue']="1995";
									break;
									case "OCZ";
									return_value['year_of_issue']="2002";
									break;
									case "ODZ";
									return_value['year_of_issue']="1993";
									break;
									case "OI";
									return_value['year_of_issue']="1958";
									break;
									case "OIA";
									return_value['year_of_issue']="1979";
									break;
									case "OIB";
									return_value['year_of_issue']="1990";
									break;
									case "OIL";
									return_value['year_of_issue']="1997";
									break;
									case "OIW";
									return_value['year_of_issue']="1993";
									break;
									case "OJI";
									return_value['year_of_issue']="1991";
									break;
									case "OU";
									return_value['year_of_issue']="1981";
									break;
									case "OXI";
									return_value['year_of_issue']="1989";
									break;
									case "OZ";
									return_value['year_of_issue']="1950";
									break;
								}
							}
	
							else if (primeindex=="P")
							{
								switch (return_value['suffix'])
								{
									case "PBZ";
									return_value['year_of_issue']="1996";
									break;
									case "PCZ";
									return_value['year_of_issue']="2002";
									break;
									case "PDZ";
									return_value['year_of_issue']="1993";
									break;
									case "PIA";
									return_value['year_of_issue']="1979";
									break;
									case "PIB";
									return_value['year_of_issue']="1991";
									break;
									case "PIJ";
									return_value['year_of_issue']="1982";
									break;
									case "PIL";
									return_value['year_of_issue']="1998";
									break;
									case "PIW";
									return_value['year_of_issue']="1994";
									break;
									case "PJI";
									return_value['year_of_issue']="1992";
									break;
									case "POI";
									return_value['year_of_issue']="1977";
									break;
									case "PXI";
									return_value['year_of_issue']="1989";
									break;
									case "PZ";
									return_value['year_of_issue']="1953";
									break;
								}
							}
	
							else if (primeindex=="R")
							{
								switch (return_value['suffix'])
								{
									case "RBZ";
									return_value['year_of_issue']="1997";
									break;
									case "RCZ";
									return_value['year_of_issue']="2002";
									break;
									case "RDZ";
									return_value['year_of_issue']="1994";
									break;
									case "RIA";
									return_value['year_of_issue']="1980";
									break;
									case "RIB";
									return_value['year_of_issue']="1991";
									break;
									case "RIJ";
									return_value['year_of_issue']="1982";
									break;
									case "RIL";
									return_value['year_of_issue']="1998";
									break;
									case "RIW";
									return_value['year_of_issue']="1995";
									break;
									case "RJI";
									return_value['year_of_issue']="1993";
									break;
									case "ROI";
									return_value['year_of_issue']="1978";
									break;
									case "RXI";
									return_value['year_of_issue']="1989";
									break;
									case "RZ";
									return_value['year_of_issue']="1954";
									break;
								}
							}
	
							else if (primeindex=="S")
							{
								switch (return_value['suffix'])
								{
									case "SBZ";
									return_value['year_of_issue']="1997";
									break;
									case "SCZ";
									return_value['year_of_issue']="2003";
									break;
									case "SDZ";
									return_value['year_of_issue']="1994";
									break;
									case "SIA";
									return_value['year_of_issue']="1981";
									break;
									case "SIB";
									return_value['year_of_issue']="1992";
									break;
									case "SIJ";
									return_value['year_of_issue']="1983";
									break;
									case "SIL";
									return_value['year_of_issue']="1999";
									break;
									case "SIW";
									return_value['year_of_issue']="1995";
									break;
									case "SJI";
									return_value['year_of_issue']="1994";
									break;
									case "SOI";
									return_value['year_of_issue']="1978";
									break;
									case "SXI";
									return_value['year_of_issue']="1990";
									break;
									case "SZ";
									return_value['year_of_issue']="1954";
									break;
								}
							}
	
							else if (primeindex=="T")
							{
								switch (return_value['suffix'])
								{
									case "TBZ";
									return_value['year_of_issue']="1998";
									break;
									case "TCZ";
									return_value['year_of_issue']="2003";
									break;
									case "TDZ";
									return_value['year_of_issue']="1995";
									break;
									case "TIA";
									return_value['year_of_issue']="1982";
									break;
									case "TIB";
									return_value['year_of_issue']="1992";
									break;
									case "TIJ";
									return_value['year_of_issue']="1984";
									break;
									case "TIL";
									return_value['year_of_issue']="2000";
									break;
									case "TIW";
									return_value['year_of_issue']="1996";
									break;
									case "TJI";
									return_value['year_of_issue']="1994";
									break;
									case "TOI";
									return_value['year_of_issue']="1979";
									break;
									case "TXI";
									return_value['year_of_issue']="1990";
									break;
									case "TZ";
									return_value['year_of_issue']="1954";
									break;
								}
							}
	
							else if (primeindex=="U")
							{
								switch (return_value['suffix'])
								{
									case "UBZ";
									return_value['year_of_issue']="1998";
									break;
									case "UCZ";
									return_value['year_of_issue']="2003";
									break;
									case "UDZ";
									return_value['year_of_issue']="1995";
									break;
									case "UI";
									return_value['year_of_issue']="1932";
									break;
									case "UIA";
									return_value['year_of_issue']="1982";
									break;
									case "UIB";
									return_value['year_of_issue']="1993";
									break;
									case "UIJ";
									return_value['year_of_issue']="1984";
									break;
									case "UIL";
									return_value['year_of_issue']="2001";
									break;
									case "UIW";
									return_value['year_of_issue']="1997";
									break;
									case "UJI";
									return_value['year_of_issue']="1995";
									break;
									case "UOI";
									return_value['year_of_issue']="1979";
									break;
									case "UXI";
									return_value['year_of_issue']="1991";
									break;
									case "UZ";
									return_value['year_of_issue']="1955";
									break;
								}
							}
	
							else if (primeindex=="V")
							{
								switch (return_value['suffix'])
								{
									case "VBZ";
									return_value['year_of_issue']="1998";
									break;
									case "VDZ";
									return_value['year_of_issue']="1996";
									break;
									case "VIA";
									return_value['year_of_issue']="1983";
									break;
									case "VIB";
									return_value['year_of_issue']="1994";
									break;
									case "VIJ";
									return_value['year_of_issue']="1985";
									break;
									case "VIL";
									return_value['year_of_issue']="2002";
									break;
									case "VIW";
									return_value['year_of_issue']="1997";
									break;
									case "VJI";
									return_value['year_of_issue']="1996";
									break;
									case "VOI";
									return_value['year_of_issue']="1980";
									break;
									case "VXI";
									return_value['year_of_issue']="1991";
									break;
									case "VZ";
									return_value['year_of_issue']="1956";
									break;
								}
							}
	
							else if (primeindex=="W")
							{
								switch (return_value['suffix'])
								{
									case "WBZ";
									return_value['year_of_issue']="1999";
									break;
									case "WDZ";
									return_value['year_of_issue']="1996";
									break;
									case "WIA";
									return_value['year_of_issue']="1984";
									break;
									case "WIB";
									return_value['year_of_issue']="1994";
									break;
									case "WIJ";
									return_value['year_of_issue']="1985";
									break;
									case "WIL";
									return_value['year_of_issue']="2002";
									break;
									case "WIW";
									return_value['year_of_issue']="1998";
									break;
									case "WJI";
									return_value['year_of_issue']="1997";
									break;
									case "WOI";
									return_value['year_of_issue']="1980";
									break;
									case "WXI";
									return_value['year_of_issue']="1991";
									break;
									case "WZ";
									return_value['year_of_issue']="1957";
									break;
								}
							}
	
							else if (primeindex=="X")
							{
								switch (return_value['suffix'])
								{
									case "XAZ";
									return_value['year_of_issue']="1998";
									break;
									case "XBZ";
									return_value['year_of_issue']="1999";
									break;
									case "XDZ";
									return_value['year_of_issue']="1997";
									break;
									case "XI";
									return_value['year_of_issue']="1922";
									break;
									case "XIB";
									return_value['year_of_issue']="1995";
									break;
									case "XIJ";
									return_value['year_of_issue']="1986";
									break;
									case "XIL";
									return_value['year_of_issue']="2003";
									break;
									case "XIW";
									return_value['year_of_issue']="1999";
									break;
									case "XJI";
									return_value['year_of_issue']="1998";
									break;
									case "XOI";
									return_value['year_of_issue']="1981";
									break;
									case "XXI";
									return_value['year_of_issue']="1992";
									break;
									case "XZ";
									return_value['year_of_issue']="1957";
									break;
								}
							}
	
							else if (primeindex=="Y")
							{
								switch (return_value['suffix'])
								{
									case "YBZ";
									return_value['year_of_issue']="2000";
									break;
									case "YDZ";
									return_value['year_of_issue']="1997";
									break;
									case "YIA";
									return_value['year_of_issue']="1985";
									break;
									case "YIB";
									return_value['year_of_issue']="1996";
									break;
									case "YIJ";
									return_value['year_of_issue']="1986";
									break;
									case "YIW";
									return_value['year_of_issue']="1999";
									break;
									case "YJI";
									return_value['year_of_issue']="1999";
									break;
									case "YOI";
									return_value['year_of_issue']="1981";
									break;
									case "YXI";
									return_value['year_of_issue']="1992";
									break;
									case "YZ";
									return_value['year_of_issue']="1957";
									break;
								}
							}
							
						}
	
						else {
						
							// Digits THEN Characters (DT)
	
							switch (return_value['suffix'])
							{
								case "AZ";
								return_value['year_of_issue']="1960";
								break;
								case "BZ";
								return_value['year_of_issue']="1961";
								break;
								case "CZ";
								return_value['year_of_issue']="1961";
								break;
								case "DZ";
								return_value['year_of_issue']="1960";
								break;
								case "EZ";
								return_value['year_of_issue']="1962";
								break;
								case "FZ";
								return_value['year_of_issue']="1963";
								break;
								case "GZ";
								return_value['year_of_issue']="1964";
								break;
								case "IA";
								return_value['year_of_issue']="1958";
								break;
								case "IB";
								return_value['year_of_issue']="1962";
								break;
								case "IJ";
								return_value['year_of_issue']="1958";
								break;
								case "IL";
								return_value['year_of_issue']="1958";
								break;
								case "IW";
								return_value['year_of_issue']="1962";
								break;
								case "JI";
								return_value['year_of_issue']="1961";
								break;
								case "JZ";
								return_value['year_of_issue']="1963";
								break;
								case "KZ";
								return_value['year_of_issue']="1962";
								break;
								case "LZ";
								return_value['year_of_issue']="1965";
								break;
								case "MZ";
								return_value['year_of_issue']="1947";
								break;
								case "NBZ";
								return_value['year_of_issue']="1995";
								break;
								case "NZ";
								return_value['year_of_issue']="1966";
								break;
								case "OAZ";
								return_value['year_of_issue']="1996";
								break;
								case "OI";
								return_value['year_of_issue']="1905";
								break;
								case "OZ";
								return_value['year_of_issue']="1965";
								break;
								case "PAZ";
								return_value['year_of_issue']="1997";
								break;
								case "PZ";
								return_value['year_of_issue']="1966";
								break;
								case "RAZ";
								return_value['year_of_issue']="1997";
								break;
								case "RZ";
								return_value['year_of_issue']="1964";
								break;
								case "SAZ";
								return_value['year_of_issue']="1997";
								break;
								case "SZ";
								return_value['year_of_issue']="1965";
								break;
								case "TAZ";
								return_value['year_of_issue']="1997";
								break;
								case "TZ";
								return_value['year_of_issue']="1967";
								break;
								case "UAZ";
								return_value['year_of_issue']="1998";
								break;
								case "UI";
								return_value['year_of_issue']="1963";
								break;
								case "UZ";
								return_value['year_of_issue']="1967";
								break;
								case "VAZ";
								return_value['year_of_issue']="1998";
								break;
								case "VZ";
								return_value['year_of_issue']="1968";
								break;
								case "WAZ";
								return_value['year_of_issue']="1998";
								break;
								case "WZ";
								return_value['year_of_issue']="1968";
								break;
								case "XI";
								return_value['year_of_issue']="1958";
								break;
								case "XIA";
								return_value['year_of_issue']="1984";
								break;
								case "XZ";
								return_value['year_of_issue']="1969";
								break;
								case "YAZ";
								return_value['year_of_issue']="1998";
								break;
								case "YZ";
								return_value['year_of_issue']="1970";
								break;
							}
							
						}
						
					}
					*/
					
				}
			
			}
			
			//--------------------------------------------------------------------------------------------
			
			if(monthofissue && !return_value['error']) {

				if (return_value['plate_format']=="P1" || return_value['plate_format']=="P2" || return_value['plate_format']=="P3") {
					switch (return_value['prefix']) {
						case "A":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "B":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "C":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "D":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "E":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "F":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "G":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "H":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "J":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "K":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "L":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "M":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "N":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "P":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "R":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "S":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="03";
						break;
						case "T":
						return_value['month_of_issue']="03";
						return_value['month_of_issue_expiry']="09";
						break;
						case "V":
						return_value['month_of_issue']="09";
						return_value['month_of_issue_expiry']="03";
						break;
						case "W":
						return_value['month_of_issue']="03";
						return_value['month_of_issue_expiry']="09";
						break;
						case "X":
						return_value['month_of_issue']="09";
						return_value['month_of_issue_expiry']="03";
						break;
						case "Y":
						return_value['month_of_issue']="03";
						return_value['month_of_issue_expiry']="09";
						break;
					}
				}

				else if (return_value['plate_format']=="MILLENNIUM") {
					if (parseInt(return_value['number'])>50)
					{	
						return_value['month_of_issue']="09";	
						return_value['month_of_issue_expiry']="03";
					}
					else
					{	
						return_value['month_of_issue']="03";  
						return_value['month_of_issue_expiry']="09";
					}
				}

				else if (return_value['plate_format']=="S1" || return_value['plate_format']=="S2" || return_value['plate_format']=="S3") {
					switch (return_value['prefix']) {
						case "A":
						return_value['month_of_issue']="02";
						return_value['month_of_issue_expiry']="01";
						break;
						case "B":
						return_value['month_of_issue']="01";
						return_value['month_of_issue_expiry']="01";
						break;
						case "C":
						return_value['month_of_issue']="01";
						return_value['month_of_issue_expiry']="01";
						break;
						case "D":
						return_value['month_of_issue']="01";
						return_value['month_of_issue_expiry']="01";
						break;
						case "E":
						return_value['month_of_issue']="01";
						return_value['month_of_issue_expiry']="08";
						break;
						case "F":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "G":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "H":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "J":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "K":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "L":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "M":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "N":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "P":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "R":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "S":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "T":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "V":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "W":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "X":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
						case "Y":
						return_value['month_of_issue']="08";
						return_value['month_of_issue_expiry']="08";
						break;
					}
				}

			}
			
			//--------------------------------------------------------------------------------------------

		}
	
		//--------------------------------------------------------------------------------------------	
		
		else {
		
			// No known format!
			return_value['error']=1;
			
		}	
		
	}
	
	//------------------------------------------------------------------------------------------------	
	
	callback(return_value);
	
}

