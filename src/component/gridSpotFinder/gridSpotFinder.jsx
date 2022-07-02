import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import './gridSpotFinder.css'
import ReadData from '../../services/readData'
import { useCookies } from 'react-cookie';

const GridSpotFinder = () => {
    const { t } = useTranslation();
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const readData = new ReadData()
    
    const findSpotInGrid = () => {
        readData.postLocalApi( 'find_spot_in_grid',{userId : cookies['user']}).then((e) => {
        })
    }
    useEffect(() => {

    });

    
    return (
        <div className="col-md-12 d-flex flex-row justify-center gridFinder-container">
            {t("dashboard.notInGrid")}
            <Button className="btnJoker mb-2" variant="info" onClick={() => findSpotInGrid()}>
                {t("dashboard.getInGrid")}
            </Button>
        </div>
    );
}

export default GridSpotFinder;