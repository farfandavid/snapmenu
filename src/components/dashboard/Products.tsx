import { useEffect, useRef, useState } from "react";
import CategoryTable from "./ProductTable";
import Modal from "./Modal";
import FormProduct from "./FormProduct";
import FormCategory from "./FormCategory";
import { type ICategory, type ISelectedItem, type IProduct } from '../../client/types/Interfaces';
import { addCategory, deleteCategory } from "../../client/services/products";


export default function ProductsMain() {

    const [menus, setMenus] = useState([]);
    const [menuSelected, setMenuSelected] = useState<string>("");
    const [dataCategories, setDataCategories] = useState<ICategory[]>([]);

    const [showProductForm, setShowProductForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showDeleteCategory, setShowDeleteCategory] = useState(false);

    const [selectedItem, setSelectedItem] = useState<ISelectedItem>({ category: undefined, product: undefined });
    const [isSaved, setIsSaved] = useState(false);
    const [productsLoading, setProductsLoading] = useState(false);

    // Usamos useRef para controlar si es la primera vez que se monta el componente
    const isInitialMount = useRef(true);
    const isMenuChanged = useRef(false);

    // Primer useEffect: se ejecuta solo al comienzo
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

    // Segundo useEffect: se ejecuta cuando `data` cambia, excepto al comienzo
    useEffect(() => {
        if (isInitialMount.current) {
            // Si es la primera vez, no ejecutar la lógica
            isInitialMount.current = false; // Marcamos que ya no es la primera vez
        } else if (!isMenuChanged.current) {
            // Lógica que se ejecuta cuando `data` cambia, excepto al comienzo
            setIsSaved(false);
        }
        isMenuChanged.current = false;
    }, [dataCategories]);

    // TODO: Handle Errors
    useEffect(() => {
        console.log("Menu seleccionado: ", menuSelected);
        const fetchMenuData = async () => {
            const data = await fetch(`/api/dashboard/menu/${menuSelected}`);
            const menuData = await data.json();
            setDataCategories(menuData);
        };
        if (menuSelected !== "") {
            setProductsLoading(true);
            isMenuChanged.current = true;
            setIsSaved(true);
            setSelectedItem({ category: undefined, product: undefined, menuId: menuSelected });
            fetchMenuData().finally(() => setProductsLoading(false));
        }

    }, [menuSelected]);

    const moveCategoryUp = (index: number) => {
        if (index === 0) return;
        const newData = [...dataCategories];
        const [removed] = newData.splice(index, 1);
        newData.splice(index - 1, 0, removed);
        setDataCategories(newData);
    }

    const moveCategoryDown = (index: number) => {
        if (index === dataCategories.length - 1) return;
        const newData = [...dataCategories];
        const [removed] = newData.splice(index, 1);
        newData.splice(index + 1, 0, removed);
        setDataCategories(newData);
    }

    async function addCategoryToDB(data: ISelectedItem) {
        const formData = new FormData();
        formData.append("name", data.category?.name!);
        formData.append("active", data.category?.active! ? "true" : "false");
        formData.append("_id", crypto.randomUUID());
        formData.append("description", data.category?.description || "");
        formData.append("products", JSON.stringify([]));
        await addCategory(data.menuId!, formData)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al agregar la categoría");
                }
                setDataCategories((prev) => {
                    if (data.category) {
                        return [...prev, { ...data.category, _id: crypto.randomUUID(), }];
                    }
                    return prev;
                });
                //return response.json();
            })
            .catch((error) => {
                console.error(error);
                alert(error.message);
            })
            .finally(() => {
                setShowCategoryForm(false);
            });
    }

    const styleSaved = isSaved ? "bg-green-500 hover:bg-green-400 disabled:hover:bg-green-500" : "bg-blue-500 hover:bg-blue-400 disabled:hover:bg-blue-500";

    return (
        <div className="w-full flex flex-col relative p-2 gap-2">
            <div className="border border-gray-300 p-3 rounded-md bg-slate-50 shadow sticky top-0 z-10">
                <h2 className="text-3xl font-bold mb-3">Gestiona tus Productos</h2>
                <div className="flex max-sm:flex-col gap-2">
                    <select name="menus" id="slt-menus" required className="p-3 bg-gray-100 border border-gray-300 rounded-md ring-1 focus:ring-orange-500`" defaultValue={menuSelected!}
                        onChange={(e) => {
                            if (isSaved) {
                                setMenuSelected(e.target.value)
                                return
                            };
                            if (confirm("¿Estás seguro de cambiar de menú? Los cambios no guardados se perderán.")) {
                                setMenuSelected(e.target.value)
                            }
                        }}>
                        <option value="" disabled hidden>Selecciona tu Menú</option>
                        {menus.map((menu: any) => (
                            <option key={menu._id} value={menu._id}>{menu.name}</option>
                        ))}
                    </select>
                    <div className="flex gap-1 max-sm:text-sm">
                        <button type="button" className="px-3 py-2 bg-orange-500 hover:bg-orange-400 rounded-md text-white disabled:opacity-50 disabled:hover:bg-orange-500 font-bold flex gap-2 items-center"
                            onClick={(e) => setShowCategoryForm(true)}
                            disabled={menuSelected === "" ? true : false}><i className="bi bi-plus-circle-fill"></i>Añadir Categoria</button>
                        <button type="button" className={`px-3 py-2 rounded-md text-white font-bold flex gap-2 items-center ${styleSaved} ${isSaved ? '' : 'animate-oscillateGradient'}`} disabled={isSaved} onClick={() => setIsSaved(true)}>
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
            {productsLoading ?
                <div className="bg-blue-100 border border-blue-400 text-blue-700 p-3 rounded-md mb-4">Cargando productos...</div>
                :
                menuSelected === "" ?
                    <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-md mb-4">Selecciona un menú para ver los productos</div> : dataCategories.map((category, index) => (
                        <CategoryTable key={category._id} data={category} setData={setDataCategories}
                            setShowProductForm={setShowProductForm}
                            setShowCategoryForm={setShowCategoryForm}
                            setShowDeleteCategoryModal={setShowDeleteCategory}
                            setSelectedItem={setSelectedItem}
                            moveCategoryUp={moveCategoryUp}
                            moveCategoryDown={moveCategoryDown}
                            index={index}
                            handleDeleteCategory={async (data) => {
                                await deleteCategory(menuSelected, data.category?._id!)
                            }} />
                    ))
            }
            <Modal show={showProductForm} handleClose={() => setShowProductForm(false)} >
                <FormProduct
                    handleSave={(selectedItem) => {
                        console.log(selectedItem)
                        setDataCategories((prev) => {
                            const newData = prev.map((category) => {
                                console.log(selectedItem.category)
                                if (category._id === selectedItem.category?._id) {
                                    const existingProductIndex = category.products?.findIndex(product => product._id === selectedItem.product?._id);
                                    if (existingProductIndex !== undefined && existingProductIndex !== -1) {
                                        if (category.products) {
                                            category.products[existingProductIndex] = selectedItem.product!;
                                        }
                                    } else {
                                        category.products?.push(selectedItem.product!);
                                    }
                                }

                                return category;
                            })
                            return newData;
                        });
                        setShowProductForm(false);
                    }} selectedItem={selectedItem} setData={setDataCategories} />
            </Modal>

            <Modal show={showCategoryForm} handleClose={() => setShowCategoryForm(false)} >
                <FormCategory handleSave={addCategoryToDB} selectedItem={selectedItem} ></FormCategory>
            </Modal>
            <Modal show={showDeleteCategory} handleClose={() => setShowDeleteCategory(false)} >
                <>
                    <h2 className="text-xl font-bold mb-2">¿Estás seguro de eliminar la categoría?</h2>
                    <div className="flex justify-around gap-2">
                        <button type="button" className="px-3 py-2 bg-blue-500 hover:bg-blue-400 rounded-md text-white font-bold" onClick={() => setShowDeleteCategory(false)}>Cancelar</button>
                        <button type="button" className="px-3 py-2 bg-red-500 hover:bg-red-400 rounded-md text-white font-bold"
                            onClick={() => {
                                console.log(selectedItem)
                                setShowDeleteCategory(false)
                            }}>Eliminar</button>
                    </div>
                </>
            </Modal>
        </div>
    );
}