
import { useTranslation } from 'react-i18next';
import getCleanTrackName from '../../../helpers/getCleanTrackName';

export default function NextRoundTrackInfo({ infoNextRound }) {
    const { t, } = useTranslation();
    var cleanTrack = getCleanTrackName(infoNextRound['track'])

    return (
        <div className="mt-5 mb-5 border border-primary rounded-bottom rounded-3">
            <div className="mb-3 w-100 bg-primary">
                <h3 className="text-white pl-2 pt-2 pb-2">Next Race</h3>
            </div>
            <div className="container text-center">
                <div className="row">
                    <div className="col-2">
                        <p><b>{t("infoNextRoundBloc.track")}</b><br />{cleanTrack}</p>
                    </div>
                    <div className="col">
                        <p><b>{t("infoNextRoundBloc.hourOfDay")}</b><br />{infoNextRound['Hour of Day']}:00</p>
                    </div>
                    <div className="col">
                        <p><b>{t("infoNextRoundBloc.timeMultipler")}</b><br /> {infoNextRound['Time Multipler']}x</p>
                    </div>
                    <div className="col">
                        <p><b>{t("infoNextRoundBloc.ambientTemperature")}</b><br />{infoNextRound['Ambient temperature']}°C</p>
                    </div>
                    <div className="col">
                        <p><b>{t("infoNextRoundBloc.rain")}</b><br />{infoNextRound['Rain'] * 100}%</p>
                    </div>
                    <div className="col">
                        <p><b>{t("infoNextRoundBloc.cloudLevel")}</b><br />{infoNextRound['Cloud level'] * 100}%</p>
                    </div>
                    <div className="col">
                        <p><b>{t("infoNextRoundBloc.weatherRandomness")}</b><br />{(infoNextRound['Weather randomness'])} out of 7 </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

