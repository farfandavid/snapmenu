function extractCoordinatesFromUrl(url: string) {
    const regex = /!2d([-.\d]+)!3d([-.\d]+)/;
    const matches = url.match(regex);

    if (matches) {
        return {
            lat: parseFloat(matches[2]),
            lng: parseFloat(matches[1])
        };
    } else {
        throw new Error('No se pudieron extraer las coordenadas de la URL.');
    }
}

const url = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2580.9330720624093!2d-64.79750951832597!3d-23.818934931497694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941ac19041466cc1%3A0xa4b95bba6bbe37d8!2sParador%20Punto%20Medio!5e0!3m2!1ses!2sar!4v1721251624964!5m2!1ses!2sar";
const coordinates = extractCoordinatesFromUrl(url);

console.log(coordinates); // { lat: -23.818934931497694, lng: -64.79750951832597 }