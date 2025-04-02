export const AppConfig = {
    appId: 'ai_2',
    appApiUrl:
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:8000/api'
            : 'http://10.16.20.156:7474/api',
    serviceApiUrl: 'http://172.16.111.146:8080'
}

