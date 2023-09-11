import { useState, useEffect, useContext } from "react";
import styles from "./Planets.module.css";
import { LoadingContext } from "../../context/LoadingProvider";
import SpaceTravelApi from "../../services/SpaceTravelApi.js";

function Planets(){
    const [planetsWithSpacecrafts, setPlanetsWithSpacecrafts] = useState([]);
    const { isLoading, enableLoading, disableLoading } = useContext(LoadingContext);
    const [selectedPlanetId, setSelectedPlanetId] = useState();
    const [selectedSpacecraftId, setSelectedSpacecraftId] = useState();

    async function getPlanetsWithSpacecrafts(){
        const {data: planets, isError: isErrorPlanets} = await SpaceTravelApi.getPlanets();
        const {data: spacecrafts, isError: isErrorSpacecrafts} = await SpaceTravelApi.getSpacecrafts();

        if(!isErrorPlanets && !isErrorSpacecrafts){
            for(const planet of planets){
                planet.spacecrafts = [];
                for(const spacecraft of spacecrafts){
                    if(planet.id === spacecraft.currentLocation){
                        planet.spacecrafts.push(spacecraft);
                    }
                }
            }
            setPlanetsWithSpacecrafts(planets);
        }
    }

    useEffect(() => {
        async function runGetPlanetsWithSpacecrafts(){
            enableLoading();
            await getPlanetsWithSpacecrafts();
            disableLoading();
        }
        runGetPlanetsWithSpacecrafts();
    }, [enableLoading, disableLoading]);

    function handleClickOfPlanet(e, id){
        if(!isLoading){
            setSelectedPlanetId(id);
        }
    }

    async function handleClickOfSpacecraft(e, spacecraftId, planetId){
        if(!isLoading && Number.isInteger(selectedPlanetId) && selectedPlanetId !== planetId){
            setSelectedSpacecraftId(spacecraftId);

            enableLoading();

            const {isError} = await SpaceTravelApi.sendSpacecraftToPlanet({spacecraftId, targetPlanetId: selectedPlanetId});
            if(!isError){
                await getPlanetsWithSpacecrafts();
                setSelectedPlanetId(null);
                setPlanetsWithSpacecraftId(null);
            }
            disableLoading();
        }
    }

    return(
        <>
            {
                planetsWithSpacecrafts.map(
                    (planet, index) => 
                        <div
                            key={index}
                            className={styles["planetWithSpacecrafts"]}
                        >
                            <div className={`${styles["planet"]} ${selectedPlanetID === planet.id && styles ["planet--selected"]}`}
                            onClick={(event) => handleClickOfPlanet(event, planet.id)}>
                                <div className={stlyes["planet__imageContainer"]}>
                                    <img
                                        src={planet.pictureUrl}
                                        alt={`The planet ${planet.name}`}
                                        className={stlyes["planet__image"]}
                                    />
                                </div>

                                <div className={styles["planet__info"]}>
                                    <div>{planet.name}</div>
                                    <div>{planet.currentPopulation}</div>
                                </div>
                            </div>

                            <div className={styles["planet__spacecrafts"]}>
                                {
                                    planet.spacecrafts.map((spacecraft, index) => 
                                    <div
                                        key={index}
                                        className={`$styles["planet__spacecraft"] ${selectedSpacecraftId === spacecraft.id && stlyes ["planet__spacecraft--selected"]}`}
                                        onClick={(event) => handleClickOfSpacecraft(event, spacecraft.id, planet.id)}
                                    >
                                        <div className={styles["planet__spacecraft__imageContainer"]}>
                                            {
                                                spacecraft.pictureUrl ? 
                                                <img src={spacecraft.pictureUrl}
                                                     alt={`The spacecraft ${spacecraft.name}`}
                                                     className={styles["planet__spacecraft__image--default"]}/>
                                                :
                                                <span className={styles["planet__spacecraft__image--defauilt"]}>🚀</span>
                                            }
                                            </div>
                                            <div className={"planet__spacecraft__info"}>
                                                <div>{spacecraft.name}</div>
                                                <div>{spacecraft.capacity}</div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                )
            }
        </>
    );
}

export default Planets;