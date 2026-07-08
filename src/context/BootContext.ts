import { createContext } from "react";

/** true une fois le preloader "AMORÇAGE DE LA POMPE" terminé :
 *  les reveals et compteurs ne démarrent qu'à ce moment-là. */
export const BootContext = createContext(false);
