
/*
In this lab, we're going to build a time card and payroll application using the record-oriented approach. 
When someone enters the company's state of the art technical office, the employee has to insert their card in a 
time clock which will record the time they came in. When it's time to leave, the employee will "punch out."

For simplicity's sake, we'll make these assumptions:

Employees always check in and check out.
Employees always check in and out on the hour.
The time is represented on a 24-hour clock (1300 is 1:00 pm); this keeps the math easier and is the standard in most of the world.
When timestamps are needed, they will be provided as Strings in the form: "YYYY-MM-DD 800" or "YYYY-MM-DD 1800" e.g. "2018-01-01 2300".
Employees will never work across days, e.g., in at 2200 and out at 0400 the next day.

*/

let testTimeIn = '2021-11-12 0900';
let testTimeOut = '2021-11-12 1700';

let testRecord = {
    firstName: "Christy", 
    familyName: "P", 
    title: "boss", 
    payPerHour: 500,
    timeInEvents: [{
        type:"TimeIn",
        hour: 900,
        date: '2021-11-01',
        },
        {
        type:"TimeIn" ,
        hour: 1400,
        date: '2021-11-01',
        },
        {
        type:"TimeIn" ,
        hour: 900,
        date: '2021-11-02',
        }],
    timeOutEvents: [{
        type: "TimeOut",
        hour: 1200,
        date: '2021-11-01',
        },
        {
        type: "TimeOut",
        hour: 1700,
        date: '2021-11-01',
        },
        {
        type:"TimeOut" ,
        hour: 1800,
        date: '2021-11-02',
        }],
}

let testRecord2 = {
    firstName: "Newbie", 
    familyName: "x", 
    title: "assistant", 
    payPerHour: 10,
    timeInEvents: [{
        type:"TimeIn",
        hour: 900,
        date: '2021-11-01',
        }],
    timeOutEvents: [{
        type: "TimeOut",
        hour: 1200,
        date: '2021-11-01',
        }],
}

function createEmployeeRecord(array) {
    //convert array of an employee record into an object 
    let recordObj = {
        firstName: array[0], 
        familyName: array[1], 
        title: array[2], 
        payPerHour: array[3],
        timeInEvents: [],
        timeOutEvents: [],
    }
    return recordObj;     
};

function createEmployeeRecords(array){
    return array.map( nestedArray => createEmployeeRecord(nestedArray) ); 
};

function createTimeInEvent(record, dateStamp){
    let obj= {
        type: "TimeIn",
        hour: parseInt(dateStamp.split(" ")[1]),
        date: dateStamp.split(" ")[0],
    }
    record.timeInEvents.push(obj);
    return record; 
};

function createTimeOutEvent(record, dateStamp){
    let obj= {
        type: "TimeOut",
        hour: parseInt(dateStamp.split(" ")[1]),
        date: dateStamp.split(" ")[0],
    }
    record.timeOutEvents.push(obj);
    return record; 
};

function hoursWorkedOnDate (recordObj, dateStr){
    let thisDayTimeIn = recordObj.timeInEvents.filter(inObj => inObj.date == dateStr);
    let thisDayTimeOut = recordObj.timeOutEvents.filter(outObj => outObj.date == dateStr);

    //not sure how to use array methods on two arrays at once so here's an old-school loop 
    let hoursByShift = []
    for (let i=0; i<thisDayTimeIn.length; i++){
        let difference = (thisDayTimeOut[i].hour - thisDayTimeIn[i].hour);
        hoursByShift.push(difference);
    }
    
    let reducer = (x, y) => (x + y); 
    let hoursWorked = hoursByShift.reduce(reducer);
    return hoursWorked/100; 
};

function wagesEarnedOnDate(recordObj, dateStr){
    return recordObj.payPerHour * hoursWorkedOnDate(recordObj, dateStr);
};

function allWagesFor(recordObj){
    let datesWorked = recordObj.timeInEvents.map( obj => obj.date);
    datesWorked = [...new Set(datesWorked)]; //remove duplicates 
    let wagesArray = datesWorked.map( date => wagesEarnedOnDate(recordObj, date) )
    let reducer = (x,y) => x + y; 
    let sum = wagesArray.reduce(reducer);
    return sum;
};

function calculatePayroll(empRecordsArray){
    let allWagesArray = empRecordsArray.map( record => allWagesFor(record));
    let reducer = (x,y) => x+y; 
    let sum = allWagesArray.reduce(reducer); 
    return sum; 
};

//MY TESTS 

let testEmp1 = ['bob', 'smith', 'sales', 15]; 
let testEmp2 = ['sally', 'sanders', 'manager', 20]

console.log('expect an array with two objects of employee info:')
console.log(createEmployeeRecords([testEmp1, testEmp2]))

console.log("testing hoursWorkedOnDate. Expecting 6 hrs on Nov 1 and 9 on Nov 2")
console.log('Nov 1: ' + hoursWorkedOnDate(testRecord, '2021-11-01' ));
console.log('Nov 2: ' + hoursWorkedOnDate(testRecord, '2021-11-02' ))
console.log('Testing wagesEarnedOnDate, expect 3000 for Nov 1: ')
console.log(wagesEarnedOnDate(testRecord, '2021-11-01'))
console.log('Testing wagesEarnedOnDate, expect 4500 for Nov 2: ')
console.log(wagesEarnedOnDate(testRecord, '2021-11-02'))
console.log('testing allWagesFor, expect 7500:')
console.log(allWagesFor(testRecord));
console.log("testing all payroll, expect 7530: ")
console.log(calculatePayroll([testRecord, testRecord2]))


//When I run my own tests with a console log, the ansers are coming out e.g. 1200 instead of 12 (because that's how hours are formatted);
//But when I run the Learn tests, the numbers are right (without having to divide by 100)?