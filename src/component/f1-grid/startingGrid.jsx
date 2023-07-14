import React, { useState, useEffect } from "react";
import GridNameplate from "./GridNameplate";
import countries from "i18n-iso-countries";
import ReadData from "../../services/readData";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import GridSpotFinder from "./gridSpotFinder";
import Spinner from "react-bootstrap/Spinner";

const StartingGrid = ({
  isInGrid,
  updateJoker,
  seeResult,
  gridNextRound,
  waitingGrid,
  teamInfoParent
}) => {
  const MAX_TEAM_VICTIM = 2;
  const { t } = useTranslation();
  countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
  const readData = new ReadData();
  const [swapCar, setSwapCar] = useState(0);
  const [teamWith, setTeamWith] = useState(0);
  const [cookies] = useCookies(["user"]);
  const [isTeamingWith, setIsTeamingWith] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [disabledTeaming, setDisabledTeaming] = useState(false);
  const [isSwappingCar, setIsSwappingCar] = useState(false);
  const [teamWithVictimId, setTeamWithVictimId] = useState();
  const [teamInfo, setTeamInfo] = useState(teamInfoParent);

  const doSwap = async (action, victim) => {
    if (!isTeamingWith && !isSwappingCar) {
      readData.postLocalApi(action, [cookies["user"], victim]).then((e) => {
        seeResult();
      });
      if (action === "teamWith") {
        setIsTeamingWith(true);
        setTeamWithVictimId(victim);
      } else if (action === "swapCar") {
        setIsSwappingCar(true);
      }
    }
  };

  const handleParmaList = (response) => {
    let tempDriverList = []
    response.entry.forEach((driver) => {
      //Team victim List
      if (driver.available) {
        const driverInfo = {
          id: driver["Steam id "],
          teamVictimNumber: driver["teamWithVictim"],
        };
        tempDriverList.push(driverInfo)
      }
      if (driver["Steam id "] === cookies["user"]) {
        setSwapCar(driver["swapCar"]);
        setTeamWith(driver["teamWith"]);
        if (isTeamingWith) {
          setIsTeamingWith(false);
        }
        if (isSwappingCar) {
          setIsSwappingCar(false);
        }
      }
    });
    setTeamVictimList(tempDriverList);
  };
  const handleTeamInfo = (response) => {
    setTeamInfo(response);
    //Search if has teamed with someone
    const isAlreadyTeamed = response.find(
      (teamInfo) => teamInfo.leader === cookies["user"]
    );
    //Someone teamed with you
    const hasBeenAlreadyTeamed = response.find(
      (teamInfo) => teamInfo.victim === cookies["user"]
    );
    if (isAlreadyTeamed) {
      setTeamWithVictimId(isAlreadyTeamed.victim);
      setDisabledTeaming(true);
    }
    if (hasBeenAlreadyTeamed) {
      setTeamWithVictimId(hasBeenAlreadyTeamed.leader);
      setDisabledTeaming(true);
    }
  };

  const isInTeam = (userId) => {
    if (teamVictimList.length !== 0) {
      const teamVictimInfo = teamVictimList.find(
        (teamVictimInfo) => teamVictimInfo.id === userId
      );
      if (teamVictimInfo !== undefined) {
        return (
          teamInfo.find(
            (teamInfo) =>
              teamInfo.leader === userId || teamInfo.victim === userId
          ) !== undefined || teamVictimInfo.teamVictimNumber >= MAX_TEAM_VICTIM
        );
      } else return false;
    } else {
      return false;
    }
  };
  useEffect(() => {
    let shouldUpdate = true;
    console.log("useEffect starting grid");
    const fetchAllData = () => {
      console.log("fetchAllData starting grid");
      const resourceOne = readData
        .getLocalApi("get_param_list")
        .then((response) => {
          handleParmaList(response);
        });
      const resourceTwo = readData
        .postLocalApi("getTeamInfo", cookies["user"])
        .then((response) => {
          console.log("getTeamInfo in starting")
          console.log(response)
          handleTeamInfo(response);
        });

      Promise.all([resourceOne, resourceTwo]).then(() => {
        buildGrid();
        if (shouldUpdate) {
          setIsLoading(false);
        }
      });
    };

    fetchAllData();
    return () => {
      shouldUpdate = false;
    };
  }, [updateJoker]);

  const buildGrid = () => {
    return gridNextRound ? (
      gridNextRound.map((element, i) => (
        <GridNameplate
          key={element.playerID}
          doSwap={doSwap}
          driverInfo={{
            grid: {
              position: i + 1,
              state: "ontrack",
            },
            firstName: element.firstName,
            lastName: element.lastName,
            constructor: element.car,
            number: element.ballast,
            playerId: element.playerID,
            nationality: countries.getAlpha2Code(element.nationality, "en")
              ? countries
                  .getAlpha2Code(element.nationality, "en")
                  .toLocaleLowerCase()
              : "pl",
          }}
          seeResult={seeResult}
          swapCar={swapCar}
          teamWith={teamWith}
          isSwappingCar={isSwappingCar}
          isTeamingWith={isTeamingWith}
          teamWithVictimId={teamWithVictimId}
          isInGrid={isInGrid}
          disabledTeaming={disabledTeaming || isInTeam(element.playerID)}
        />
      ))
    ) : (
      <></>
    );
  }
  return (
    <>
      {isLoading ? (
        // <div className="server-info"> The ACC server is not connected</div>
        <div className="spinnerContainer">
          <Spinner animation="grow" variant="danger" />
        </div>
      ) : (
        <div className="mt-5 mb-5 border border-secondary rounded-bottom rounded-3">
          <div className="mb-3 w-100 bg-secondary">
            <h3 className="text-white pl-2 pt-2 pb-2">
              {t("dashboard.startingGrid")}
            </h3>
          </div>
          {!isInGrid && (
            <>
              <GridSpotFinder />
              <hr />
            </>
          )}
          <div className="container text-center d-flex flex-column align-items-center justify-content-center">
            {!waitingGrid ? (
              <div className="container d-flex flex-column align-items-center justify-content-center">
                {buildGrid()}
              </div>
            ) : (
              <p>{t("dashboard.waitingGrid")}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StartingGrid;
