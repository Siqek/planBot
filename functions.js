// const NtpTime = require('./NtpTime');

module.exports = {
    prepareUrl: function (url, pathName,  params = {}) 
    {
        let _url = new URL(`${url}${pathName}`);
    
        for (let i in params)
        {
            _url.searchParams.append(i, params[i]);
        }
    
        return _url.href;
    },
    fetchData: async function (url) 
    {
        const response = await fetch(url);
        const data = await response.json();
        
        return data;
    },
    whichLesson: function (ntpTime)
    {
        const hours = ntpTime.hours() + (ntpTime.minutes() / 60);

        const timeTable = require('./resouces/timeTable.json');

        if (hours < 8) return 1; //return as it would be the first lesson


        for (const [index, lesson] of timeTable.entries()) {
            let start = lesson.startH + (lesson.startM / 60);
            let end = lesson.endH + (lesson.endM / 60);

            if (hours < start) return index + 1; //if there is a break, return the index of the next lesson

            if (hours >= start && hours < end) return index + 1;  //return the number of the current lesson
        }

        return -1; //if there are no more lessons, return -1
    }
}