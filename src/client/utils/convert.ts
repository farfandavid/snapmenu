const base64toFile = (base64: string, filename: string): File => {
    const base64Content = base64.split(';base64,').pop() || '';
    const mimeType = base64.split(';')[0].split(':')[1];

    const byteCharacters = atob(base64Content);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    return new File([blob], filename, { type: mimeType });
}

const isBase64 = (str: string): boolean => {
    // Eliminar el prefijo si está presente
    const base64Data = str.split(',')[1] || str;

    try {
        // Verificar que la cadena sea Base64 válida
        return btoa(atob(base64Data)) === base64Data;
    } catch (err) {
        return false;
    }
}

export {
    base64toFile,
    isBase64
};