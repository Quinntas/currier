import {create, Message, Whatsapp} from "@wppconnect-team/wppconnect";
import {StatusFindCallback} from "@wppconnect-team/wppconnect/dist/api/model/initializer";
import {StatusFind} from "@wppconnect-team/wppconnect/dist/api/model/enum";

export interface WhatsAppClientConfig {
    session: string,
    onMessage?: (message: Message) => Promise<void>
}

export class WhatsAppClient {
    private client: Whatsapp | undefined
    private _base64QrCodeImg: string | undefined
    private _statusFind: StatusFind | keyof typeof StatusFind | undefined

    constructor(
        private readonly config: WhatsAppClientConfig,
    ) {
        this.catchQR = this.catchQR.bind(this);
    }

    async connect() {
        this.client = await create({
            session: this.config.session,
            headless: false,
            logQR: false,
            catchQR: this.catchQR,
            statusFind: this.statusFindCallback,
            autoClose: 0,
        });

        this.client.logger.level = 'error'

        if (this.config.onMessage)
            this.client.onMessage(this.config.onMessage);

        await this.client.start();
    }

    private statusFindCallback: StatusFindCallback = (statusFind: StatusFind | keyof typeof StatusFind) => {
        this._statusFind = statusFind
    }

    async disconnect() {
        if (this.client)
            await this.client.close();
    }

    sendText(to: string, message: string): Promise<Message> {
        if (!this.client)
            throw new Error('Client not connected');
        return this.client.sendText(to, message)
    }

    private catchQR(base64QrCodeImg: string) {
        if (!base64QrCodeImg)
            return
        this._base64QrCodeImg = base64QrCodeImg
    }

    get base64QrCodeImg() {
        return this._base64QrCodeImg
    }

    get statusFind() {
        return this._statusFind
    }

    isWaitingQrCode() {
        if (!this._statusFind)
            return false
        return this._statusFind === "notLogged" || this._statusFind === "desconnectedMobile"
    }
}