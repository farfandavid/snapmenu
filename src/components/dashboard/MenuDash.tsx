import { set } from "mongoose";
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
    social: {
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
                        console.log(data);
                        setMenus(data);
                        setMenuSelected(data[0]);
                        return data
                    });
            } catch (error) {
                set
            } finally {
                setLoading(false);
            }
        };
        fetchMenus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value);
        setMenuSelected(menus.filter((menu) => menu._id === e.target.value)[0]);
        //setImage(menus.filter((menu) => menu._id === e.target.value)[0].logoUrl);
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

    }

    const handleSaveLogo = async (file: File) => {
        //e.preventDefault();
        //const logoFile = e.currentTarget.logo.files?.[0] as File;

        if (!file) {
            showToolTip("No se ha proporcionado una imagen");
            return;
        }
        const formData = new FormData();
        formData.append("menu", menuSelected?._id || "");
        formData.append("logo", file);
        setToolTip({ show: true, message: "Subiendo imagen..." });
        const response = await fetch("/api/dashboard/image", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        console.log(data);
        if (data.error) {
            showToolTip(data.error);
            return;
        }
        if (data.success) {
            showToolTip("Imagen subida correctamente");
            //setImage(data.logoUrl);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData();
        formData.append("menu", menuSelected?._id || "");
        formData.append("description", form.description.value);
        formData.append("bannerUrl", form.bannerUrl.value);
        formData.append("address", form.address.value);
        formData.append("mapUrl", form.mapUrl.value);
        formData.append("phone", form.phone.value);
        (form.social as RadioNodeList).forEach((input: Node, index: number) => {
            if (input instanceof HTMLInputElement) {
                formData.append("social", input.value);
            }
        });
        await fetch("/api/menu/update", {
            method: "PUT",
            body: formData
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    showToolTip("Datos guardados correctamente");
                } else {
                    showToolTip("Error al guardar los datos");
                }
            }
            )
            .catch((error) => {
                showToolTip("Error al guardar los datos");
            });
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
            <form id="form-image" className="flex flex-col justify-center border-dotted border-2 relative border-orange-500 min-h-52 max-h-52 overflow-hidden" >
                <img src={banner === "" ? `https://placehold.co/380x256/FAFAFA/FAFAFA` : banner} alt="" className="object-contain absolute left-0 z-0" />
                <img src={menuSelected?.logoUrl ? menuSelected?.logoUrl : `https://placehold.co/250x250?text=${menuSelected?.name.at(0)}`} alt="" className="h-32 object-contain absolute left-1/2 -translate-x-1/2" />
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
                {/* <div className="flex flex-col gap-1 absolute">
                    <button className="h-10 bg-green-500 text-white rounded shadow-md cursor-pointer flex items-center px-2 gap-1 font-bold" type="submit">
                        <p>Subir</p>
                        <i className="bi bi-floppy-fill"></i>
                    </button>
                </div> */}
            </form>
            <form className="flex flex-col gap-1" action="/api/menu/update" method="put" onSubmit={handleSubmit}>
                <label htmlFor="">Descripcion</label>
                <input type="text" defaultValue={menuSelected?.description} name="description" required maxLength={150} autoComplete="off" className="px-2 py-1 rounded shadow border" />
                <label htmlFor="">Direccion Corta</label>
                <input type="text" defaultValue={menuSelected?.address} name="address" required maxLength={10} className="px-2 py-1 rounded shadow border" />
                <label htmlFor="">Mapa</label>
                <input type="text" defaultValue={menuSelected?.mapUrl} name="mapUrl" required autoComplete="off" className="px-2 py-1 rounded shadow border" />
                <label htmlFor="">Whatsapp <span className="text-xs">ej: (Cod país) 549 (Cod Area) 3886 (Num) 112233</span></label>
                <div className="w-full flex items-center gap-1 relative">
                    <span className="font-bold absolute left-1">+</span>
                    <input type="number" defaultValue={menuSelected?.phone} name="phone" required className="px-2 py-1 rounded shadow border w-full pl-4" />
                </div>

                <div className="grid grid-cols-1 gap-1">
                    <div className="col-span-1">
                        <h1>Facebook</h1>
                        <input className="w-full px-2 py-1 rounded shadow border" type="text" defaultValue={menuSelected?.social.facebook} name="social" maxLength={50} autoComplete="off" />
                    </div>
                    <div className="col-span-1">
                        <h1>Instagram</h1>
                        <input className="w-full px-2 py-1 rounded shadow border" type="text" defaultValue={menuSelected?.social.instagram} name="social" maxLength={50} autoComplete="off" />
                    </div>
                    <div className="col-span-1">
                        <h1>Twitter</h1>
                        <input className="w-full px-2 py-1 rounded shadow border" type="text" defaultValue={menuSelected?.social.twitter} name="social" maxLength={50} autoComplete="off" />
                    </div>
                </div>
                <input type="submit" value="Guardar" className="bg-orange-500 rounded p-2 text-white font-bold cursor-pointer hover:ring-1 hover:ring-orange-500 hover:bg-white hover:text-orange-500" />

            </form>
            <div id="tool-tip" className={`bg-blue-500 p-2 absolute text-white rounded transition-all duration-300 ease-in-out flex gap-1 ${toolTip.show ? "right-3" : "-right-full"}`}>
                <p>{toolTip.message}</p>
                <i className="bi bi-info-circle-fill"></i>
            </div>
        </div >
    )
}