export interface IMesssage {
    id: string;
    content: string;
    role: MESSAGE_ROLE;
}

export enum MESSAGE_ROLE {
    HUMAN = 'HUMAN',
    AI = 'AI',
}

export enum ESTREAM_TYPE {
    MESSAGE_START = 'MESSAGE_START',
    MESSAGE_END = 'MESSAGE_END',
    NEW_TOKEN = 'NEW_TOKEN',
}
