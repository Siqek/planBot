// const Time = require('./Time');

module.exports = {
    prepareUrl: function (url, pathName, params = {}) 
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
    getLessonNumber: function (time)
    {
        console.log("used getLessonNumber!!!");

        const currentTimeInMinutes = (time.hours() * 60) + time.minutes();

        const timeTable = require('../resources/timeTable.json');

        if (currentTimeInMinutes < 8) return 1; //return as it would be the first lesson


        for (const [index, lesson] of timeTable.entries()) {
            let lessonStartInMinutes = (lesson.startH * 60) + lesson.startM;
            let lessonEndInMinutes = (lesson.endH * 60) + lesson.endM;

            if (currentTimeInMinutes < lessonStartInMinutes)
                return index + 1; //if there is a break, return the index of the next lesson

            if (currentTimeInMinutes >= lessonStartInMinutes && currentTimeInMinutes < lessonEndInMinutes)
                return index + 1;  //return the number of the current lesson
        }

        return -1; //if there are no more lessons, return -1
    }
}