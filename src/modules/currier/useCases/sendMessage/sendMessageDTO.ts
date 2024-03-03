import {SendWhatsAppMessageDTO} from "../sendWhatsAppMessage/sendWhatsAppMessageDTO";

export type SendMessageDTO = {
    vehicle: "WHATSAPP";
    data: SendWhatsAppMessageDTO
} | {
    vehicle: "EMAIL";
    data: null
}