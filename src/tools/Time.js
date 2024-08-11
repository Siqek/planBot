const NTP = require('ntp-time').Client;

module.exports = class Time
{
    time = null;
    clientNTP = null;
    timeTable = require('../resources/timeTable.json');

    constructor () 
    {
        this.clientNTP = new NTP('time.google.com', 123, { timeout: 5000 });
        this.update();
    }

    async update ()
    {
        await this.clientNTP
            .syncTime()
            .then(res => {
                this.time = new Date(res.time).toLocaleString("en-US", { timeZone: "Poland" });
            })
            .catch(console.log);
    }

    getTime ()
    {
        return this.time;
    }

    minutes ()
    {
        return (new Date(this.getTime()).getMinutes());
    }

    hours ()
    {
        return (new Date(this.getTime()).getHours());
    }

    day ()
    {
        return (new Date(this.getTime()).getDay());
    }

    static formatMinutes (minutes) 
    {
        return `${'00'.slice(`${minutes}`.length)}${minutes}`;
    }

    getLessonNumber ()
    {
        // TODO (siqek)
        //
        // zmienić sposob zwracania danych na [numer lekcji; czy trwa przerwa]
        // lub to uproscic do jednego warunku
        // wystarczy porownac aktualny czas z czasem konca lekcji

        const currentTimeInMinutes = (this.hours() * 60) + this.minutes();

        if (currentTimeInMinutes < 8) return 1; //return as it would be the first lesson


        for (const [index, lesson] of this.timeTable.entries()) {
            let lessonStartInMinutes = (lesson.startH * 60) + lesson.startM;
            let lessonEndInMinutes = (lesson.endH * 60) + lesson.endM;

            //if (currentTimeInMinutes < lessonStartInMinutes)
            //    return index + 1; //if there is a break, return the index of the next lesson

            if (currentTimeInMinutes < lessonEndInMinutes)
                return index + 1;  //return the number of the current lesson
        }

        return -1; //if there are no more lessons, return -1
    }
}