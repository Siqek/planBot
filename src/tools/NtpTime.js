const NTP = require('ntp-time').Client;

module.exports = class NtpTime
{
    time = null;
    clientNTP = null;

    constructor() 
    {
        this.clientNTP = new NTP('time.google.com', 123, { timeout: 5000 });
        this.update();
    }

    async update()
    {
        await this.clientNTP
            .syncTime()
            .then(res => {
                this.time = new Date(res.time).toLocaleString("en-US", { timeZone: "Poland" });
            })
            .catch(console.log);
    }

    getTime()
    {
        return this.time;
    }

    minutes()
    {
        return (new Date(this.getTime()).getMinutes());
    }

    hours()
    {
        return (new Date(this.getTime()).getHours());
    }

    day()
    {
        return (new Date(this.getTime()).getDay());
    }
}