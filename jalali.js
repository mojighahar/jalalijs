var Jalali = function(year, month, day, hour, minute, second){
	this._year = new Number(year);
	this._month = new Number(month);
	this._day = new Number(day);
	this._hour = new Number(hour);
	this._minute = new Number(minute);
	this._second = new Number(second);
	if(!this.isValid())
		throw 'invalid arguments';
};

Jalali.prototype = {
	set year(value){
		this._year = new Number(value);
	},
	get year(){
		return this._year;
	},
	set month(value){
		this._month = new Number(value);
	},
	get month(){
		return this._month;
	},
	set day(value){
		this._day = new Number(value);
	},
	get day(){
		return this._day;
	},
	set hour(value){
		this._hour = new Number(value);
	},
	get hour(){
		return this._hour;
	},
	set minute(value){
		this._minute = new Number(value);
	},
	get minute(){
		return this._minute;
	},
	set second(value){
		this._second = new Number(value);
	},
	get second(){
		return this._second;
	}
};

Jalali.prototype.isValid = function() {
	if(!this.month.isBetween(1,12) ||
	   !this.hour.isBetween(0,23) ||
	   !this.minute.isBetween(0,59) ||
	   !this.second.isBetween(0,59))
		return false;
	if(this.month < 7){
		if(!this.day.isBetween(1,31))
			return false;
	}else{
		if(!this.day.isBetween(1,30))
			return false;
	}
	if(!this.isLeap() && this.month == 12 && this.day == 30)
		return false; 
	return true;
};

Jalali.prototype.isLeap = function() {
	return (((this.year + 1) % 4) == 0);
};

Jalali.now = function(){
	var current = new Date();
	var jDate = Jalali.garegorianToJalali(
		current.getFullYear(),
		current.getMonth() + 1,
		current.getDate()
		);
	return new Jalali(
		jDate.year,
		jDate.month,
		jDate.day,
		current.getHours(),
		current.getMinutes(),
		current.getSeconds()
		);
};

Jalali.today = function(){
	var current = new Date();
	var jDate = Jalali.garegorianToJalali(
		current.getFullYear(),
		current.getMonth() + 1,
		current.getDate()
		);
	return new Jalali(
		jDate.year,
		jDate.month,
		jDate.day,
		0,
		0,
		0
		);
};

Jalali.prototype.clone = function () {
	return new Jalali(
		this.year,
		this.month,
		this.day,
		this.hour,
		this.minute,
		this.second
		);
}

Jalali.prototype.monthDays = function() {
	if(this.month == 12)
		return (this.isLeap())? 30 : 29;
	return (this.month < 7)? 31 : 30;
};

Jalali.prototype.monthStartDay = function(){
	var monthStart = new Jalali(
		this.year,
		this.month,
		1,
		this.hour,
		this.minute,
		this.second
		);
	var day = monthStart.toDate().getDay();
	day++;
	return (day > 6)? 7 - day : day;
};

Jalali.prototype.toDate = function(){
	var garegorian = Jalali.jalaliToGregorian(
		this.year,
		this.month,
		this.day
		);
	return new Date(
		garegorian.year,
		garegorian.month - 1,
		garegorian.day,
		this.hour,
		this.minute,
		this.second
		);
};

Jalali.parseDate = function(input){
	var pattern = /\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)\s*/g;
	var parts = pattern.exec(input);

	if(parts == null)
		throw 'Invalid input';

	return new Jalali(
		parts[1],
		parts[2],
		parts[3],
		0,
		0,
		0
		);
};

Jalali.parseTime = function(input){
	var pattern = /\s*(\d+)\s*:\s*(\d+)\s*:\s*(\d+)\s*/g;
	var parts = pattern.exec(input);

	if(parts == null)
		throw 'Invalid input';

	var date = Jalali.now();
	
	return new Jalali(
		date.year,
		date.month,
		date.day,
		parts[1],
		parts[2],
		parts[3]
		);
};

Jalali.parseDateTime = function(input){
	var pattern = /\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)\s*(\d+)\s*:\s*(\d+)\s*:\s*(\d+)\s*/g;
	var parts = pattern.exec(input);

	if(parts == null)
		throw 'Invalid input';

	return new Jalali(
		parts[1],
		parts[2],
		parts[3],
		parts[4],
		parts[5],
		parts[6]
		);
};

