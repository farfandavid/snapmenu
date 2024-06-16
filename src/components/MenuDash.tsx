import { useEffect, useState } from "react";

export default function MenuDash() {
    const [menuSelected, setMenuSelected] = useState("");
    const [menu, setMenu] = useState([]);
    const [image, setImage] = useState("");

    useEffect(() => {
        const fetchMenus = async () => {
            const response = await fetch("/api/menu/categories");
            const data = await response.json();
            setMenu(data.map(({ _id, name, categories }: { _id: any, name: string, categories: [] }) => ({ _id, name })));
            setMenuSelected(data[0]._id);
        };
        fetchMenus();
    }, []);

    const handleUpload = async (e: any) => {
        e.preventDefault();
        const formData = new FormData();
        const image = document.getElementById("inp-imglogo") as HTMLInputElement;
        if (image.files) {
            formData.append("image", image.files[0]);
            formData.append("menu", menuSelected);
            const res = await fetch("/api/image/", {
                method: "POST",
                body: formData
            });
            const { success, error } = await res.json();
            if (error) {
                alert(error);
            }
            if (success) {
                alert("Imagen subida correctamente");
            }
        }
    }

    const handleImageUpload = (e: any) => {
        const file = e.target.files[0];
        // Max 2MB
        const maxAllowedSize = 1024 * 1024 * 2;

        if (file) {
            console.log(file.size > maxAllowedSize);
            if (file.size > maxAllowedSize) {

                alert("La imagen es muy pesada");
                return;
            }
            const reader = new FileReader();
            reader.onload = (event: any) => {
                setImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleImageRemove = () => {
        setImage("");
    }

    const getSrcFromIFrame = (iframe: string) => {
        if (!iframe.startsWith("<iframe")) return "";
        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = iframe;
        let iframeElement = tempDiv.firstChild as HTMLIFrameElement;
        if (!iframeElement) return "";
        if (!iframeElement.src) return "";
        if (!iframeElement.src.startsWith("https://www.google.com/maps/embed")) return "";
        return iframeElement.src;
    }
    return (
        <div className="flex flex-col h-full px-4 py-1" onSubmit={handleUpload}>
            <div className="flex gap-1 items-center">
                <h1 className="text-xl font-bold text-center">Menu</h1>
                <select name="menu" id="menu-select" onChange={(e) => setMenuSelected(e.target.value)} defaultValue={menuSelected}
                    className="px-2 py-1 ring-1 ring-slate-600 rounded">
                    {menu.map((menu: any) => (
                        <option key={menu._id} value={menu._id}
                            className="rounded-none">{menu.name}</option>
                    ))}
                </select>
            </div>
            <div className="relative">

                <div className="relative min-w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer flex items-center justify-center bg-white">
                    <input
                        type="file"
                        accept="image/png, image/jpg, image/jpeg, image/webp"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        size={60}
                        onChange={handleImageUpload}
                    />
                    {image ? (
                        <img
                            src={image}
                            alt="Uploaded"
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <div className="text-gray-500 flex flex-col items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            <span>Click to upload image</span>
                        </div>
                    )}
                </div>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg">Guardar</button>
                <button id="btn-delete-image" type="button" className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={handleImageRemove}>Delete</button>
            </div>
            {/* <form action="/api/image/" method="post">
                <input id="inp-imglogo" type="file" title="Elije una image" accept="image/png, image/jpg, image/jpeg, image/webp" />
                <button type="submit">Upload</button>
            </form> */}
            <form action="" className="mx-auto mb-0 mt-8 space-y-4 w-2/3">
                <div>
                    <label htmlFor="" className="">Portada</label>
                    <div className="relative">
                        <input id="url-banner" type="text" className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            required
                            placeholder="URL de la imagen de portada"
                        />
                        <span
                            className="absolute inset-y-0 end-0 grid place-content-center px-4 text-gray-500"
                        >
                            <i className="bi bi-card-image"></i>
                        </span>
                    </div>
                </div>
                <div>
                    <label htmlFor="" className="">Whatsapp</label>
                    <div className="relative">
                        <input id="menu-whatsapp" type="text" className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            required
                            placeholder="Número de whatsapp"
                        />
                        <span
                            className="absolute inset-y-0 end-0 grid place-content-center px-4 text-gray-500"
                        >
                            <i className="bi bi-whatsapp"></i>
                        </span>
                    </div>
                </div>
                <div>
                    <label htmlFor="" className="">Dirección</label>
                    <div className="relative">
                        <input id="menu-addres" type="url" className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            required
                            placeholder="Dirección del negocio"
                            onChange={(e) => e.target.value = getSrcFromIFrame(e.target.value)}
                        />
                        <span
                            className="absolute inset-y-0 end-0 grid place-content-center px-4 text-gray-500"
                        >
                            <i className="bi bi-geo-alt"></i>
                        </span>
                    </div>
                </div>
                <div>
                    <label htmlFor="" className="">X</label>
                    <div className="relative">
                        <input id="social-x" type="url" className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm" />
                        <span
                            className="absolute inset-y-0 end-0 grid place-content-center px-4 text-gray-500"
                        >
                            <i className="bi bi-twitter-x"></i>
                        </span>
                    </div>
                </div>
                <div>
                    <label htmlFor="" className="">Facebook</label>
                    <div className="relative">
                        <input id="social-facebook" type="url" className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm" />
                        <span
                            className="absolute inset-y-0 end-0 grid place-content-center px-4 text-gray-500"
                        >
                            <i className="bi bi-facebook"></i>
                        </span>
                    </div>
                </div>
                <div>
                    <label htmlFor="" className="">Instagram</label>
                    <div className="relative">
                        <input id="social-instagram" type="url" className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm" />
                        <span
                            className="absolute inset-y-0 end-0 grid place-content-center px-4 text-gray-500"
                        >
                            <i className="bi bi-instagram"></i>
                        </span>
                    </div>
                </div>
                <div>
                    <label htmlFor="" className="">Youtube</label>
                    <div className="relative">
                        <input id="social-youtube" type="url" className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm" />
                        <span
                            className="absolute inset-y-0 end-0 grid place-content-center px-4 text-gray-500"
                        >
                            <i className="bi bi-youtube"></i>
                        </span>
                    </div>
                </div>
            </form>
        </div>
    )
}