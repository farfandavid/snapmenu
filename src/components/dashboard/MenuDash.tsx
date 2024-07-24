import { useEffect, useState } from "react";
interface Menu {
    _id?: string;
    name?: string;
    description?: string;
    logoUrl?: string;
    bannerUrl?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: number;
    mapUrl?: string;
    social?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
    };
}

export default function MenuDash() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [menuSelected, setMenuSelected] = useState<Menu>();
    const [logo, setLogo] = useState("");
    const [banner, setBanner] = useState("");
    const [toolTip, setToolTip] = useState({ show: false, message: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [trigger, setTrigger] = useState(false);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await fetch("/api/dashboard/infoMenu", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then((response) => response.json())
                    .then((data) => {
                        if (data.error) {
                            setError(data.error)
                        }
                        setMenus(data);
                        setMenuSelected(data[0]);
                        return data
                    });
            } catch (error) {

            } finally {
                setLoading(false);
            }
        };
        fetchMenus();
    }, []);

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

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let changed = menus.filter((menu) => menu._id === e.target.value)[0]
        setMenuSelected({
            _id: changed._id,
            name: changed.name,
            description: changed.description || "",
            logoUrl: changed.logoUrl || "",
            bannerUrl: changed.bannerUrl || "",
            mapUrl: changed.mapUrl || "",
            address: changed.address || "",
            city: changed.city || "",
            state: changed.state || "",
            postalCode: changed.postalCode || "",
            country: changed.country || "",
            phone: changed.phone || 0,
            social: {
                facebook: changed.social?.facebook || "",
                instagram: changed.social?.instagram || "",
                twitter: changed.social?.twitter || ""
            }
        });
        setTrigger(!trigger);
    }

    const showToolTip = (message: string) => {
        setToolTip({ show: true, message });
        setTimeout(() => {
            setToolTip({ show: false, message: "" });
        }, 3000);
    }

    const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            showToolTip("El archivo no es una imagen");
            return;
        }
        if (file.size > 1024 * 1024 * 3) {
            showToolTip("El Logo debe ser menor a 3MB");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setLogo(reader.result as string);
        }
        reader.readAsDataURL(file);
        handleSaveLogo(file);
    }

    const handlePortrait = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            showToolTip("El archivo no es una imagen");
            return;
        }
        if (file.size > 1024 * 1024 * 3) {
            showToolTip("El Logo debe ser menor a 3MB");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setBanner(reader.result as string);
        }
        reader.readAsDataURL(file);
        handleSavePortrait(file);
    }

    const handleSaveLogo = async (file: File) => {
        if (!file) {
            showToolTip("No se ha proporcionado una imagen");
            return;
        }
        const formData = new FormData();
        formData.append("menu", menuSelected?._id || "");
        formData.append("logo", file);
        setToolTip({ show: true, message: "Subiendo imagen..." });
        const response = await fetch("/api/dashboard/logo", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        if (data.error) {
            showToolTip(data.error);
            return;
        }
        if (data.success) {
            showToolTip("Imagen subida correctamente");
            //setImage(data.logoUrl);
        }
    }

    const handleSavePortrait = async (file: File) => {
        if (!file) {
            showToolTip("No se ha proporcionado una imagen");
            return;
        }
        const formData = new FormData();
        formData.append("menu", menuSelected?._id || "");
        formData.append("portrait", file);
        setToolTip({ show: true, message: "Subiendo imagen..." });
        const response = await fetch("/api/dashboard/portrait", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        if (data.error) {
            showToolTip(data.error);
            return;
        }
        if (data.success) {
            showToolTip("Imagen subida correctamente");
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData();
        setToolTip({ show: true, message: "Guardando datos..." });
        formData.append("menu", menuSelected?._id || "");
        formData.append("description", form.description.value);
        formData.append("address", form.address.value);
        formData.append("city", form.city.value);
        formData.append("state", form.state.value);
        formData.append("postalCode", form.postalCode.value);
        formData.append("country", form.country.value);
        formData.append("mapUrl", form.mapUrl.value);
        formData.append("phone", form.phone.value);
        formData.append("facebook", form.facebook.value);
        formData.append("instagram", form.instagram.value);
        formData.append("twitter", form.twitter.value);
        const res = await fetch("/api/dashboard/infoMenu", {
            method: "PUT",
            body: formData
        })
        const data = await res.json();
        if (data.error) {
            showToolTip(data.error);
            return;
        }
        if (data.success) {
            showToolTip("Datos Guardados");
        }
    }
    if (loading) return <h1>Cargando...</h1>
    return (
        <div className="flex flex-col gap-1 p-2 relative overflow-x-hidden">
            <div className="flex items-center gap-1">
                <h1>Selecciona un Menu:</h1>
                <select name="menus" id="slt-menu" onChange={handleChange} className="px-2 py-1 rounded shadow border">
                    {menus.map((menu) => (
                        <option key={menu._id} value={menu._id}>{menu.name}</option>
                    ))}
                </select>
            </div>
            <div id="form-image" className="flex flex-col justify-center border-dotted border-2 relative border-orange-500 min-h-52 max-h-52 overflow-hidden" >
                <img src={menuSelected?.bannerUrl ? menuSelected.bannerUrl : `https://placehold.co/380x256/FAFAFA/FAFAFA`} alt="" className="object-contain absolute left-1/2 -translate-x-1/2 z-0" />
                <img src={menuSelected?.logoUrl ? menuSelected?.logoUrl : `https://placehold.co/250x250?text=${menuSelected?.name?.at(0)}`} alt="" className="h-32 object-contain absolute left-1/2 -translate-x-1/2" />
                <label className="absolute left-1/2 bottom-0 -translate-x-1/2 origin-center bg-orange-500 text-white rounded-full aspect-square flex items-center justify-center h-12 border-2 gap-1 font-bold px-2">
                    <input type="file" hidden accept="image/jpg, image/jpeg, image/png, iamge/webp" onChange={handleLogo} name="portrait" />
                    <i className="bi bi-camera-fill text-2xl"></i>
                    <p>Logo</p>
                </label>
                <label className="absolute right-0 top-0 origin-center bg-orange-500 text-white rounded-full aspect-square flex items-center justify-center h-12 border-2 gap-1 font-bold px-2 text-base">
                    <input type="file" hidden accept="image/jpg, image/jpeg, image/png, iamge/webp" onChange={handlePortrait} name="logo" />
                    <i className="bi bi-image "></i>
                    <p>Portada</p>
                </label>
            </div>
            <form className="flex flex-col gap-1" action="/api/menu/update" method="put" onSubmit={handleSubmit}>
                <label htmlFor="description" className="font-semibold">Descripcion</label>
                <input type="text" value={menuSelected?.description} onChange={(e) => setMenuSelected({ ...menuSelected, description: e.target.value })} name="description" required maxLength={150} autoComplete="off" className="px-2 py-1 rounded shadow border" />
                <label htmlFor="" className="font-semibold">Direccion</label>
                <label htmlFor="address" className="font-semibold">Calle</label>
                <input type="text" value={menuSelected?.address} onChange={(e) => setMenuSelected({ ...menuSelected, address: e.target.value })} name="address" required maxLength={50} className="px-2 py-1 rounded shadow border" />
                <label htmlFor="city" className="font-semibold">Ciudad</label>
                <input type="text" value={menuSelected?.city} onChange={(e) => setMenuSelected({ ...menuSelected, city: e.target.value })} name="city" required maxLength={50} className="px-2 py-1 rounded shadow border" />
                <label htmlFor="state" className="font-semibold">Provincia</label>
                <input type="text" value={menuSelected?.state} onChange={(e) => setMenuSelected({ ...menuSelected, state: e.target.value })} name="state" required maxLength={50} className="px-2 py-1 rounded shadow border" />
                <label htmlFor="postalCode" className="font-semibold">Codigo Postal</label>
                <input type="text" value={menuSelected?.postalCode} onChange={(e) => setMenuSelected({ ...menuSelected, postalCode: e.target.value })} name="postalCode" required maxLength={10} className="px-2 py-1 rounded shadow border" />
                <label htmlFor="country" className="font-semibold">Pais</label>
                <input type="text" value={menuSelected?.country} onChange={(e) => setMenuSelected({ ...menuSelected, country: e.target.value })} name="country" required maxLength={50} className="px-2 py-1 rounded shadow border" />
                <label htmlFor="mapUrl" className="font-semibold">Mapa <br />
                    <span className="text-xs">Copie y Pegue el IFrame desde Google Maps</span>
                </label>
                <input type="text" name="mapUrl" required autoComplete="off" className="px-2 py-1 rounded shadow border" value={menuSelected?.mapUrl} onChange={(e) => setMenuSelected({ ...menuSelected, mapUrl: getSrcFromIFrame(e.target.value) })} />
                <label htmlFor="phone" className="font-semibold">Whatsapp <br /> <span className="text-xs">ej: (Cod país) 549 (Cod Area) 3886 (Num) 112233</span></label>
                <div className="w-full flex items-center gap-1 relative">
                    <span className="font-bold absolute left-1">+</span>
                    <input type="number" value={menuSelected?.phone} onChange={(e) => setMenuSelected({ ...menuSelected, phone: parseInt(e.target.value) })} name="phone" required className="px-2 py-1 rounded shadow border w-full pl-4" />
                </div>

                <div className="grid grid-cols-1 gap-1">
                    <div className="col-span-1">
                        <h1 className="font-semibold">Facebook</h1>
                        <input className="w-full px-2 py-1 rounded shadow border" type="text" value={menuSelected?.social?.facebook} onChange={(e) => setMenuSelected({
                            ...menuSelected, social: {
                                ...menuSelected?.social,
                                facebook: e.target.value
                            }
                        })} name="facebook" maxLength={50} autoComplete="off" />
                    </div>
                    <div className="col-span-1">
                        <h1 className="font-semibold">Instagram</h1>
                        <input className="w-full px-2 py-1 rounded shadow border" type="text" value={menuSelected?.social?.instagram} onChange={(e) => setMenuSelected({
                            ...menuSelected, social: {
                                ...menuSelected?.social,
                                instagram: e.target.value
                            }
                        })} name="instagram" maxLength={50} autoComplete="off" />
                    </div>
                    <div className="col-span-1">
                        <h1 className="font-semibold">Twitter</h1>
                        <input className="w-full px-2 py-1 rounded shadow border" type="text" value={menuSelected?.social?.twitter} onChange={(e) => setMenuSelected({
                            ...menuSelected, social: {
                                ...menuSelected?.social,
                                twitter: e.target.value
                            }
                        })} name="twitter" maxLength={50} autoComplete="off" />
                    </div>
                </div>
                <input type="submit" value="Guardar" className="bg-orange-500 rounded p-2 text-white font-bold cursor-pointer hover:ring-1 hover:ring-orange-500 hover:bg-white hover:text-orange-500" />

            </form>
            <div id="tool-tip" className={`bg-blue-500 p-2 fixed z-10 text-white rounded transition-all duration-300 ease-in-out flex gap-1 ${toolTip.show ? "right-3" : "-right-full"}`}>
                <p>{toolTip.message}</p>
                <i className="bi bi-info-circle-fill"></i>
            </div>
        </div >
    )
}