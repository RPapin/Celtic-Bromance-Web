import React, { Component } from 'react';

const baseURL = 'https://api.jsonbin.io/v3/b/64aede3d9d312622a37e69ee/4'
const JsonRemoteServerUrl = 'https://api.jsonbin.io/v3/b/'
const ENTRYLIST_BIN = '64cbd4279d312622a38b4575'
const NEXT_ROUND_BIN = '/64ccb74f9d312622a38bad2d'
const PARAM_LIST_BIN = '64ccb85d9d312622a38badaf'
const CUSTOM_EVENT_BIN = '64ccb8d49d312622a38bade4'
const CHAMPIONSHIP_CONFIGURATION_BIN = '64ccb90a9d312622a38badfb'
const WEATHER_CONFIGURATION_BIN = '64ccb944b89b1e2299cb22be'


class ApiService extends Component {
    static baseHeaders = {
        'Content-Type': 'application/json',
        'X-MASTER-KEY': process.env.REACT_APP_X_MASTER_KEY,
        'X-Bin-Versioning' : false
    }
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
    static async fetchDrivers(parameter, method) {
        //methode => GET, PUT, POST
        const requestOptions = {
            method: method,
            headers: this.baseHeaders
        };
        let binId=''
        switch(parameter){
            case 'get_param_list':
                binId = PARAM_LIST_BIN
                break;
            case 'get_entylist':
                binId = ENTRYLIST_BIN
                break;
            case 'get_next_round':
                binId = NEXT_ROUND_BIN
                break;
            case 'get_champ_config':
                binId = CHAMPIONSHIP_CONFIGURATION_BIN
                break;
            case 'get_weather_config':
                binId = WEATHER_CONFIGURATION_BIN
                break;
            case 'get_custom_event':
                binId = CUSTOM_EVENT_BIN
                break;
        }
        console.log(requestOptions)
        const fecthedData = await fetch(JsonRemoteServerUrl + binId, requestOptions)
        .then(res => {
            console.log(res)
            return res.json()
        })
        .then((data) => {
            console.log(data)
            return data.record
        }).catch(error => {
            console.log('There has been a problem with your url operation:', error);
            return false
        })
        return fecthedData
    }
}
export default ApiService