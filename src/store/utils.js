import _ from 'lodash';

const cloneObject = (obj) => {
    return _.cloneDeep(obj);
}

export {
    cloneObject
}
