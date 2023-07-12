const baseURL = 'https://api.jsonbin.io/v3/b/64aede3d9d312622a37e69ee/4'

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
            else return data.record.tunnel_url
        })
        return fecthedData
    }
    async getLocalApi(parameter) {
        let url = await this.getTunnelUrl()
        if(url !== "no url found"){
            const fecthedData = await fetch(url + parameter)
            .then(res => {
                return res.json()
            })
            .then((data) => {
                return data
            }).catch(error => {
                console.log('There has been a problem with your url operation:', error);
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
        let url = await this.getTunnelUrl()
        if(url !== "no url found"){
            const fecthedData = await fetch(url + parameter, requestOptions)
            .then(res => {
                return res.json()
            })
            .then((data) => {
                return data
            })
            return fecthedData
        } else return false
    }
}