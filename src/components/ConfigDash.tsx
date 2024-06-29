import { useState } from "react";

type OpeningHours = { open: string; close: string; }[];

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

export default function ConfigDash() {
    const [menuSelected, setMenuSelected] = useState<Menu>();
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData();
        formData.append("menu", menuSelected?._id || "");
        formData.append("description", form.description.value);
        let openingHours: OpeningHours = [];
        Array.from(form.open as RadioNodeList).forEach((input: Node, index: number) => {
            if (input instanceof HTMLInputElement) {
                openingHours.push({ open: input.value, close: form.close[index].value as string });
            }
        });
        formData.append("open", JSON.stringify(openingHours));
        /* (form.open as RadioNodeList).forEach((input: Node) => {
            if (input instanceof HTMLInputElement) {
                formData.append("open", input.value);
            }
        }); */
        console.log(JSON.parse(formData.getAll("open").toString()));
    }
    return (
        <form className="flex flex-col gap-1" action="/api/menu/update" method="put" onSubmit={handleSubmit}>
            <div id="timetable" className="flex flex-col items-center">
                <h1>Horarios de Apertura y Cierre</h1>
                <div className="grid grid-cols-2 gap-1">
                    <fieldset className="col-span-1 space-x-1 border border-solid border-slate-400 px-1 py-2 rounded">
                        <legend>Lunes</legend>
                        <input type="time" className="px-1 rounded shadow-md" name="open" />
                        <input type="time" className="px-1 rounded shadow-md" name="close" />
                    </fieldset>
                    <fieldset className="col-span-1 space-x-1 border border-solid border-slate-400 px-1 py-2 rounded">
                        <legend>Martes</legend>
                        <input type="time" className="px-1 rounded shadow-md" name="open" />
                        <input type="time" className="px-1 rounded shadow-md" name="close" />
                    </fieldset>
                    <fieldset className="col-span-1 space-x-1 border border-solid border-slate-400 px-1 py-2 rounded">
                        <legend>Miercoles</legend>
                        <input type="time" className="px-1 rounded shadow-md" name="open" />
                        <input type="time" className="px-1 rounded shadow-md" name="close" />
                    </fieldset>
                    <fieldset className="col-span-1 space-x-1 border border-solid border-slate-400 px-1 py-2 rounded">
                        <legend>Jueves</legend>
                        <input type="time" className="px-1 rounded shadow-md" name="open" />
                        <input type="time" className="px-1 rounded shadow-md" name="close" />
                    </fieldset>
                    <fieldset className="col-span-1 space-x-1 border border-solid border-slate-400 px-1 py-2 rounded">
                        <legend>Viernes</legend>
                        <input type="time" className="px-1 rounded shadow-md" name="open" />
                        <input type="time" className="px-1 rounded shadow-md" name="close" />
                    </fieldset>
                    <fieldset className="col-span-1 space-x-1 border border-solid border-slate-400 px-1 py-2 rounded">
                        <legend>Sabado</legend>
                        <input type="time" className="px-1 rounded shadow-md" name="open" />
                        <input type="time" className="px-1 rounded shadow-md" name="close" />
                    </fieldset>
                    <fieldset className="col-span-2 space-x-1 border border-solid border-slate-400 px-1 py-2 rounded flex justify-center">
                        <legend className="mx-auto">Domingo</legend>
                        <input type="time" className="px-1 rounded shadow-md" name="open" />
                        <input type="time" className="px-1 rounded shadow-md" name="close" />
                    </fieldset>
                </div>
            </div>
        </form>
    );
}