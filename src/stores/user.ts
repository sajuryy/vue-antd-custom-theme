import { defineStore } from "pinia"
import { UserMode } from "../models/User"

export const defineUserStore = defineStore("user", {
  state: () =>
    ({
      mode: UserMode.USER,
      isOnboardingPassed: false,
    } as IUserState),
  persist: true,
  getters: {
    isOnboarding(): boolean {
      return !this.isOnboardingPassed
    },
  },
  actions: {
    switchMode() {
      switch (this.mode) {
        case UserMode.DEVELOPER:
          this.mode = UserMode.USER
          return
        case UserMode.USER:
          this.mode = UserMode.DEVELOPER
          return
      }
    },
    setMode(mode: UserMode) {
      this.mode = mode
    },
    setOnboardingPassed() {
      this.isOnboardingPassed = true
    },
    setOnboardingNotPassed() {
      this.isOnboardingPassed = false
    },
  },
})

interface IUserState {
  mode: UserMode
  isOnboardingPassed: boolean
}
