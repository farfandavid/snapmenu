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
    const [menus, setMenus] = useState<Menu[]>([]);
    const [menuSelected, setMenuSelected] = useState<Menu>();
    const [image, setImage] = useState("");
    const [toolTip, setToolTip] = useState({ show: false, message: "" });

    useEffect(() => {
        fetch("/api/menu/categories")
            .then((response) => response.json())
            .then((data) => {
                setMenus(data)
                setMenuSelected(data[0])
                setImage(data[0].logoUrl)
            })
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value);
        setMenuSelected(menus.filter((menu) => menu._id === e.target.value)[0]);
        setImage(menus.filter((menu) => menu._id === e.target.value)[0].logoUrl);
    }

    const showToolTip = (message: string) => {
        setToolTip({ show: true, message });
        setTimeout(() => {
            setToolTip({ show: false, message: "" });
        }, 3000);
    }

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            setImage(reader.result as string);
        }
        reader.readAsDataURL(file);
    }

    const handleSaveImage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const imageFile = e.currentTarget.image.files?.[0] as File;
        if (!imageFile) {
            showToolTip("No se ha proporcionado una imagen");
            return;
        }
        const formData = new FormData();
        formData.append("menu", menuSelected?._id || "");
        formData.append("image", e.currentTarget.image.files?.[0] || "");
        setToolTip({ show: true, message: "Subiendo imagen..." });
        const response = await fetch("/api/image", {
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
    return (
        <div className="flex flex-col gap-1 p-2 relative overflow-x-hidden">
            <div className="flex">
                <h1>Selecciona un Menu:</h1>
                <select name="menus" id="slt-menu" onChange={handleChange}>
                    {menus.map((menu) => (
                        <option key={menu._id} value={menu._id}>{menu.name}</option>
                    ))}
                </select>
            </div>
            <form id="form-image" className="flex flex-col justify-center border-dotted border-2 relative" onSubmit={handleSaveImage}>
                <img src={image === "" ? "https://imageplaceholder.net/600x400/eeeeee/131313?text=Logo" : image} alt="" className="h-32 object-contain" />
                <label className="mx-auto my-1">
                    <input type="file" hidden accept="image/jpg, image/jpeg, image/png, iamge/webp" onChange={handleImage} name="image" />
                    <div className="flex w-28 h-9 px-2 flex-col bg-orange-500 rounded-full shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none hover:ring-1 hover:ring-orange-500 hover:bg-white hover:text-orange-500">Elegir Imagen</div>
                </label>
                <div className="flex flex-col gap-1 absolute top-0 right-0">
                    <button className="h-10 bg-green-500 text-white rounded shadow-md cursor-pointer flex items-center px-2 gap-1 font-bold" type="submit">
                        <p>Subir</p>
                        <i className="bi bi-floppy-fill"></i>
                    </button>
                </div>
            </form>
            <form className="flex flex-col gap-1" action="/api/menu/update" method="put" onSubmit={handleSubmit}>
                <label htmlFor="">Descripcion</label>
                <input type="text" defaultValue={menuSelected?.description} name="description" required maxLength={150} autoComplete="off" />
                <label htmlFor="">Imagen Portada</label>
                <input type="text" defaultValue={menuSelected?.bannerUrl} name="bannerUrl" required autoComplete="off" />
                <label htmlFor="">Direccion Corta</label>
                <input type="text" defaultValue={menuSelected?.address} name="address" required maxLength={10} />
                <label htmlFor="">Mapa</label>
                <input type="text" defaultValue={menuSelected?.mapUrl} name="mapUrl" required autoComplete="off" />
                <label htmlFor="">Whatsapp</label>
                <input type="number" defaultValue={menuSelected?.phone} name="phone" required />
                <div className="grid grid-cols-2 gap-1">
                    <div className="col-span-1">
                        <h1>Facebook</h1>
                        <input className="w-full" type="text" defaultValue={menuSelected?.social[0]} name="social" maxLength={50} autoComplete="off" />
                    </div>
                    <div className="col-span-1">
                        <h1>Instagram</h1>
                        <input className="w-full" type="text" defaultValue={menuSelected?.social[1]} name="social" maxLength={50} autoComplete="off" />
                    </div>
                    <div className="col-span-1">
                        <h1>Twitter</h1>
                        <input className="w-full" type="text" defaultValue={menuSelected?.social[2]} name="social" maxLength={50} autoComplete="off" />
                    </div>
                    <div className="col-span-1">
                        <h1>Youtube</h1>
                        <input className="w-full" type="text" defaultValue={menuSelected?.social[3]} name="social" maxLength={50} autoComplete="off" />
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