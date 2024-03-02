import {Client, LocalAuth, Message} from "whatsapp-web.js";
import qrcode from 'qrcode-terminal';

export class WhatsappWebJs {
    private client: Client;

    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth()
        })

        this.client.on('qr', (qr: string) => {
            console.log(`[WhatsAppWebJs] ${qr}`)
            qrcode.generate(qr, {small: true});
        });

        this.client.on('message', (message: Message) => {
            this.onMessageReceived(message);
        });

        this.client.on('ready', () => {
            this.onClientReady();
        });
    }

    public async init() {
        console.log('[WhatsAppWebJs] Starting client')
        await this.client.initialize();
    }

    public async sendMessage(phoneNumber: string, message: string, delay: number): Promise<[boolean, string]> {
        phoneNumber = `${phoneNumber}@c.us`
        await new Promise(resolve => setTimeout(resolve, delay));
        try {
            await this.client.sendMessage(phoneNumber, message);
            return [false, 'Message sent']
        } catch (e) {
            if (e.message.includes('invalid wid'))
                return [true, 'Invalid phone number']
            else
                return [true, 'Unknown error']
        }
    }

    private async onMessageReceived(message: Message) {
        console.log(`[WhatsAppWebJs] Message received: ${message.body}`)
    }

    private onClientReady() {
        console.log('[WhatsAppWebJs] Client is ready!')
    }
}


