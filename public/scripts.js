var main = document.getElementById('main');
//var wraper = document.getElementById('wraper');

// calculating the current day from when started Thillim.
const productionDate = new Date(2018,11,1);
const currentDate = new Date()

const oneDay = 24*60*60*1000;
const diffDays =  Math.round(Math.abs( (productionDate.getTime() - currentDate.getTime() ) / (oneDay) ) );

//todays chapter
const chapter = diffDays % 150;

$("#main").load("sefertehillim.html #"+chapter+"");
//trying to link to chapter 7 ??
/*const iframe = document.createElement('iframe');
iframe.src = `thillim/${chapter}.html#as`;
iframe.id = "myHtml";
main.appendChild(iframe);*/
