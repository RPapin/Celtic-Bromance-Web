import logos from './../logo/manufacturers'
import ac from './../logo/assettocorsa.png'

const getLogoImage = {
    "ALPINE A110 GT4": logos.alpine,
    "ASTON MARTIN V8 VANTAGE GT4": logos.aston,
    "AMR V12 VANTAGE GT3 2013": logos.aston,
    "AMR V8 VANTAGE 2019": logos.aston,
    "AUDI R8 LMS GT4": logos.audi,
    "AUDI R8 LMS 2015": logos.audi,
    "AUDI R8 LMS EVO 2019": logos.audi,
    "AUDI R8 LMS GT3 EVO II": logos.audi,
    "BENTLEY CONTINENTAL GT3 2015": logos.bentley,
    "BENTLEY CONTINENTAL GT3 2018": logos.bentley,
    "BMW M4 GT4": logos.bmw,
    "BMW M6 GT3 2017": logos.bmw,
    "BMW M4 GT3": logos.bmw,
    "BMW M2 CS RACING": logos.bmw,
    "CHEVROLET CAMARO GT4.R": logos.chevrolet,
    "FERRARI 488 CHALLENGE EVO": logos.ferrari,
    "FERRARI 488 GT3 2018": logos.ferrari,
    "FERRARI 488 GT3 EVO 2020": logos.ferrari,
    "FERRARI 296 GT3": logos.ferrari,
    "GINETTA G55 GT4": logos.ginetta,
    "HONDA NSX GT3 2017": logos.honda,
    "HONDA NSX GT3 EVO 2019": logos.honda,
    "EMIL FREY JAGUAR G3 2012": logos.jaguar,
    "KTM X-BOW GT4": logos.ktm,
    "LAMBORGHINI HURACAN SUPERTROFEO 2015": logos.lamborghini,
    "LAMBORGHINI HURACAN SUPER TROFEO EVO2": logos.lamborghini,
    "LAMBORGHINI HURACAN GT3 2015": logos.lamborghini,
    "LAMBORGHINI HURACAN GT3 EVO 2019": logos.lamborghini,
    "LAMBORGHINI HURACAN GT3 EVO 2 2023": logos.lamborghini,
    "LEXUS RC F GT3 2016": logos.lexus,
    "MASERATI GRANTURISMO MC GT4": logos.maserati,
    "MCLAREN 570S GT4": logos.mclaren,
    "MCLAREN 650S GT3 2015": logos.mclaren,
    "MCLAREN 720S GT3 2019": logos.mclaren,
    "MCLAREN 720S GT3 EVO 2023": logos.mclaren,
    "MERCEDES AMG GT4": logos.mercedes,
    "MERCEDES-AMG GT3": logos.mercedes,
    "MERCEDES-AMG GT3 2015": logos.mercedes,
    "NISSAN GT-R NISMO GT3 2015": logos.nissan,
    "NISSAN GT-R NISMO GT3 2018": logos.nissan,
    "PORSCHE 718 CAYMAN GT4 CLUBSPORT": logos.porsche,
    "PORSCHE 991 II GT3 CUP 2017": logos.porsche,
    "PORSCHE 911 GT3 CUP (TYPE 992)": logos.porsche,
    "PORSCHE 991 GT3 R 2018": logos.porsche,
    "PORSCHE 911 II GT3 R 2019": logos.porsche,
    "PORSCHE 992 GT3 R 2023": logos.porsche,
    "REITER ENGINEERING R-EX GT3 2017": logos.reiter,
}

function getCarLogo(carName) {
    return getLogoImage[carName.toUpperCase()] || ac;
}

export default getCarLogo