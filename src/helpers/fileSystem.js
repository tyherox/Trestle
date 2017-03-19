/**
 * Created by JohnBae on 8/10/16.
 */

import fs from 'fs-jetpack';

var dev = process.cwd();

export default function(path){

    var dir = fs.cwd(dev);

    return({
        cwd: ()=> dir.cwd(),
        setDir: function(path){
            dir = fs.cwd(path);
        },
        save: function(path, data){
            let json = JSON.stringify(data, null, "\t");
            dir.write(path, json);
        },
        load: function(path){
            return dir.read(dir(path));
        },
        list: function(path){
            if(fs.exists(path)){
                return fs.list(path);
            }
            return undefined;
        }
    })
}
