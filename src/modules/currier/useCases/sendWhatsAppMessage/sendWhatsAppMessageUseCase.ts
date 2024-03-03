import {SendWhatsAppMessageDTO} from "./sendWhatsAppMessageDTO";
import {jsonResponse} from "../../../../core/responses";
import {DecodedExpressRequest} from "../../../../types/decodedExpressRequest";
import {Response} from "express";
import {SendMessageResponseDTO} from "../../repo/currierRepo";
import {whatsappWebJs} from "../../../../services";
import {HttpError} from "../../../../core/errors";
import {SendMessageResult} from "../../../../services/whatsappWebJs/whatsappWebJs";

export async function SendWhatsAppMessageUseCase(request: DecodedExpressRequest<SendWhatsAppMessageDTO, null>, response: Response) {
    let res: SendMessageResult = null

    switch (request.bodyObject.data.type) {
        case "SIMPLE":
            res = await whatsappWebJs.sendMessage(
                request.bodyObject.data.phone,
                request.bodyObject.data.text,
            )
            break
        default:
            throw new HttpError(400, "Type not implemented")
    }

    return jsonResponse<SendMessageResponseDTO>(response,
        res.isError ? 400 : 200,
        {message: res}
    )
}