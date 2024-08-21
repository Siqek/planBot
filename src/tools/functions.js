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
    }
}