import fetch, {Response} from "node-fetch";
import {Method} from "../types/methods";

interface FetcherRetryDTO {
    count: number;
    secondsDelay: number;
}

export interface FetcherDTO<BodyType> {
    url: string;
    action: Method;
    retryDTO?: FetcherRetryDTO;
    headers?: any;
    body?: BodyType;
}

export interface FetcherResponseDTO<ResponseType> {
    status: number;
    ok: boolean;
    response: ResponseType;
}

const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "cache-control": "no-cache",
    "Access-Control-Allow-Origin": "*",
    "User-Agent": "ExpressTemplate/1.0.0",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
};


export async function request<BodyType = any, ResponseType = any>(fetcherDTO: FetcherDTO<BodyType>): Promise<FetcherResponseDTO<ResponseType>> {
    let headers = Object.assign(
        {},
        defaultHeaders,
        fetcherDTO.headers
    );
    let body: any = undefined;
    let retryDTO: FetcherRetryDTO = fetcherDTO.retryDTO || {
        count: 1,
        secondsDelay: 0,
    }

    if (fetcherDTO.body) {
        switch (headers["Content-Type"]) {
            case "application/json":
                body = JSON.stringify(fetcherDTO.body);
                break;
            case "multipart/form-data":
                body = fetcherDTO.body;
                break;
            default:
                body = fetcherDTO.body;
        }
    }

    let response: Response;

    for (let i = 0; i < retryDTO.count; i++) {
        try {
            response = await fetch(fetcherDTO.url, {
                method: fetcherDTO.action,
                headers,
                body,
            });

            if (response.ok) break;
        } catch (err) {
            console.log(`Attempt ${i + 1} failed:`, err);
        }

        if (
            i < retryDTO.count - 1 &&
            retryDTO.secondsDelay > 0
        ) {
            await new Promise((resolve) =>
                setTimeout(resolve, retryDTO.secondsDelay)
            );
        }
    }

    let responseBody = null;

    switch (response.headers.get("Content-Type")) {
        case "application/json; charset=utf-8":
        case "application/json;charset=UTF-8":
        case "application/json":
            responseBody = await response.json();
            break;
        case "application/ssml+xml":
            responseBody = await response.text();
            break;
        case "audio/webm; codec=opus":
        case "audio/wav":
        case "audio/x-wav":
            responseBody = await response.blob();
            break;
        default:
            responseBody = await response.text();
    }

    return {
        status: response.status,
        ok: response.ok,
        response: responseBody ? (responseBody as ResponseType) : undefined,
    };
}