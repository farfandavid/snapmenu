import { useEffect, useState } from "react";

interface Menu {
    _id: string;
    name: string;
    categories: [];
    description: string;
    logoUrl: string;
    bannerUrl: string;
    address: string;
    phone: number;
    mapUrl: string;
    social: string[];
}

export default function MenuDash() {
    const [menuSelected, setMenuSelected] = useState({ social: ["", "", "", ""] } as Menu);
    const [menu, setMenu] = useState([]);
    const [id, setId] = useState("");
    const [image, setImage] = useState("");
    const [save, setSave] = useState(true);

    useEffect(() => {
        const fetchMenus = async () => {
            const response = await fetch("/api/menu/categories");
            const data = await response.json();
            console.log(data);
            setMenu(data.map(({ _id, name, description, logoUrl, bannerUrl, address, phone, mapUrl, social }: { _id: any, name: string, categories: [], description: string, logoUrl: string, bannerUrl: string, address: string, phone: number, mapUrl: string, social: string[] }) => ({ _id, name, description, logoUrl, bannerUrl, address, phone, mapUrl, social })));
            setImage(data[0].logoUrl);
            setMenuSelected(data[0]);
        };
        fetchMenus();
    }, []);

    const handleSubmitForm = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("menu", menuSelected._id);
        const data = await fetch("/api/menu/update", {
            method: "PUT",
            body: formData
        });
        const response = await data.json();
        console.log(response);
        if (response.error) {
            alert("Error al guardar");
            return;
        }
        if (response.success) {
            setSave(true);
            alert("Guardado correctamente");
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

    const handleSubmitImage = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("menu", menuSelected._id);
        formData.append("image", e.target[0].files[0]);
        const data = await fetch("/api/image", {
            method: "POST",
            body: formData
        });
        const response = await data.json();
        console.log(response);
        if (response.success) {
            setSave(true);
            alert("Imagen subida correctamente");
        }
        setImage(response.logoUrl);
    }
    return (
        <div className="flex flex-col h-full px-4 py-1" >
            <div className="flex gap-1 items-center">
                <h1 className="text-xl font-bold text-center">Menu</h1>
                <select name="menu" id="menu-select" onChange={(e) => setId(e.target.value)} defaultValue={menuSelected._id}
                    className="px-2 py-1 ring-1 ring-slate-600 rounded">
                    {menu.map((menu: any) => (
                        <option key={menu._id} value={menu._id}
                            className="rounded-none">{menu.name}</option>
                    ))}
                </select>
            </div>
            <form id="form-uploadImage" className="relative w-2/3 mx-auto mt-5" action="/api/image" method="post" onSubmit={handleSubmitImage}>

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
                            className="absolute inset-0 max-h-full mx-auto object-cover rounded-lg"
                            height="100%"
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
            </form>
            {/* <form action="/api/image/" method="post">
                <input id="inp-imglogo" type="file" title="Elije una image" accept="image/png, image/jpg, image/jpeg, image/webp" />
                <button type="submit">Upload</button>
            </form> */}
            <form id="form-info" action="/api/menu/update" method="put" className="mx-auto mb-0 mt-8 space-y-4 w-full md:w-2/3 py-5" onSubmit={handleSubmitForm}>
                <div>
                    <label htmlFor="bannerUrl" className="">Portada</label>
                    <div className="relative">
                        <input id="url-banner" type="text" name="bannerUrl" className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            required
                            placeholder="URL de la imagen de portada"
                            defaultValue={menuSelected.bannerUrl}
                        />
                        <span
                            className="absolute inset-y-0 end-0 grid place-content-center px-4 text-gray-500"
                        >
                            <i className="bi bi-card-image"></i>
                        </span>
                    </div>
                </div>
                <div>
                    <label htmlFor="phone" className="block">Whatsapp</label>
                    <span className="text-xs px-4">(Cód País) 54 (Cód Area) 3886 (Número sin el 15) 455301</span>
                    <div className="flex items-center relative">
                        <p className="text-xl">+</p>
                        <input name="phone" className="w-full rounded-lg border-gray-200 py-3 px-1  text-sm shadow-sm" id="num-state" type="number" placeholder="Ej: 543886455301"
                            defaultValue={menuSelected.phone} />

                    </div>

                </div>
                <div>
                    <label htmlFor="address" className="">Dirección</label>
                    <div className="flex flex-col gap-2">
                        <input name="address" id="menu-address-acr" type="text" className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm flex-1"
                            required
                            placeholder="Dirección corta (ej. Av. 1 de Mayo)"
                            defaultValue={menuSelected.address}
                        />
                        <div className="relative">
                            <input id="menu-address" name="mapUrl" type="url" className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                required
                                placeholder="Url de Google Maps"
                                onChange={(e) => e.target.value = getSrcFromIFrame(e.target.value)}
                                defaultValue={menuSelected.mapUrl}
                            />
                            <span
                                className="absolute inset-y-0 end-0 grid place-content-center px-4 text-gray-500"
                            >
                                <i className="bi bi-geo-alt"></i>
                            </span>
                        </div>
                    </div>

                </div>
                <div>
                    <label htmlFor="social-x" className="">X</label>
                    <div className="relative">
                        <input id="social-x" name="social-x" type="text" className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            defaultValue={menuSelected.social[0] || ''} />
                        <span
                            className="absolute inset-y-0 end-0 grid place-content-center px-4 text-gray-500"
                        >
                            <i className="bi bi-twitter-x"></i>
                        </span>
                    </div>
                </div>
                <div>
                    <label htmlFor="social-facebook" className="">Facebook</label>
                    <div className="relative">
                        <input name="social-facebook" id="social-facebook" type="text" className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            defaultValue={menuSelected.social[1] || ''} />
                        <span
                            className="absolute inset-y-0 end-0 grid place-content-center px-4 text-gray-500"
                        >
                            <i className="bi bi-facebook"></i>
                        </span>
                    </div>
                </div>
                <div>
                    <label htmlFor="social-instagram" className="">Instagram</label>
                    <div className="relative">
                        <input name="social-instagram" id="social-instagram" type="text" className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            defaultValue={menuSelected.social[2] || ''} />
                        <span
                            className="absolute inset-y-0 end-0 grid place-content-center px-4 text-gray-500"
                        >
                            <i className="bi bi-instagram"></i>
                        </span>
                    </div>
                </div>
                <div>
                    <label htmlFor="social-youtube" className="">Youtube</label>
                    <div className="relative">
                        <input name="social-youtube" id="social-youtube" type="text" className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            defaultValue={menuSelected.social[3] || ''} />
                        <span
                            className="absolute inset-y-0 end-0 grid place-content-center px-4 text-gray-500"
                        >
                            <i className="bi bi-youtube"></i>
                        </span>
                    </div>
                </div>
                <button type="submit" className="p-4 bg-orange-500 text-white rounded-lg w-full font-bold">Guardar</button>
            </form>
            <div id="tooltip" className={`absolute bg-blue-500 text-white px-3 py-2 gap-2 flex font-bold rounded-lg right-3 ${save ? "hidden" : ""}`}>
                <i id="tooltip-icon" className="bi bi-arrow-clockwise animate-spin"></i>
                Guardando
            </div>

        </div>
    )
}