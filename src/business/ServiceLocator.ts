import {ImversedFactory} from "./networks/imversed/ImversedFactory"

export class ServiceLocator {
    public constructor(private readonly window: Window) {
    }

    public static readonly ServiceLocatorKey = "injectionServiceLocator"

    public getFactory(): ImversedFactory {
        const config = window.localStorage.getItem("network")

        if(!config) {
            throw new Error("No network's config")
        }
        return new ImversedFactory(window.localStorage, window, JSON.parse(config).network)
    }
}
