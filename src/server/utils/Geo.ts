export default function extractCoordinatesFromUrl(url: string) {
    const regex = /!2d([-.\d]+)!3d([-.\d]+)/;
    const matches = url.match(regex);

    if (matches) {
        return {
            lat: parseFloat(matches[2]),
            lng: parseFloat(matches[1])
        };
    } else {
        return null
    }
}
// { lat: -23.818934931497694, lng: -64.79750951832597 }