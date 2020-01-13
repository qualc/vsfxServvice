declare interface UsersOption {
    email?: string;
    phone?: number;
}
export const formatBusinessMap = exports.formatBusinessMap = (arr) => {
    let citys = <any>{},
        resultsCitys = <Array<any>>[];
    arr.forEach(item => {
        let cityItem = citys[item.city];
        // 不存在
        if (!cityItem) {
            cityItem = {};
            cityItem.city = item.cityName;
            cityItem.deptList = [item];
            citys[item.city] = cityItem;
        } else {
            cityItem.deptList.push(item);
        }
    });
    for (let key in citys) {
        resultsCitys.push(citys[key]);
    }
    return resultsCitys;
}

/**
 * 得先排序 按parent升序
 */
export const formatMenuMap = exports.formatMenuMap = (arr: Array<any>) => {
    if (!arr) return [];
    arr = arr.reverse();
    // 所有非最低子集对象
    let obj = {},
        // 返回对象
        rResult = <Array<any>>[];

    for (let item of arr) {
        let pid = item.parentId;
        if (pid != 0) {
            let temp = <Array<any>>[];
            if (!obj[pid]) {
                let fObj = obj[pid] = <any>{};
                temp = fObj.children = [];
            } else {
                Object.assign(item, obj[item.id])
                temp = obj[pid].children;
            }
            temp.unshift(item);
        } else {
            if (!obj[item.id]) {
                obj[item.id] = {};
                obj[item.id].children = [];
            }
            Object.assign(obj[item.id], item)
            rResult.unshift(obj[item.id])
        }
    }
    return rResult;
}


export const formatInterfaceMap = exports.formatInterfaceMap = (arr) => {
    if (!arr || arr.length == 0) return [];
    // 所有非最低子集对象
    let obj = {},
        results: any = [];

    for (let item of arr) {
        let temp = obj[item.interfaceType];
        if (!temp) {
            temp = obj[item.interfaceType] = [];
        }
        temp.push(item);
    }
    let index = 0;
    for (let key in obj) {
        let itemObj: any = {},
            item = obj[key];
        itemObj.key = key;
        itemObj.index = ++index;
        itemObj.length = item.length;
        itemObj.children = item;
        results.push(itemObj);
    }
    return results;
}

export default {
    formatBusinessMap,
    formatMenuMap,
    formatInterfaceMap

}