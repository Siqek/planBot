const NTP = require('ntp-time').Client;

module.exports = class NtpTime
{
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
            .catch();
    }

    getTime()
    {
        return this.time;
    }

    minutes()
    {
        return (new Date(this.time).getMinutes());
    }

    hours()
    {
        return (new Date(this.time).getHours());
    }

    day()
    {
        return (new Date(this.time).getDay());
    }
}