interface IProduct {
    _id: string;
    name: string;
    price: number;
    description: string;
    active: boolean;
    quantity: number;
}

interface Category {
    _id: string;
    name: string;
    products: IProduct[];
    active: boolean;
}
export const ProductTable = ({ indexCat, category, editCategory, deleteCategory, editProduct, deleteProduct, addProduct, moveCatUp, moveCatDown }: { indexCat: number, category: Category, editCategory: any, deleteCategory: any, editProduct: any, deleteProduct: any, addProduct: any, moveCatUp: any, moveCatDown: any }) => {

    const changeClass = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (event.currentTarget.classList.contains("text-blue-500")) {
            event.currentTarget.classList.remove("text-blue-500");
            event.currentTarget.classList.add("text-green-500");
        } else {
            event.currentTarget.classList.remove("text-green-500");
            event.currentTarget.classList.add("text-blue-500");
        }
        event.currentTarget.childNodes.forEach((child) => {
            const icon = child as HTMLElement;
            if (icon.classList.contains("bi-pen-fill")) {
                icon.classList.remove("bi-pen-fill");
                icon.classList.add("bi-check-circle-fill");
            } else {
                icon.classList.remove("bi-check-circle-fill");
                icon.classList.add("bi-pen-fill");
            }
        });
    }


    const enableEditCategory = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        changeClass(event);
        event.currentTarget.parentElement?.parentElement?.querySelectorAll("input").forEach((input) => {
            if (input.hasAttribute("disabled")) {
                input.removeAttribute("disabled");
                input.classList.add("border-2");
                input.classList.add("border-white");
            } else {
                input.setAttribute("disabled", "true");
                input.classList.remove("border-2");
                input.classList.remove("border-white");
            }
        });
    }

    const enableEditProduct = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        changeClass(event);
        console.log(event.currentTarget.parentElement?.parentElement?.parentElement?.parentElement)
        event.currentTarget.parentElement?.parentElement?.parentElement?.parentElement?.querySelectorAll("[data-input]").forEach((input) => {
            if (input.hasAttribute("disabled")) {
                input.removeAttribute("disabled");
                input.classList.add("ring-blue-500");
                input.classList.add("ring-1");
            } else {
                input.setAttribute("disabled", "true");
                input.classList.remove("ring-blue-500");
                input.classList.remove("ring-1");
            }
        });
    }


    return (
        <div key={"table" + indexCat} id={"table" + indexCat} className="flex flex-col items-center bg-slate-50 mb-2 max-md:w-full w-2/3 rounded mt-2 shadow-lg border-2 border-slate-100">
            <div className="flex w-full justify-between bg-orange-400 p-2 rounded">
                <input className="text-white font-bold bg-transparent p-0 rounded" value={category.name} size={category.name.length} disabled onChange={(e) => editCategory(indexCat, e)} />
                <div>
                    <button onClick={() => deleteCategory(indexCat)} className="text-red-500 bg-slate-50 px-1 py-1 mx-1 rounded-full w-8 h-8 hover:ring-1 hover:ring-slate-500"><i className="bi bi-trash-fill"></i></button>
                    <button onClick={(e) => enableEditCategory(e)} className="text-blue-500 px-1 py-1 mx-1 rounded-full w-8 h-8 bg-slate-50 hover:ring-1 hover:ring-slate-500"><i className="bi bi-pen-fill"></i></button>
                    <button onClick={(e) => moveCatUp(indexCat)} className="text-blue-500 px-1 py-1 mx-1 rounded-full w-8 h-8 bg-slate-50 hover:ring-1 hover:ring-slate-500"><i className="bi bi-arrow-up"></i></button>
                    <button onClick={(e) => moveCatDown(indexCat)} className="text-blue-500 px-1 py-1 mx-1 rounded-full w-8 h-8 bg-slate-50 hover:ring-1 hover:ring-slate-500"><i className="bi bi-arrow-down"></i></button>
                </div>
            </div>
            {
                category.products.map((product, index) => {
                    return (
                        <div key={product._id} className="flex border w-full border-b-2 border-t-slate-400">
                            <div className="w-4/5 flex flex-col p-1">
                                <div className="flex">
                                    <div className="w-4/5 pr-1">
                                        <p className="font-bold text-sm">Nombre del Producto</p>
                                        <input className="bg-transparent p-0 rounded border w-full" value={product.name} size={product.name.length} disabled onChange={(e) => editProduct(indexCat, index, e)} data-input data-field="name" />
                                    </div>
                                    <div className="w-1/5">
                                        <p className="font-bold text-sm">Precio</p>
                                        <input className="bg-transparent p-0 rounded border w-full text-end" value={product.price} size={product.price.toString().length} disabled onChange={(e) => editProduct(indexCat, index, e)} data-input data-field="price" />
                                    </div>

                                </div>
                                <div className="">
                                    <p className="font-bold text-sm">Descripción</p>
                                    <textarea className="bg-transparent rounded border w-full" value={product.description} disabled onChange={(e) => editProduct(indexCat, index, e)} data-input data-field="description" ></textarea>

                                </div>
                            </div>
                            <div className="w-1/5 flex flex-col">
                                <div className="flex flex-col items-center w-full p-1">
                                    <p className="font-bold text-sm">Activo</p>
                                    <input type="checkbox" checked={product.active} onChange={(e) => editProduct(indexCat, index, e)} data-input data-field="active" disabled />
                                </div>
                                <div className="flex flex-col justify-center items-center h-full">
                                    <p className="font-bold text-sm">Acción</p>
                                    <div className="flex">
                                        <button onClick={() => deleteProduct(index)} className="text-red-500 bg-slate-200 mx-1 rounded-full w-7 h-7 hover:ring-1 hover:ring-slate-500"><i className="bi bi-trash-fill"></i></button>
                                        <button onClick={(e) => enableEditProduct(e)} className="text-blue-500 mx-1 rounded-full w-7 h-7 bg-slate-200 hover:ring-1 hover:ring-slate-500"><i className="bi bi-pen-fill"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
            <div className="flex w-full">
                <button className="bg-green-500 m-1 rounded w-full active:bg-green-500 hover:ring-1 ring-green-800 ring-inset hover:bg-green-700" onClick={() => addProduct(indexCat)}> <i className="bi bi-plus-square text-white"></i> </button>
            </div>
        </div>
    );
};