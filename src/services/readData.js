

const baseURL = 'https://api.jsonbin.io/v3/b/64aede3d9d312622a37e69ee/4'
const JsonRemoteServerUrl = 'https://api.jsonbin.io/v3/b/'
const ENTRYLIST_BIN = '64cbd4279d312622a38b4575'
// const baseHeaders = {
//     "X-MASTER-KEY": process.env.REACT_APP_X-MASTER-KEY
// }

export default class ReadData {
    
    async getTunnelUrl() {
        const fecthedData = await fetch(baseURL)
        .then(res => {
            return res.json()
        })
        .then((data) => {
            if (data.error){
                console.log('There has been a problem with your url operation:', data.error);
                return data.error
            } 
            else {
                localStorage.setItem('tunnelUrl', data.record.tunnel_url);
                return data.record.tunnel_url
            }
        })
        return fecthedData
        
    }
    async getLocalApi(parameter) {
        let tunnelUrl = localStorage.getItem('tunnelUrl')
        let url = 'no url found'
        if(tunnelUrl !== '')url = tunnelUrl
        else url = await this.getTunnelUrl()
        if(url !== "no url found"){
            const fecthedData = await fetch(url + parameter)
            .then(res => {
                return res.json()
            })
            .then((data) => {
                return data
            }).catch(error => {
                console.log('There has been a problem with your url operation:', error);
                //Maybe the backend url has changed
                this.getTunnelUrl()
                return false
            })
            return fecthedData
        } else return false
    }
    async postLocalApi(parameter, body) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        let tunnelUrl = localStorage.getItem('tunnelUrl')
        let url = 'no url found'
        if(tunnelUrl !== '')url = tunnelUrl
        else url = await this.getTunnelUrl()
        if(url !== "no url found"){
            const fecthedData = await fetch(url + parameter, requestOptions)
            .then(res => {
                return res.json()
            })
            .then((data) => {
                return data
            }).catch(error => {
                console.log('There has been a problem with your url operation:', error);
                //Maybe the backend url has changed
                this.getTunnelUrl()
                return false
            })
            return fecthedData
        } else return false
    }
    async fetchDrivers() {

        const fecthedData = await fetch(JsonRemoteServerUrl + ENTRYLIST_BIN)
        .then(res => {
            console.log(res)
            return res.json()
        })
        .then((data) => {
            console.log(data)
            return data
        }).catch(error => {
            console.log('There has been a problem with your url operation:', error);
            return false
        })
        return fecthedData
    }
}