Jalali.prototype.toString = function (){
	return `${this.year}/${this.month}/${this.day} ${this.hour}:${this.minute}:${this.second}`;
};

Jalali.prototype.getMonthName = function(){
	switch(true){
		case this.month == 1:
			return 'فروردین';
		case this.month == 2:
			return 'اردیبهشت';
		case this.month == 3:
			return 'خرداد';
		case this.month == 4:
			return 'تیر';
		case this.month == 5:
			return 'مرداد';
		case this.month == 6:
			return 'شهریور';
		case this.month == 7:
			return 'مهر';
		case this.month == 8:
			return 'آبان';
		case this.month == 9:
			return 'آذر';
		case this.month == 10:
			return 'دی';
		case this.month == 11:
			return 'بهمن';
		case this.month == 12:
			return 'اسفند';
	}
};

Jalali.prototype.previousMonth = function(){
	var newJalali = this.clone();
	if(newJalali.month == 1){
		newJalali.month = 12;
		newJalali.year--;
		if(newJalali.day == 31 || newJalali.day == 30)
			newJalali.day = (newJalali.isLeap())? 30 : 29;
	}else{
		newJalali.month--;
	}
	return newJalali;
};

Jalali.prototype.nextMonth = function(){
	var newJalali = this.clone();
	if(newJalali.month == 12){
		newJalali.month = 1;
		newJalali.year++;
	}else if(newJalali.month == 11 && newJalali.day == 30 && !newJalali.isLeap()){
		newJalali.day = 29;
		newJalali.month++;
	}else if(newJalali.month == 6 && newJalali.day == 31){
		newJalali.month++;
		newJalali.day = 30;
	}else{
		newJalali.month++;
	}
	return newJalali;
};

// Resource: https://jdf.scr.ir/
Jalali.garegorianToJalali = function(gy,gm,gd){
	g_d_m=[0,31,59,90,120,151,181,212,243,273,304,334];
	if(gy > 1600){
		jy=979;
		gy-=1600;
	}else{
		jy=0;
		gy-=621;
	}
	gy2=(gm > 2)?(gy+1):gy;
	days=(365*gy) +(parseInt((gy2+3)/4)) -(parseInt((gy2+99)/100)) +(parseInt((gy2+399)/400)) -80 +gd +g_d_m[gm-1];
	jy+=33*(parseInt(days/12053)); 
	days%=12053;
	jy+=4*(parseInt(days/1461));
	days%=1461;
	if(days > 365){
		jy+=parseInt((days-1)/365);
		days=(days-1)%365;
	}
	jm=(days < 186)?1+parseInt(days/31):7+parseInt((days-186)/30);
	jd=1+((days < 186)?(days%31):((days-186)%30));
	return {year: jy, month: jm, day: jd};
};

// Resource: https://jdf.scr.ir/
Jalali.jalaliToGregorian = function(jy,jm,jd){
	if(jy > 979){
		gy=1600;
		jy-=979;
	}else{
		gy=621;
	}
	days=(365*jy) +((parseInt(jy/33))*8) +(parseInt(((jy%33)+3)/4)) +78 +jd +((jm<7)?(jm-1)*31:((jm-7)*30)+186);
	gy+=400*(parseInt(days/146097));
	days%=146097;
	if(days > 36524){
		gy+=100*(parseInt(--days/36524));
		days%=36524;
		if(days >= 365)days++;
	}
	gy+=4*(parseInt(days/1461));
	days%=1461;
	if(days > 365){
		gy+=parseInt((days-1)/365);
		days=(days-1)%365;
	}
	gd=days+1;
	sal_a=[0,31,((gy%4==0 && gy%100!=0) || (gy%400==0))?29:28,31,30,31,30,31,31,30,31,30,31];
	for(gm=0;gm<13;gm++){
		v=sal_a[gm];
		if(gd <= v)break;
		gd-=v;
	}
	return {year: gy, month: gm, day: gd}; 
};

Number.prototype.isBetween = function(min, max){
	if(this < min || this >  max)
		return false;
	return true;
};

Number.prototype.toPersian = function(){
	var english = this.toString();
	var persian = '';
	for(var i = 0; i < english.length; i++)
		persian += String.fromCharCode(english.charCodeAt(i) + 1728);
	return persian;
};

String.prototype.toEnglish = function(){
	var english = '';
	for(var i = 0; i < this.length; i++)
		english += String.fromCharCode(this.charCodeAt(i) - 1728);
	return english;
};
