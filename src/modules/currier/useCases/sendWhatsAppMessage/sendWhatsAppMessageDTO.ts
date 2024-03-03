export interface BaseMessageDTO {
    text: string;
    phone: string;
    delay: number;
}

interface SimpleMessageDTO extends BaseMessageDTO {
    type: "SIMPLE";
}

interface ButtonMessageDTO extends BaseMessageDTO {
    type: "BUTTON";
}


export type SendWhatsAppMessageDTO = {
    data: SimpleMessageDTO | ButtonMessageDTO;
}