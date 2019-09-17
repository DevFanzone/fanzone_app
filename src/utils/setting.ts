export class AppSettings {
    private static IS_PRODUCTION: boolean = true;
    public static VERSION = "1.1.4";

    public static API_ENDPOINT = AppSettings.IS_PRODUCTION ? "https://api.popflyxp.com:8443/api/api" : "/api"; /*"http://35.199.43.24:8080/api/api"*/

    public static APP_VERSION = AppSettings.IS_PRODUCTION ? `v${AppSettings.VERSION}` : `v${AppSettings.VERSION} - Dev`;

    public static TIMEOUT_REQUEST = 60000;

    public static ATLETA_ID = 3;

    public static URL_SHOPIFY = 'https://store.popflyxp.com';
    public static URL_GOOGLE_PLAY = 'https://play.google.com/store?hl=es';
    public static URL_APP_STORE = 'https://itunes.apple.com/mx';
}
