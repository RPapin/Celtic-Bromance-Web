import React, { useState, useEffect } from 'react'
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import './championnshipResult.css'
import { useTranslation } from 'react-i18next';


const ChampionnshipResult = (props) => {  
    const { t, i18n } = useTranslation();
    const [currentTab, setCurrentTab] = useState('Standings');
    const positionColor = ['gold', 'silver', 'bronze']
    const displayStandings = (raceNumber) => {
        //Display position per race for the overall standing page
        const renderRacePosition = (playerId) => {
            let inter =  props.fullResult['raceResult'].map((answer, i) => {      
                let j = 1
                return answer[i + 1].map((element) => { 
                    let classe = ''
                    if(element['playerId'] === playerId){
                        if(element['position'] <= positionColor.length)classe = positionColor[element['position'] - 1]
                        return <td key={playerId + i} className={'tdNumber '}><span className={'spanTd ' + classe}>{element['position']} </span></td>
                    }//The driver DNS the race 
                    else if(j === answer[i + 1].length){
                        return <td key={playerId + i}>DNS</td>
                    } else j ++
                
                })
            })
            return inter
        }
        if(raceNumber === -1){
            //Display standings
            return (
            <Table responsive>
                <thead>
                    <tr>
                    <th>{t("championshipResult.position")}</th>
                    <th>{t("championshipResult.name")}</th>
                    {props.fullResult['raceResult'].map((answer, i) => {       
                        return (<th>{t("championshipResult.race")} {i + 1}</th>) 
                    })}
                    <th>{t("championshipResult.totalPoint")}</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {props.fullResult['championnshipStanding'].map((driverInfo, i) => {     
                        return (<tr key={i}><td>{i + 1}</td><td>{driverInfo['firstName'] + ' ' + driverInfo['lastName']}</td> {renderRacePosition(driverInfo['playerId'])}<td>{driverInfo['point']}</td></tr>) 
                    })}
                    
                </tbody>
            </Table>)
        } else {
            //display race result
            return (
            <>
            <h4>{props.fullResult['trackList'][raceNumber]}</h4>
                <Table responsive>
                    <thead>
                        <tr>
                        <th>{t("championshipResult.position")}</th>
                        <th>{t("championshipResult.name")}</th>
                        <th>{t("championshipResult.car")}</th>
                        <th>{t("championshipResult.point")}</th>
                        <th>{t("championshipResult.positionGained")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.fullResult['raceResult'][raceNumber][raceNumber + 1].map((driverInfo, i) => {     
                            return (<tr key={i}><td>{i + 1}</td><td>{driverInfo['firstName'] + ' ' + driverInfo['lastName']}</td><td>{driverInfo['carName']}</td><td>{driverInfo['point']}</td><td>{driverInfo['starting_place'] - driverInfo['position']}</td></tr>) 
                        })}
                        
                    </tbody>
                </Table>
                </>)
        }
    }
    useEffect( () => {
       
    })
    return (
    <div className={'containerResult'}>
        {props.fullResult && 
        <>
            <h2>{t("championshipResult.title")}</h2>
            <Tabs
                id="controlled-tab-example"
                activeKey={currentTab}
                onSelect={(k) => setCurrentTab(k)}
                className="mb-3">
                <Tab eventKey={"Standings"} title={t("championshipResult.title")}>
                    {displayStandings(-1)}
                </Tab>
                { props.fullResult['raceResult'].map((answer, i) => {       
                    return (<Tab key={"key" + i } eventKey={i} title={t("championshipResult.race")  + " " + (i + 1)}>{displayStandings(i)}</Tab>) 
                })}
            </Tabs>
        </>
        }
        
    </div>
    )

}

export default ChampionnshipResult