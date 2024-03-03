import {SendMessageDTO} from "./sendMessageDTO";
import {DecodedExpressRequest} from "../../../../types/decodedExpressRequest";
import {Response} from "express";
import {HttpError} from "../../../../core/errors";
import {SendWhatsAppMessageUseCase} from "../sendWhatsAppMessage/sendWhatsAppMessageUseCase";
import {SendWhatsAppMessageDTO} from "../sendWhatsAppMessage/sendWhatsAppMessageDTO";

export async function SendMessageUseCase(request: DecodedExpressRequest<SendMessageDTO, null>, response: Response) {
    switch (request.body.vehicle) {
        case "WHATSAPP":
            return await SendWhatsAppMessageUseCase(request as DecodedExpressRequest<SendWhatsAppMessageDTO, null>, response)
        case "EMAIL":
            throw new HttpError(400, "Email not implemented")
        default:
            throw new HttpError(400, "Vehicle not implemented")
    }
}

