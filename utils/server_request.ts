class ServerRequest {
    private static instance: ServerRequest;
    private baseURL: string;
    private headers: HeadersInit;

    private constructor(baseURL: string, headers: HeadersInit) {
        this.baseURL = baseURL;
        this.headers = headers;
    }

    public static async getInstance(): Promise<ServerRequest> {
        if (!ServerRequest.instance) {
            const { useWebApp } = await import('vue-tg');
            const { initData } = useWebApp();

            const baseURL = 'https://event-planner-api.cloudpub.ru';
            const headers: HeadersInit = {
                'Authorization': `TMiniApp ${initData}`,
                'Content-Type': 'application/json'
            };

            ServerRequest.instance = new ServerRequest(baseURL, headers);
        }
        return ServerRequest.instance;
    }

    private async request<T>(url: string, options: RequestInit): Promise<T> {
        const response = await fetch(`${this.baseURL}${url}`, {
            ...options,
            headers: {
                ...this.headers,
                ...options.headers
            }
        });

        if (!response.ok) {
            console.warn("ServerRequest.request", response);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async post<T>(url: string, data: any): Promise<T> {
        return this.request<T>(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async get<T>(url: string): Promise<T> {
        return this.request<T>(url, {
            method: 'GET'
        });
    }

    async delete<T>(url: string, data: any): Promise<T> {
        return this.request<T>(url, {
            method: 'DELETE',
            body: JSON.stringify(data)
        });
    }
}

export default ServerRequest;