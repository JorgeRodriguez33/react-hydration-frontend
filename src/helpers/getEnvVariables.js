export const getEnvVariables = () => {
    console.log(import.meta.env);
    
    return {
        ...import.meta.env
    }
}
