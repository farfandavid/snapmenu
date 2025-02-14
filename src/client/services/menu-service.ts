export const uploadImage = async (menuId: string, image: File) => {
    const formData = new FormData();
    formData.append("image", image);
    const response = await fetch(`/api/dashboard/menu/${menuId}/upload-image`, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) {
        const data = await response.json();
        throw JSON.stringify(data);
    }
    return response;
}