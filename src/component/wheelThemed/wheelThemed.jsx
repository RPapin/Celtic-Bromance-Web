import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import './wheelThemed.css'


const data = [
    { option: 'REACT' },
    { option: 'CUSTOM' },
    { option: 'ROULETTE', style: { textColor: '#f9dd50' } },
    { option: 'WHEEL' },
    { option: 'REACT' },
    { option: 'CUSTOM' },
    { option: 'ROULETTE', style: { textColor: '#70bbe0' } },
    { option: 'WHEEL' },
  ]

const WheelThemed = () => {
    
    const { t, } = useTranslation();
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
  
    const handleSpinClick = () => {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    };

    const backgroundColors = ['#ff8f43', '#70bbe0', '#0b3351', '#f9dd50'];
    const textColors = ['#0b3351'];
    const outerBorderColor = '#eeeeee';
    const outerBorderWidth = 10;
    const innerBorderColor = '#30261a';
    const innerBorderWidth = 0;
    const innerRadius = 0;
    const radiusLineColor = '#eeeeee';
    const radiusLineWidth = 8;
    const fontSize = 17;
    const textDistance = 60;
    const spinDuration = 1.0;

    useEffect( () => {
        console.log('WheelThemed')
        handleSpinClick()
    })
    return (
        <>
            {/* <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                backgroundColors={backgroundColors}
                textColors={textColors}
                fontSize={fontSize}
                outerBorderColor={outerBorderColor}
                outerBorderWidth={outerBorderWidth}
                innerRadius={innerRadius}
                innerBorderColor={innerBorderColor}
                innerBorderWidth={innerBorderWidth}
                radiusLineColor={radiusLineColor}
                radiusLineWidth={radiusLineWidth}
                spinDuration={spinDuration}
                // perpendicularText
                textDistance={textDistance}
                onStopSpinning={() => {
                    setMustSpin(false);
                }}
            /> */}
      </>
    );
}

export default WheelThemed