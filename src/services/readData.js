const baseURL = 'https://celtic-bromance-url.herokuapp.com/'

export default class ReadData {

    async getTunnelUrl() {
        const fecthedData = await fetch(baseURL + 'get_url')
        .then(res => {
            return res.json()
        })
        .then((data) => {
            if (data.error) return data.error
            else return data.url
        })
        return fecthedData
    }
    async getLocalApi(parameter) {
        let url = await this.getTunnelUrl()
        console.log(url)
        if(url !== "no url found"){
            const fecthedData = await fetch(url + parameter)
            .then(res => {
                return res.json()
            })
            .then((data) => {
                return data
            }).catch(error => {
                console.log('There has been a problem with your fetch operation:', error);
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