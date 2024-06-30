import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { mapValues } from 'lodash';
import { TIMEOUT_REQUEST } from '@/constants/common';

export type RequestResponse<ResponseData> = AxiosResponse<ResponseData> & {
    error?: any;
};

type InputFunction<P extends any[], D> = (fetch: typeof fetcher, ...args: P) => Promise<D>;

type CreateRepositoryInput = {
    [key: string]: InputFunction<any, any>;
};

type CreateRepositoryOutput<
    Input extends CreateRepositoryInput,
    Keys extends keyof Input = keyof Input
> = {
    [P in Keys]: Input[P] extends InputFunction<infer P, infer D>
        ? (...args: P) => Promise<D>
        : never;
};

export default function createRepository<Input extends CreateRepositoryInput>(
    input: Input
): CreateRepositoryOutput<Input> {
    return mapValues(input, (resourceCreator) => {
        return (...args: any[]) => {
            return resourceCreator(fetcher, ...args);
        };
    }) as CreateRepositoryOutput<Input>;
}

const axiosInstance = axios.create({
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
});

export const fetcher = async <ResponseData = any>(
    url: string,
    config?: AxiosRequestConfig
): Promise<RequestResponse<ResponseData>> => {
    return axiosInstance
        .request<ResponseData>({
            ...config,
            url,
            params: {
                ...config?.params,
            },
            headers: {
                ...config?.headers,
            },
            timeout: config?.timeout ?? TIMEOUT_REQUEST.NORMAL, // 5 mins
        })
        .catch((error: any) => {
            // handle common error message
            return { error } as any;
        });
};
