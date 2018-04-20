import { LocalStorage } from 'node-localstorage';

export default (function () {
    var instance;

    if (instance) {
        console.log('call to store');
        return instance;
    } else {
        console.log('create stor')
        instance = {};
        instance.set = (key, value) => instance.store.setItem(key, JSON.stringify(value));
        instance.get = key => JSON.parse(instance.store.getItem(key));
        instance.store = new LocalStorage('./scratch');
        return instance;
    }
}());
