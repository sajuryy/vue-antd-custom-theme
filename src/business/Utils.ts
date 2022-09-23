export class Utils {
    public static readonly DEFAULT_DECIMAL_TO_FIX = 18

    public static imvToAimv(imv: number): string {
        if(imv > 1) {
            return Math.round(imv).toString() + (Math.pow(10, Utils.DEFAULT_DECIMAL_TO_FIX)).toString().substring(1)
        }
        return (Math.round(imv * 1_000_000_000)).toString() + "000000000"
    }
}
