import { useEffect, useRef, useState } from "react";
import CategoryTable from "./ProductTable";
import Modal from "./Modal";
import FormProduct from "./FormProduct";
import FormCategory from "./FormCategory";
import { type ICategory, type ISelectedItem, type IProduct } from '../../client/types/Interfaces';
import { addCategory, addProduct, deleteCategory, deleteProduct, saveAllCategories, updateCategory, updateProduct } from "../../client/services/products";

interface IModalMessage {
    show: boolean;
    message: string;
    type: "success" | "error" | "warning" | "waiting";
    acceptAction?: () => void;
    cancelAction?: () => void;
}

export default function ProductsMain() {

    // Lista de menus disponibles id, name
    const [menus, setMenus] = useState([]);
    const [menuSelected, setMenuSelected] = useState<string>("");
    const [dataCategories, setDataCategories] = useState<ICategory[]>([]);

    const [showProductForm, setShowProductForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showModalMessage, setShowModalMessage] = useState<IModalMessage>({
        show: false,
        message: "",
        type: "success"
    });

    const [selectedItem, setSelectedItem] = useState<ISelectedItem>({ category: undefined, product: undefined });
    const [isSaved, setIsSaved] = useState(true);
    const [productsLoading, setProductsLoading] = useState(false);

    // Usamos useRef para controlar si es la primera vez que se monta el componente
    const isInitialMount = useRef(true);
    const isMenuChanged = useRef(false);
    const acceptAction = () => setShowModalMessage({ show: false, message: "", type: "success" });


    // Primer useEffect: se ejecuta solo al comienzo
    useEffect(() => {
        setMenuSelected("");
        setSelectedItem({ category: undefined, product: undefined, menuId: "" });
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

    async function handleSaveCategory(data: ISelectedItem) {
        setShowCategoryForm(false);
        const formData = new FormData();
        formData.append("name", data.category?.name!);
        formData.append("active", data.category?.active! ? "true" : "false");
        formData.append("description", data.category?.description || "");

        if (data.category?._id) {
            formData.append("_id", data.category?._id);
            setShowModalMessage({ show: true, message: "Actualizando categoría...", type: "waiting" });
            await updateCategory(data.menuId!, formData)
                .then(async (response) => {
                    const res = await response.json();
                    setDataCategories((prev) => {
                        const newData = prev.map((category) => {
                            if (category._id === res._id) {
                                return res;
                            }
                            return category;
                        });
                        return newData;
                    });
                    setShowModalMessage({
                        show: true, message: "Categoría actualizada correctamente", type: "success", acceptAction
                    });
                })
                .catch((error) => {
                    setShowModalMessage({
                        message: error.message, show: true, type: "error", acceptAction
                    })
                })
                .finally(() => {
                    isMenuChanged.current = true;
                })

        } else {
            formData.append("_id", crypto.randomUUID());
            formData.append("products", JSON.stringify([]));
            setShowModalMessage({ show: true, message: "Agregando categoría...", type: "waiting" });
            await addCategory(data.menuId!, formData)
                .then(async (response) => {
                    const res = await response.json();
                    setDataCategories((prev) => {
                        if (data.category) {
                            return [...prev, { ...data.category, _id: res._id, }];
                        }
                        return prev;
                    });
                    setShowModalMessage({
                        show: true, message: "Categoría agregada correctamente", type: "success", acceptAction
                    });
                })
                .catch((error) => {
                    setShowModalMessage({
                        show: true, message: error.message, type: "error", acceptAction
                    });
                })
                .finally(() => {
                    isMenuChanged.current = true;
                });
        }
    }

    async function handleDeleteCategory(selectedItem: ISelectedItem) {
        setShowModalMessage({
            show: true, message: "¿Estás seguro de eliminar la categoría?", type: "warning", acceptAction: async () => {
                setShowModalMessage({ show: true, message: "Eliminando categoría...", type: "waiting" });
                await deleteCategory(menuSelected, selectedItem.category?._id!)
                    .then(() => {
                        setDataCategories((prev) => {
                            const newData = prev.filter(category => category._id !== selectedItem.category?._id);
                            return newData;
                        });
                        setShowModalMessage({
                            show: true, message: "Categoría eliminada correctamente", type: "success", acceptAction
                        });
                    })
                    .catch((error) => {
                        setShowModalMessage({
                            show: true, message: "Error al eliminar la categoría", type: "error", acceptAction
                        });
                    })
                    .finally(() => {
                        isMenuChanged.current = true;
                    });
            }, cancelAction: () => {
                setShowModalMessage({ show: false, message: "", type: "success", acceptAction });
            }
        })
    }

    async function handleSaveAll() {
        setShowModalMessage({ show: true, message: "Guardando cambios...", type: "waiting" });
        await saveAllCategories(selectedItem.menuId || "", dataCategories)
            .then(() => {
                setShowModalMessage({
                    show: true, message: "Cambios guardados correctamente", type: "success",
                    acceptAction: () => {
                        setShowModalMessage({ show: false, message: "", type: "success", acceptAction });
                    }
                });
            })
            .catch((error) => {
                setShowModalMessage({
                    show: true, message: "Error al guardar los cambios", type: "error",
                    acceptAction: () => {
                        setShowModalMessage({ show: false, message: "", type: "success", acceptAction });
                    }
                });
            })
            .finally(() => {
                setIsSaved(true);
            });
    }

    async function handleAddProduct({ category, product }: ISelectedItem) {
        setShowProductForm(false);
        if (!category || !product) {
            setShowModalMessage({
                show: true, message: "No se ha seleccionado una categoría", type: "error", acceptAction
            });
            return;
        }
        setShowModalMessage({ show: true, message: "Agregando producto...", type: "waiting" });
        await addProduct(menuSelected, { category, product })
            .then(() => {
                setDataCategories((prev) => {
                    const newData = prev.map((cat) => {
                        if (cat._id === category._id) {
                            return { ...cat, products: [...(cat.products || []), product] };
                        }
                        return cat;
                    });
                    return newData;
                });
                setShowModalMessage({
                    show: true, message: "Producto agregado correctamente", type: "success", acceptAction
                });
            })
            .catch((error) => {
                setShowModalMessage({
                    show: true, message: error.message, type: "error", acceptAction
                });
            })
            .finally(() => {
                isMenuChanged.current = true;
            });
    }

    async function handleUpdateProduct({ category, product }: ISelectedItem) {
        setShowProductForm(false);
        if (!category || !product) {
            setShowModalMessage({
                show: true, message: "No se ha seleccionado una categoría", type: "error", acceptAction
            });
            return;
        }
        setShowModalMessage({ show: true, message: "Actualizando producto...", type: "waiting" });
        await updateProduct(menuSelected, { category, product })
            .then(() => {
                setDataCategories((prev) => {
                    const newData = prev.map((cat) => {
                        if (cat._id === category._id) {
                            const newProducts = cat.products?.map((prod) => {
                                if (prod._id === product._id) {
                                    return product;
                                }
                                return prod;
                            });
                            return { ...cat, products: newProducts };
                        }
                        return cat;
                    });
                    return newData;
                });
                setShowModalMessage({
                    show: true, message: "Producto Actualizado Correctamente", type: "success", acceptAction
                });
            })
            .catch((error) => {
                setShowModalMessage({
                    show: true, message: error.message, type: "error", acceptAction
                });
            })
            .finally(() => {
                isMenuChanged.current = true;
            });
    }

    const styleSaved = isSaved ? "bg-green-500 hover:bg-green-400 disabled:hover:bg-green-500" : "bg-blue-500 hover:bg-blue-400 disabled:hover:bg-blue-500";

    return (
        <div className="w-full flex flex-col relative p-2 gap-2">
            <div className="border border-gray-300 p-3 rounded-md bg-slate-50 shadow sticky top-0 z-10">
                <h2 className="text-3xl font-bold mb-3">Gestiona tus Productos</h2>
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
                        <button type="button" className="px-3 py-2 bg-orange-500 hover:bg-orange-400 rounded-md text-white disabled:opacity-50 disabled:hover:bg-orange-500 font-bold flex gap-2 items-center"
                            onClick={(e) => {
                                setSelectedItem({ category: undefined, product: undefined, menuId: menuSelected });
                                setShowCategoryForm(true)
                            }}
                            disabled={selectedItem.menuId === ""}><i className="bi bi-plus-circle-fill"></i>Añadir Categoria</button>
                        <button type="button" className={`px-3 py-2 rounded-md text-white font-bold flex gap-2 items-center ${styleSaved} ${isSaved ? '' : 'animate-oscillateGradient'}`} disabled={isSaved}
                            onClick={async () => {
                                await handleSaveAll();
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
            {productsLoading ?
                <div className="bg-blue-100 border border-blue-400 text-blue-700 p-3 rounded-md mb-4">Cargando productos...</div>
                :
                menuSelected === "" ?
                    <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-md mb-4">Selecciona un menú para ver los productos</div> : dataCategories.map((category, index) => (
                        <CategoryTable key={category._id} data={category} setData={setDataCategories}
                            setShowProductForm={setShowProductForm}
                            setShowCategoryForm={setShowCategoryForm}
                            handleDeleteCategory={handleDeleteCategory}
                            setSelectedItem={setSelectedItem}
                            moveCategoryUp={moveCategoryUp}
                            moveCategoryDown={moveCategoryDown}
                            index={index}
                            handleDeleteProduct={async ({ category, product }) => {
                                setShowModalMessage({
                                    message: "¿Estás seguro de eliminar el producto?", show: true, type: "warning",
                                    acceptAction: async () => {
                                        setShowProductForm(false);
                                        setShowModalMessage({ show: true, message: "Eliminando producto...", type: "waiting" });
                                        await deleteProduct(menuSelected, product?._id!, category?._id!)
                                            .then(() => {
                                                setDataCategories((prev) => {
                                                    const newData = prev.map((cat) => {
                                                        if (cat._id === category?._id) {
                                                            const newProducts = cat.products?.filter((prod) => prod._id !== product?._id);
                                                            return { ...cat, products: newProducts };
                                                        }
                                                        return cat;
                                                    });
                                                    return newData;
                                                });
                                                setShowModalMessage({
                                                    show: true, message: "Producto eliminado correctamente", type: "success", acceptAction
                                                });
                                            })
                                            .catch((error) => {
                                                setShowModalMessage({
                                                    show: true, message: error.message, type: "error", acceptAction
                                                });
                                            })
                                            .finally(() => {
                                                isMenuChanged.current = true;
                                            });
                                    },
                                    cancelAction: () => {
                                        setShowModalMessage({ show: false, message: "", type: "success" });
                                    }
                                })
                                /*  await deleteProduct(menuSelected, selectedItem.product?._id!, selectedItem.category?._id!) */
                            }}
                        />
                    ))
            }
            <Modal key={"add-product"} show={showProductForm} handleClose={() => setShowProductForm(false)} >
                <FormProduct
                    handleSave={async ({ category, product }) => {
                        if (product?._id === "") {
                            let newProduct: IProduct = { ...product!, _id: crypto.randomUUID() };
                            await handleAddProduct({ category, product: newProduct });
                            return;
                        }
                        await handleUpdateProduct({ category, product });
                    }} selectedItem={selectedItem} />
            </Modal>

            <Modal key={"add-category"} show={showCategoryForm} handleClose={() => setShowCategoryForm(false)} >
                <FormCategory handleSave={handleSaveCategory} selectedItem={selectedItem} >

                </FormCategory>

            </Modal>
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
        </div>
    );
}