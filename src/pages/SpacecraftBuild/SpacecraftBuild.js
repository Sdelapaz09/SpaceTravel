import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SpacecraftBuild.module.css";
import { LoadingContext } from "../../context/LoadingProvider";
import SpaceTravelApi from "../../services/SpaceTravelApi.js";

function SpacecraftBuild(){
    const INITIAL_SPACECRAFT = {
        name: "",
        capacity: "",
        description: "",
        pictureUrl: ""
    };
    const [spacecraft, setSpacecraft] = useState(INITIAL_SPACECRAFT);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const {enableLoading, disableLoading} = useContext(LoadingContext);

    function handleChangeOfFormInput (e){
        const {name, value} = e.target;

        setSpacecraft(prevSpacecraft => ({
            ...prevSpacecraft, [name]: value
        }));
    }

    async function handleSubmitOfForm(e){
        e.preventDefault();

        let {name, capacity, description, pictureUrl} = spacecraft;

        let isFormError = false;
        setErrors([]);

        if(name.length === 0) {
            isFormError = true;
            setErrors(prevErrors => ([
                ...prevErrors, "Name is required!"
            ]));
        }

        capacity = Number(capacity);
        if(!Number.isInteger(capacity)){
            isFormError = true;
            setErrors(prevErrors => ([
                ...prevErrors, "Capacity should be an integer!"
            ]));
        }

        if(!description){
            isFormError = true;
            setErrors(prevErrors => ([
                ...prevErrors, "Description is required!"
            ]));
        }

        if(!isFormError){
            enableLoading();
            const {isError} = await SpaceTravelApi.buildSpacecraft({name, capacity, description, pictureUrl});
            if(!isError){
                setSpacecraft(INITIAL_SPACECRAFT);
            }
            disableLoading();
        }
    }

    function handleClickOfBack(e){
        navigate(-1);
    }

    return(
        <>
            <button
                className={styles["button__back"]}
                onClick={handleClickOfBack}> Back 👈 
            </button>
            <div>
                <form onSubmit={handleSubmitOfForm}>
                    <div className={styles["form"]}>
                        <div className={styles["form__inputs"]}>
                            <div className={styles["form__inputContainer"]}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={spacecraft.name}
                                    onChange={handleChangeOfFormInput}
                                    autoComplete="off"
                                />
                            </div>

                            <div className={styles["form__inputContainer"]}>
                                <input
                                    type="text"
                                    name="capacity"
                                    placeholder="Capacity"
                                    value={spacecraft.capacity}
                                    onChange={handleChangeOfFormInput}
                                    autoComplete="off"
                                />
                            </div>

                            <div className={styles["form__inputContainer"]}>
                                <textarea
                                    name="description"
                                    placeholder="Description"
                                    value={spacecraft.description}
                                    onChange={handleChangeOfFormInput}
                                />
                            </div>

                            <div className={styles["form__inputContainer"]}>
                                <input
                                    type="text"
                                    name="pictureUrl"
                                    placeholder="Picture URL"
                                    value={spacecraftcraft.pictureUrl}
                                    onChange={handleChangeOfFormInput}
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className={styles["submitContainer"]}>
                            <div className={styles["errorContainer"]}>
                                {
                                    errors.map((error, index) => <div
                                        key={index}
                                        className={styles["error"]}
                                        >{error}</div>)
                                }
                            </div>

                            <div className={styles["button__submit"]}>
                                <button 
                                    type="submit"
                                    onClick={handleChangeOfFormInput}
                                >
                                    Build 🏗️
                                </button>
                            </div>
                        </div>
                    </div>
                </form>    
            </div>    
        </>
    );
}

export default SpacecraftBuild;