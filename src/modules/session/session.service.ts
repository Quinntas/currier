import {InsertSessionModel, SelectSessionModel} from "./session.model";
import {SessionRepo} from "./session.repo";
import {WhatsAppClient} from "../whatsapp/whatsAppClient";

export class SessionService {
    constructor(
        private readonly sessionRepo: SessionRepo,
        private whatsAppClients: Map<string, WhatsAppClient> = new Map<string, WhatsAppClient>()
    ) {
    }

    create(session: Omit<Omit<InsertSessionModel, "status">, "token">) {
        return this.sessionRepo.create({
            ...session,
            status: "INACTIVE",
            token: crypto.randomUUID()
        })
    }

    async validateSession(sessionToken: string, userId: number) {
        const session = await this.sessionRepo.findByTokenAndUserId(sessionToken, userId)

        if (!session)
            throw new Error("Invalid session")

        return session
    }

    async getQrCode(session: SelectSessionModel) {
        if (session.status !== "ACTIVE")
            throw new Error("Session is not active")

        const client = this.whatsAppClients.get(session.token)

        if (!client)
            throw new Error("Client session not found")

        if (!client.isWaitingQrCode())
            throw new Error("Client is not waiting for QR Code")

        if (!client.base64QrCodeImg)
            throw new Error("QR Code still not generated")

        return {
            base64: client.base64QrCodeImg
        }
    }

    async loadSessions() {
        const sessions = await this.sessionRepo.findActive()

        for (const session of sessions) {
            const client = new WhatsAppClient({
                session: session.token,
                onMessage: async (message) => {
                    console.log("Message received", message)
                }
            })

            this.whatsAppClients.set(session.token, client)

            await client.connect()
        }
    }
}