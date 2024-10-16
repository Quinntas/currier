import {create, Message, Whatsapp} from "@wppconnect-team/wppconnect";

export interface WhatsAppClientConfig {
    session: string,
    onMessage: (message: Message) => Promise<void>
}

export class WhatsAppClient {
    private client: Whatsapp | undefined

    constructor(
        private readonly config: WhatsAppClientConfig,
    ) {
    }

    async connect() {
        this.client = await create({
            session: this.config.session,
            headless: true,
            logQR: false,
            catchQR: this.catchQR,
            statusFind: this.statusFind
        });

        this.client.logger.level = 'error'

        this.client.onMessage(this.config.onMessage);

        await this.client.start();
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

    private catchQR(base64Qrimg: string, asciiQR: string, attempts: number, urlCode?: string) {
        console.log('QR Code: ', base64Qrimg);
        console.log('ASCII QR: ', asciiQR);
        console.log('Attempts: ', attempts);
        console.log('URL Code: ', urlCode);
    }

    private statusFind(statusSession: string, session: string) {
        console.log('Status Session: ', statusSession);
        console.log('Session name: ', session);
    }
}
