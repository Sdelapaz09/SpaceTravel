import { NavLink } from "react-router-dom";
import styles from "./NavigationBar.module.css";

function NavigationBar(){
    const routes = [
        {to: "/", text: "🌎 Home" },
        {to: "/spacecrafts", text: "🚀 Spacecrafts"},
        {to: "/planets", text: "🪐 Planets" }
    ];

    return (
        <nav className = {styles["navigation"]}>
            {
                routes.map((route, index) =>
                <NavLink
                    key={index}
                    className={({isActive, isPending}) => `${styles["navigation_item"]} ${isActive? styles["navigation__item--acive"] : ""}`}
                    to={route.to}>
                    {route.text}
                    </NavLink>
                );
            }
        </nav>
    );
}

export default NavigationBar;