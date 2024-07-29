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
    openingHours: { openH: string, closeH: string }[];
}

export default function HoursOpening() {
    const [menuSelected, setMenuSelected] = useState<Menu>();
    const [menus, setMenus] = useState<Menu[]>([]);
    const [toolTip, setToolTip] = useState({ show: false, message: "" });


    useEffect(() => {
        fetch("/api/dashboard/openingHours")
            .then((response) => response.json())
            .then((data) => {
                setMenus(data)
                setMenuSelected(data[0])
            })
    }, []);

    const showToolTip = (message: string) => {
        setToolTip({ show: true, message });
        setTimeout(() => {
            setToolTip({ show: false, message: "" });
        }, 3000);
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMenuSelected(menus.filter((menu) => menu._id === e.target.value)[0]);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData();
        formData.append("menu", menuSelected?._id || "");
        let openingHours = [
            {
                openH: form.open[6].value as string,
                closeH: form.close[6].value as string,
            },
            {
                openH: form.open[0].value as string,
                closeH: form.close[0].value as string,
            },
            {
                openH: form.open[1].value as string,
                closeH: form.close[1].value as string,
            },
            {
                openH: form.open[2].value as string,
                closeH: form.close[2].value as string,
            },
            {
                openH: form.open[3].value as string,
                closeH: form.close[3].value as string,
            },
            {
                openH: form.open[4].value as string,
                closeH: form.close[4].value as string,
            },
            {
                openH: form.open[5].value as string,
                closeH: form.close[5].value as string,
            },
        ];
        formData.append("openingHours", JSON.stringify(openingHours));
        await fetch("/api/dashboard/openingHours", {
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
            <div className="flex items-center gap-1">
                <h1>Selecciona un Menu:</h1>
                <select name="menus" id="slt-menu" onChange={handleChange} className="px-2 py-1 rounded shadow border">
                    {menus.map((menu) => (
                        <option key={menu._id} value={menu._id}>{menu.name}</option>
                    ))}
                </select>
            </div>

            <form className="flex flex-col gap-1" action="/api/menu/update" method="put" onSubmit={handleSubmit}>
                <div id="timetable" className="flex flex-col items-center">
                    <h1>Horarios de Apertura y Cierre</h1>
                    <div className="grid grid-cols-2 gap-1">
                        <fieldset className="col-span-1 space-x-1 border border-solid border-slate-400 px-1 py-2 rounded">
                            <legend>Lunes</legend>
                            <input type="time" className="px-1 rounded shadow-md" name="open" defaultValue={menuSelected?.openingHours.length ? menuSelected.openingHours[1].openH : ""} />
                            <input type="time" className="px-1 rounded shadow-md" name="close" defaultValue={menuSelected?.openingHours.length ? menuSelected.openingHours[1].closeH : ""} />
                        </fieldset>
                        <fieldset className="col-span-1 space-x-1 border border-solid border-slate-400 px-1 py-2 rounded">
                            <legend>Martes</legend>
                            <input type="time" className="px-1 rounded shadow-md" name="open"
                                defaultValue={menuSelected?.openingHours.length ? menuSelected.openingHours[2].openH : ""} />
                            <input type="time" className="px-1 rounded shadow-md" name="close" defaultValue={menuSelected?.openingHours.length ? menuSelected.openingHours[2].closeH : ""} />
                        </fieldset>
                        <fieldset className="col-span-1 space-x-1 border border-solid border-slate-400 px-1 py-2 rounded">
                            <legend>Miercoles</legend>
                            <input type="time" className="px-1 rounded shadow-md" name="open" defaultValue={menuSelected?.openingHours.length ? menuSelected.openingHours[3].openH : ""} />
                            <input type="time" className="px-1 rounded shadow-md" name="close" defaultValue={menuSelected?.openingHours.length ? menuSelected.openingHours[3].closeH : ""} />
                        </fieldset>
                        <fieldset className="col-span-1 space-x-1 border border-solid border-slate-400 px-1 py-2 rounded">
                            <legend>Jueves</legend>
                            <input type="time" className="px-1 rounded shadow-md" name="open" defaultValue={menuSelected?.openingHours.length ? menuSelected.openingHours[4].openH : ""} />
                            <input type="time" className="px-1 rounded shadow-md" name="close" defaultValue={menuSelected?.openingHours.length ? menuSelected.openingHours[4].closeH : ""} />
                        </fieldset>
                        <fieldset className="col-span-1 space-x-1 border border-solid border-slate-400 px-1 py-2 rounded">
                            <legend>Viernes</legend>
                            <input type="time" className="px-1 rounded shadow-md" name="open" defaultValue={menuSelected?.openingHours.length ? menuSelected.openingHours[5].openH : ""} />
                            <input type="time" className="px-1 rounded shadow-md" name="close" defaultValue={menuSelected?.openingHours.length ? menuSelected.openingHours[5].closeH : ""} />
                        </fieldset>
                        <fieldset className="col-span-1 space-x-1 border border-solid border-slate-400 px-1 py-2 rounded">
                            <legend>Sabado</legend>
                            <input type="time" className="px-1 rounded shadow-md" name="open" defaultValue={menuSelected?.openingHours.length ? menuSelected.openingHours[6].openH : ""} />
                            <input type="time" className="px-1 rounded shadow-md" name="close" defaultValue={menuSelected?.openingHours.length ? menuSelected.openingHours[6].closeH : ""} />
                        </fieldset>
                        <fieldset className="col-span-2 space-x-1 border border-solid border-slate-400 px-1 py-2 rounded flex justify-center">
                            <legend className="mx-auto">Domingo</legend>
                            <input type="time" className="px-1 rounded shadow-md" name="open" defaultValue={menuSelected?.openingHours.length ? menuSelected.openingHours[0].openH : ""} />
                            <input type="time" className="px-1 rounded shadow-md" name="close" defaultValue={menuSelected?.openingHours.length ? menuSelected.openingHours[0].closeH : ""} />
                        </fieldset>
                    </div>
                </div>
                <button type="submit" className="px-2 py-1 rounded shadow bg-orange-500 text-white">Guardar</button>
            </form>
            <div id="tool-tip" className={`bg-blue-500 p-2 absolute text-white rounded transition-all duration-300 ease-in-out flex gap-1 ${toolTip.show ? "right-3" : "-right-full"}`}>
                <p>{toolTip.message}</p>
                <i className="bi bi-info-circle-fill"></i>
            </div>
        </div>
    );
}