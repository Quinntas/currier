import WAWebJS, {Client, LocalAuth, Message} from "whatsapp-web.js";
import qrcode from 'qrcode-terminal';

export interface SendMessageResult {
    isError: boolean;
    message: string;
}

export class WhatsappWebJs {
    private client: Client;
    private readonly useQrCodeInTerminal: boolean

    constructor(useQrCodeInTerminal: boolean = true) {
        this.useQrCodeInTerminal = useQrCodeInTerminal;

        this.client = new Client({
            authStrategy: new LocalAuth()
        })

        this.client.on('qr', (qr: string) => {
            console.log(`[WhatsappWebJs] QRCode: ${qr}`)
            if (this.useQrCodeInTerminal)
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
        console.log('[WhatsappWebJs] Starting client')
        await this.client.initialize();
    }

    public async sendMessage(phoneNumber: string, message: WAWebJS.MessageContent, options?: WAWebJS.MessageSendOptions): Promise<SendMessageResult> {
        if (!phoneNumber)
            return {isError: true, message: 'Phone number not provided'}

        if (!message)
            return {isError: true, message: 'Message not provided'}

        const editedPhoneNumber = `${phoneNumber}@c.us`

        try {
            await this.client.sendMessage(editedPhoneNumber, message, options);
            return {isError: false, message: 'editedPhoneNumber sent'}
        } catch (e) {
            if (e.message.includes('invalid wid'))
                return {isError: true, message: 'Invalid phone number'}
            else
                return {isError: true, message: 'Error sending message'}
        }
    }

    private async onMessageReceived(message: Message) {
        console.log(`[WhatsappWebJs] Message received: ${message.body}`)
    }

    private onClientReady() {
        console.log('[WhataAppWebJs] Client is ready!')
    }
}


