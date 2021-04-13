import config from '../config'

const API_HOST = config.api.host

export const fetchRequest = (url) => {
    return fetch(API_HOST + '/' + url)
}

export const get7moorConfig = (api_key, custom_key, exten) => {
    return fetchRequest('index.php?r=webcall/api/get-moor7-config&api_key=' + api_key + '&custom_key=' + custom_key + '&exten=' + exten)
}