(function Settings(p){

    var config = require('electron-config');

    var settings = new config();

    var path = p;

    var set = function(key, value){
        console.log((path+"."+key));
        if(path) settings.set((path+"."+key),value);
        else settings.set(key,value);
    }

    var get = function(key){
        console.log(path+"."+key);
        if(path) return settings.get((path+"."+key));
        else return null;
    }

    var erase = function(key){
        if(path) settings.delete((path+"."+key));
        else settings.delete(key);
    }

    var has = function(key){
        if(path) settings.has((path+"."+key));
        else settings.has(key);
    }

    var setPath = function(p){
        path = p;
    }

    module.exports = Settings;

    return{
        set: set,
        get: get,
        erase: erase,
        has: has,
        setPath: setPath,
    }
})()

