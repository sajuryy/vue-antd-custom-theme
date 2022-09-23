import {defineStore} from "pinia"
import type {IVerse} from "../models/IVerse";

export const defineVersesStore = defineStore("verse", {
    state: () =>
        ({
            verses: [],
            currentVerse: null,
            newVerseData: defaultNewVerseData,
        } as IVerseState),
    persist: true,
    getters: {
        getVerses(): IVerse[] {
            return this.verses
        },
        getCurrentVerse(): IVerse | null {
            return this.currentVerse
        },
        getNewVerseData(): INewVerseData{
            return this.newVerseData
        }
    },
    actions: {
        setNewVerseData(verseData: INewVerseData) {
            this.newVerseData = verseData
        },
        setVerses(verses: IVerse[]) {
            this.verses = verses
        },
        setCurrentVerse(verse: IVerse) {
            this.currentVerse = verse
        }
    },
})

interface IVerseState {
    newVerseData: INewVerseData,
    currentVerse: IVerse | null,
    verses: IVerse[]

}

interface INewVerseData {
    name: string
    network: string
    iconUrl: string
}

const defaultNewVerseData = {
    name: "",
    network: "",
    ownerAccountAddress: "",
    iconUrl: "",
}
