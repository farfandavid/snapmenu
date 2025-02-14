import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import type { IModalMessage } from "../../client/types/Interfaces";
import Map from "./Map";
import { base64toFile, isBase64 } from "../../client/utils/convert";
import { uploadImage } from "../../client/services/menu-service";
import { CDN_URL } from "../../client/utils/constant";

interface IMenuInfo {
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
    phone?: string;
    map?: {
        lat: number;
        lng: number;
    };
    social?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
    };
}

export default function MenuDash() {

    const [showModalMessage, setShowModalMessage] = useState<IModalMessage>({
        show: false,
        message: "",
        type: "success"
    });

    const [menus, setMenus] = useState([]);
    const [menuSelected, setMenuSelected] = useState<string>("");
    const [isSaved, setIsSaved] = useState(true);
    const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
    const [menuLoading, setMenuLoading] = useState(false);
    const [menuInfo, setMenuInfo] = useState<IMenuInfo>({
        _id: "",
        name: "",
        description: "",
        logoUrl: "",
        bannerUrl: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
        map: {
            lat: 0,
            lng: 0
        },
        social: {
            facebook: "",
            instagram: "",
            twitter: ""
        }
    });
    const acceptAction = () => setShowModalMessage({ show: false, message: "", type: "success" });
    const lastLogo = useRef<string | null>(null);
    const lastBanner = useRef<string | null>(null);

    useEffect(() => {
        console.log("MenuInfo", menuInfo);
    }, [menuInfo]);

    useEffect(() => {
        setMenuSelected("");
        const fetchMenus = async () => {
            const data = await fetch("/api/dashboard/users/menus");
            const menus = await data.json();
            setMenus(menus);
            setIsSaved(true);
        };
        fetchMenus();
        setIsSaved(true);
    }, []);

    useEffect(() => {
        if (menuSelected === "") return;
        setMenuLoading(true);
        const fetchMenuInfo = async () => {
            const data = await fetch(`/api/dashboard/menu/${menuSelected}/info-menu`);
            const menuInfo = await data.json();
            lastLogo.current = menuInfo.logoUrl;
            lastBanner.current = menuInfo.bannerUrl;
            setMenuInfo(menuInfo);
            setCoords(menuInfo.map);
            console.log(menuInfo);
        };
        fetchMenuInfo()
            .then(() => setMenuLoading(false))
            .catch((error) => {
                console.error(error);
                setMenuLoading(false);
            });
    }, [menuSelected]);

    const handleChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target.files ? e.target.files[0] as File : null;
        if (!file) return;
        if (file.type.split("/")[0] !== "image") {
            setShowModalMessage({ show: true, message: "El archivo seleccionado no es una imagen", type: "error", acceptAction });
            return;
        }
        if (file.size > 1024 * 1024 * 2) {
            setShowModalMessage({ show: true, message: "El archivo seleccionado es muy grande. Debe ser menor a 2MB", type: "error", acceptAction });
            return;
        }
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (e.target.name === "bannerUrl") {
                    setMenuInfo({ ...menuInfo, bannerUrl: reader.result as string });
                } else if (e.target.name === "logoUrl") {
                    setMenuInfo({ ...menuInfo, logoUrl: reader.result as string });
                }
                setIsSaved(false);
            };
            reader.readAsDataURL(file);
        }
    }

    /* const uploadImages = async (logoFile?: File, bannerFile?: File) => {
        const promises = [];
        if (logoFile) {
            promises.push(fetch("/api/dashboard/upload", {
                method: "POST",
                body: JSON.stringify({ file: logoFile }),
                headers: {
                    "Content-Type": "application/json"
                }
            }));
        }
        if (bannerFile) {
            promises.push(fetch("/api/dashboard/upload", {
                method: "POST",
                body: JSON.stringify({ file: bannerFile }),
                headers: {
                    "Content-Type": "application/json"
                }
            }));
        }
        if (promises.length === 0) return {}
        const responses = await Promise.all(promises);
        const [logData, banData] = await Promise.all(responses.map(res => res.json()));

        return { logoUrl: logData.url, bannerUrl: banData.url };
    } */
    const handleSaveChanges = async () => {
        if (menuSelected === "") {
            setShowModalMessage({ show: true, message: "Selecciona un Menú para Guardar los Cambios", type: "error", acceptAction });
            return;
        }
        /* const res = await fetch(`/api/dashboard/menu/${menuSelected}/info-menu`, {
            method: "PUT",
            body: JSON.stringify({ ...menuInfo, map: coords }),
            headers: {
                "Content-Type": "application/json"
            }
        }) */
        // TEST
        const promises = [];
        if (isBase64(menuInfo.logoUrl || "")) {
            const logoImage = base64toFile(menuInfo.logoUrl || "", "logo");
            promises.push(uploadImage(menuSelected, logoImage));
        }
        if (isBase64(menuInfo.bannerUrl || "")) {
            const bannerImage = base64toFile(menuInfo.bannerUrl || "", "banner");
            promises.push(uploadImage(menuSelected, bannerImage));
        }
        setShowModalMessage({ show: true, message: "Guardando Cambios...", type: "waiting" });
        try {
            const results = await Promise.allSettled(promises);
            const data = await Promise.all(results.map(async (result) => {
                if (result.status === "fulfilled") {
                    const response = result.value;
                    if (!response.ok) {
                        throw new Error("Error al subir la imagen");
                    }
                    return response.json(); // Convertir la respuesta a JSON
                } else {
                    console.error(result.reason);
                    return JSON.parse(result.reason);
                }
            }));
            const unsuccessfulUploads = data.filter((res: any) => !res.success);
            const successfulUploads = data.filter((res: any) => res.success);

            const errorMessage = unsuccessfulUploads.length > 0 ? `No se ha logrado subir: ${unsuccessfulUploads.map(res => res.name).join(', ')}` : "";
            if (errorMessage !== "") {
                setShowModalMessage({ show: true, message: errorMessage, type: "error", acceptAction });
            }
            const logUrl = successfulUploads.find((res: any) => res.name === "logo")?.imageUrl;
            const banUrl = successfulUploads.find((res: any) => res.name === "banner")?.imageUrl;
            console.log(logUrl, banUrl);
            setMenuInfo((prev) => {
                return { ...prev, logoUrl: logUrl || lastLogo.current, bannerUrl: banUrl || lastBanner.current };
            });
        } catch (error) {
            //console.error(error);
            setShowModalMessage({ show: true, message: "Error al subir la imagen", type: "error", acceptAction });
        }
    }
    const styleSaved = isSaved ? "bg-green-500 hover:bg-green-400 disabled:hover:bg-green-500" : "bg-blue-500 hover:bg-blue-400 disabled:hover:bg-blue-500";

    return (
        <div className="w-full flex flex-col relative p-2 gap-2">
            <div className="border border-gray-300 p-3 rounded-md bg-slate-50 shadow sticky top-0 z-40">
                <h2 className="text-3xl font-bold mb-3">Edita la información del Restaurante</h2>
                <div className="flex max-sm:flex-col gap-2">
                    <select name="menus" id="slt-menus" required className="p-3 bg-gray-100 border border-gray-300 rounded-md ring-1 focus:ring-orange-500`" value={menuSelected}
                        onChange={(e) => {
                            let toMenu = e.target.value;
                            if (isSaved) {
                                setMenuSelected(e.target.value)
                                return
                            } else {
                                setShowModalMessage({
                                    show: true, message: "¿Estás seguro de cambiar de menú? Los cambios no guardados se perderán.", type: "warning"
                                    , acceptAction: () => {
                                        setShowModalMessage({ show: false, message: "", type: "success" });
                                        setMenuSelected(toMenu);
                                    }
                                    , cancelAction: () => {
                                        e.target.value = menuSelected;
                                        setShowModalMessage({ show: false, message: "", type: "success" });
                                    }
                                });
                            }
                        }}>
                        <option value="" disabled hidden>Selecciona tu Menú</option>
                        {menus.map((menu: any) => (
                            <option key={menu._id} value={menu._id} >{menu.name}</option>
                        ))}
                    </select>
                    <div className="flex gap-1 max-sm:text-sm">
                        <button type="button" className={`px-3 py-2 rounded-md text-white font-bold flex gap-2 items-center ${styleSaved} ${isSaved ? '' : 'animate-oscillateGradient'}`} disabled={isSaved}
                            onClick={handleSaveChanges} >
                            {isSaved ?
                                <>
                                    Sin Cambios<i className="bi bi-check-circle-fill"></i>
                                </> :
                                <>
                                    <i className="bi bi-floppy-fill"></i>Guardar Cambios!
                                </>}
                        </button>
                    </div>

                </div>
            </div>
            {menuLoading ? <div className="border border-gray-300 p-3 rounded-md bg-slate-50">
                <h3 className="bg-blue-100 border border-blue-400 text-blue-700 p-3 rounded-md mb-4">Cargando Información...</h3>
            </div> : menuSelected === "" ? <div className="border border-gray-300 p-3 rounded-md bg-slate-50">
                <h3 className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-md mb-4">Selecciona un Menú para Editar</h3>
            </div> :
                <>
                    <div className="border border-gray-300 p-3 rounded-md bg-slate-50">
                        <h3 className="text-2xl font-bold mb-3">Imágenes de Perfil</h3>
                        <div className="relative">
                            <div id="img-portrait" className="relative">
                                <img src={menuInfo.bannerUrl ? `${CDN_URL}${menuInfo.bannerUrl}` : "https://placehold.co/1280x480"} className="rounded-t-xl w-full h-auto object-cover aspect-[8/3]" alt="Profile Placeholder" />
                                <label htmlFor="bannerUrl" className="w-full h-full hover:bg-black/40 opacity-0 hover:opacity-100 absolute top-0 rounded-t-xl">
                                    <span className="text-xl font-bold text-slate-50 absolute top-1/2 left-1/2 transform -translate-x-1/2">Cambiar Portada</span>
                                    <input type="file" name="bannerUrl" id="bannerUrl" className="opacity-0" onChange={handleChangeImages} accept="image/jpeg, image/jpg, image/png, image/webp" />
                                </label>
                            </div>
                            <div id="img-logo" className="w-1/5 max-w-40 absolute bottom-4 left-5 z-10 transform translate-y-1/2 border-4 border-slate-50 rounded-full">
                                <img src={menuInfo.logoUrl ? `${CDN_URL}${menuInfo.logoUrl}` : "https://placehold.co/480x480"} alt="" className="rounded-full w-full h-auto object-cover aspect-square" />
                                <label htmlFor="logoUrl" className="w-full h-full hover:bg-black/40 opacity-0 hover:opacity-100 absolute top-0 rounded-full">
                                    <span className="text-base font-bold text-slate-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-nowrap">Cambiar Logo</span>
                                    <input type="file" name="logoUrl" id="logoUrl" className="opacity-0" onChange={handleChangeImages} accept="image/jpeg, image/jpg, image/png, image/webp" />
                                </label>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold pt-16 px-5">{menuInfo.name}</h2>
                    </div>
                    <div className="border border-gray-300 p-3 rounded-md bg-slate-50">
                        <h3 className="text-2xl font-bold mb-3">Información del Resturante</h3>
                        <form>
                            <div className="py-2 flex flex-col gap-2">
                                <label htmlFor="name" className="font-bold">Nombre</label>
                                <input type="text" name="name" id="name" className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md ring-1 focus:ring-orange-500" minLength={4} maxLength={50} placeholder="Nombre del Restaurante"
                                    value={menuInfo.name}
                                    onChange={
                                        (e) => {
                                            setMenuInfo({ ...menuInfo, name: e.target.value });
                                            setIsSaved(false);
                                        }
                                    } />
                            </div>
                            <div className="py-2 flex flex-col gap-2">
                                <label htmlFor="description" className="font-bold">Descripción</label>
                                <textarea name="description" id="description" className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md ring-1 focus:ring-orange-500" placeholder="Descripción del Restaurante" maxLength={250}
                                    value={menuInfo.description}
                                    onChange={
                                        (e) => {
                                            setMenuInfo({ ...menuInfo, description: e.target.value });
                                            setIsSaved(false);
                                        }
                                    }></textarea>
                            </div>
                            <div className="py-2 flex flex-col gap-2">
                                <label htmlFor="address" className="font-bold">Dirección</label>
                                <input type="text" name="address" id="address" className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md ring-1 focus:ring-orange-500" placeholder="Dirección" maxLength={250}
                                    value={menuInfo.address}
                                    onChange={
                                        (e) => {
                                            setMenuInfo({ ...menuInfo, address: e.target.value });
                                            setIsSaved(false);
                                        }
                                    } />
                            </div>
                            <div className="flex gap-2 max-sm:flex-col">
                                <div className="py-2 flex flex-col gap-2 w-full">
                                    <label htmlFor="city" className="font-bold">Ciudad</label>
                                    <input type="text" name="city" id="city" className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md ring-1" placeholder="Ciudad"
                                        value={menuInfo.city} maxLength={250}
                                        onChange={
                                            (e) => {
                                                setMenuInfo({ ...menuInfo, city: e.target.value });
                                                setIsSaved(false);
                                            }
                                        } />
                                </div>
                                <div className="py-2 flex flex-col gap-2 w-full">
                                    <label htmlFor="state" className="font-bold">Provincia</label>
                                    <input type="text" name="state" id="state" className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md ring-1" placeholder="Estado"
                                        value={menuInfo.state} maxLength={250}
                                        onChange={
                                            (e) => {
                                                setMenuInfo({ ...menuInfo, state: e.target.value });
                                                setIsSaved(false);
                                            }
                                        } />
                                </div>
                                <div className="py-2 flex flex-col gap-2 w-full">
                                    <label htmlFor="postalCode" className="font-bold">Código Postal</label>
                                    <input type="text" name="postalCode" id="postalCode" className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md ring-1" placeholder="Código Postal" maxLength={250}
                                        value={menuInfo.postalCode}
                                        onChange={
                                            (e) => {
                                                setMenuInfo({ ...menuInfo, postalCode: e.target.value });
                                                setIsSaved(false);
                                            }
                                        } />
                                </div>
                            </div>
                            <div className="py-2 flex flex-col gap-2">
                                <label htmlFor="country" className="font-bold">País</label>
                                <input type="text" name="country" id="country" className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md ring-1 focus:ring-orange-500" placeholder="País" maxLength={250}
                                    value={menuInfo.country}
                                    onChange={
                                        (e) => {
                                            setMenuInfo({ ...menuInfo, country: e.target.value });
                                            setIsSaved(false);
                                        }
                                    } />
                            </div>
                            <div className="py-2 flex flex-col gap-2">
                                <label htmlFor="mapUrl" className="font-bold">Mapa</label>
                                <input type="text" name="mapUrl" id="mapUrl" className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md ring-1 focus:ring-orange-500 hidden" placeholder="URL del Mapa" />
                                <Map onSelectedCoordinates={setCoords} initialCoordinates={coords} onChange={
                                    () => {
                                        setIsSaved(false);
                                    }
                                }></Map>
                            </div>
                            <h3 className="text-2xl font-bold my-3">Contacto</h3>
                            <div className="flex flex-col gap-2 py-2">
                                <label htmlFor="phone" className="font-bold">Whatsapp</label>
                                <input type="text" name="phone" id="phone" className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md ring-1 focus:ring-orange-500" placeholder="Whatsapp" maxLength={250}
                                    value={menuInfo.phone}
                                    onChange={
                                        (e) => {
                                            setMenuInfo({ ...menuInfo, phone: e.target.value });
                                            setIsSaved(false);
                                        }
                                    } />
                            </div>
                            <h3 className="text-2xl font-bold my-3">Redes Sociales</h3>
                            <div className="flex flex-col gap-2 py-2">
                                <label htmlFor="facebook" className="font-bold">Facebook</label>
                                <input type="text" name="facebook" id="facebook" className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md ring-1 focus:ring-orange-500" placeholder="Facebook" maxLength={450}
                                    value={menuInfo.social?.facebook}
                                    onChange={
                                        (e) => {
                                            setMenuInfo({ ...menuInfo, social: { ...menuInfo.social, facebook: e.target.value } });
                                            setIsSaved(false);
                                        }
                                    } />
                            </div>
                            <div className="flex flex-col gap-2 py-2">
                                <label htmlFor="instagram" className="font-bold">Instagram</label>
                                <input type="text" name="instagram" id="instagram" className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md ring-1 focus:ring-orange-500" placeholder="Instagram" maxLength={450}
                                    value={menuInfo.social?.instagram}
                                    onChange={
                                        (e) => {
                                            setMenuInfo({ ...menuInfo, social: { ...menuInfo.social, instagram: e.target.value } });
                                            setIsSaved(false);
                                        }
                                    } />
                            </div>
                            <div className="flex flex-col gap-2 py-2">
                                <label htmlFor="twitter" className="font-bold">Twitter</label>
                                <input type="text" name="twitter" id="twitter" className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md ring-1 focus:ring-orange-500" placeholder="Twitter" maxLength={450}
                                    value={menuInfo.social?.twitter}
                                    onChange={
                                        (e) => {
                                            setMenuInfo({ ...menuInfo, social: { ...menuInfo.social, twitter: e.target.value } });
                                            setIsSaved(false);
                                        }
                                    } />
                            </div>
                        </form>

                    </div>
                </>
            }
            <Modal key={"modal-message"} show={showModalMessage.show} handleClose={() => setShowModalMessage({ show: false, message: "", type: "success" })} >
                <div className={`w-full flex flex-col gap-2 items-center`}>
                    <h3 className={`text-xl font-bold`}>{showModalMessage.message}</h3>
                    {showModalMessage.type === "waiting" && <div className="text-2xl text-waiting animate-spin rounded-full h-10 w-10 flex items-center justify-center"><i className="bi bi-opencollective"></i></div>}
                    {showModalMessage.type === "error" && <i className="bi bi-x-circle-fill text-red-500 text-4xl"></i>}
                    {showModalMessage.type === "success" && <i className="bi bi-check-circle-fill text-green-500 text-4xl"></i>}
                    {showModalMessage.type === "warning" && <i className="bi bi-exclamation-triangle-fill text-yellow-500 text-4xl"></i>}
                    <div className="flex gap-2 w-full">
                        {showModalMessage.acceptAction &&
                            <button
                                className='px-3 py-2 bg-orange-500 hover:bg-orange-400 rounded-md text-white disabled:opacity-50 disabled:hover:bg-orange-500 font-bold mt-2 w-full'
                                onClick={() => showModalMessage.acceptAction!()}>Aceptar</button>}
                        {showModalMessage.cancelAction &&
                            <button
                                className='px-3 py-2 bg-red-500 hover:bg-red-400 rounded-md text-white disabled:opacity-50 disabled:hover:bg-rend-500 font-bold mt-2 w-full'
                                onClick={() => showModalMessage.cancelAction!()}
                            >Cancelar</button>}
                    </div>

                </div>
            </Modal>
        </div >
    )
}