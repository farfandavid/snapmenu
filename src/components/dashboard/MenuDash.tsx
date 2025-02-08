import { useEffect, useState } from "react";
import Modal from "./Modal";
import type { IModalMessage } from "../../client/types/Interfaces";
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

    const [showModalMessage, setShowModalMessage] = useState<IModalMessage>({
        show: false,
        message: "",
        type: "success"
    });

    const [menus, setMenus] = useState([]);
    const [menuSelected, setMenuSelected] = useState<string>("");
    const [isSaved, setIsSaved] = useState(true);

    const styleSaved = isSaved ? "bg-green-500 hover:bg-green-400 disabled:hover:bg-green-500" : "bg-blue-500 hover:bg-blue-400 disabled:hover:bg-blue-500";


    return (
        <div className="w-full flex flex-col relative p-2 gap-2">
            <div className="border border-gray-300 p-3 rounded-md bg-slate-50 shadow sticky top-0 z-10">
                <h2 className="text-3xl font-bold mb-3">Edita tu información</h2>
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
                            onClick={async () => {

                            }} >
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
            <div className="border border-gray-300 p-3 rounded-md bg-slate-50">
                <h3 className="text-2xl font-bold mb-3">Imágenes de Perfil</h3>
                <div className="relative">
                    <div id="img-portrait" className="relative">
                        <img src="https://placehold.co/1280x480" className="rounded-t-xl w-full" alt="Profile Placeholder" />
                        <label htmlFor="portrait" className="w-full h-full hover:bg-black/40 opacity-0 hover:opacity-100 absolute top-0 rounded-t-xl">
                            <span className="text-xl font-bold text-slate-50 absolute top-1/2 left-1/2 transform -translate-x-1/2">Cambiar Portada</span>
                            <input type="file" name="portrait" id="portrait" className="opacity-0" />
                        </label>
                    </div>
                    <div id="img-logo" className="w-1/5 max-w-40 absolute bottom-4 left-5 z-10 transform translate-y-1/2 border-4 border-slate-50 rounded-full">
                        <img src="https://placehold.co/480x480" alt="" className="rounded-full" />
                        <label htmlFor="logo" className="w-full h-full hover:bg-black/40 opacity-0 hover:opacity-100 absolute top-0 rounded-full">
                            <span className="text-base font-bold text-slate-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-nowrap">Cambiar Logo</span>
                            <input type="file" name="logo" id="logo" className="opacity-0" />
                        </label>
                    </div>
                </div>
                <h2 className="text-3xl font-bold pt-16 px-5">Restaurant Name</h2>
            </div>
            <div className="border border-gray-300 p-3 rounded-md bg-slate-50">
                <h3 className="text-2xl font-bold mb-3">Información del Resturante</h3>
            </div>
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