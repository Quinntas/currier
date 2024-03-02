import {SendMessageDTO} from "./sendMessageDTO";
import {jsonResponse} from "../../../../core/responses";
import {DecodedExpressRequest} from "../../../../types/decodedExpressRequest";
import {Response} from "express";
import {SendMessageResponseDTO} from "../../repo/currierRepo";

export async function SendMessageUseCase(request: DecodedExpressRequest<SendMessageDTO, null>, response: Response) {
    return jsonResponse<SendMessageResponseDTO>(response,
        200,
        {message: "ok"}
    )
}