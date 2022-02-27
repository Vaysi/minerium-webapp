export const Hashrate = (hash:number) => {
    return hash > 1000 ? `${hash} PH/s` : `${hash} TH/s`;
}

export const dynamicSort = (property:any) => {
    let sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a:any,b:any) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

export function capitalizeFirstLetter(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function hasJsonStructure(str:any) {
    if (typeof str !== 'string') return false;
    try {
        const result = JSON.parse(str);
        const type = Object.prototype.toString.call(result);
        return type === '[object Object]'
            || type === '[object Array]';
    } catch (err) {
        return false;
    }
}

export function humanize(x:number, fixed=8) {
    return x && x.toFixed(fixed).replace(/\.?0*$/, "");
}

export function msToHMS( ms:number ) {
    let seconds = ms / 1000;
    seconds = seconds % 3600;
    const minutes = seconds / 60;
    seconds = seconds % 60;
    return minutes.toFixed(0)+":"+seconds.toFixed(0);
}

export function sumUp(string:string,length:number) {
    return string.substring(0,length) + ' ...';
}