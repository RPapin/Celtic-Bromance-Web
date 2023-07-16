import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import ReadData from '../../services/readData'
import { useCookies } from 'react-cookie';

const GridSpotFinder = () => {
    const { t } = useTranslation();
    const [cookies,] = useCookies(['user']);
    const readData = new ReadData()
    
    const findSpotInGrid = () => {
        readData.postLocalApi( 'find_spot_in_grid',cookies['user']).then((e) => {
        })
    }
    useEffect(() => {

    });

    
    return (
        <div className="col-md-12 d-flex flex-column align-items-center justify-center">
            <h3>{t("dashboard.notInGrid")}</h3>
            <Button type="Button" className="btn btn-secondary btn-lg" variant="info" onClick={() => findSpotInGrid()}>{t("dashboard.getInGrid")}</Button>
        </div>
    );
}

export default GridSpotFinder;