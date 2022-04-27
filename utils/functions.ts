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

export function setCookie(name:string, value:string, expire:any) {
    let expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + expire);
    document.cookie = name + "=" + escape(value) + "; expires=" + expireDate.toUTCString() + "; path=/";
}

export function readCookie(name:string) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

export function arrayMove(arr:any[], fromIndex:number, toIndex:number) {
    let element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    return arr;
}

export function addThousandSep(num:number|string) {
    return new Intl.NumberFormat().format(num as number);
}

export function hasUpper(str:string) {
    return /[A-Z]/g.test(str);
}

export function hasLower(str:string) {
    return (/[a-z]/g.test(str));
}