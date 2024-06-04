import React, { useEffect, useState } from "react";

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

export default function ProductsMain() {
    const [menu, setMenu] = useState([]);
    const [menuSelected, setMenuSelected] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [tables, setTables] = useState([] as Category[]);
    const [save, setSave] = useState(false);
    const [trigger, setTrigger] = useState(false);

    const countProducts = tables.reduce((acc, table) => {
        return acc + table.products.length;
    }, 0);
    // Load
    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch("/api/menu/categories");
            const data = await response.json();
            setMenu(data.map(({ _id, name, categories }: { _id: any, name: string, categories: [] }) => ({ _id, name, categories })));
            setMenuSelected(data[0]._id);
            setTables(data[0].categories);
        };
        fetchCategories();

    }, []);

    // Save
    useEffect(() => {
        if (!trigger) return;
        setSave(true);
        const savePost = async () => {
            const res = await fetch("/api/menu/categories", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ menuId: menuSelected, categoriesData: tables })
            });
            const data = await res.json();
            setSave(false);
            setTrigger(false);
            setTables(data.categories);
            alert("Saved");
        };
        setTimeout(savePost, 750);
    }, [trigger]);

    // Change Menu
    useEffect(() => {
        if (!menuSelected) return;
        const changeMenu = async () => {
            const response = await fetch("/api/menu/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ menuId: menuSelected })
            });
            const data = await response.json();
            setTables(data.categories);
        };
        changeMenu();
    }, [menuSelected]);
    // Categories
    const addCategory = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const title = (document.getElementById("titleCategory") as HTMLInputElement).value;
        if (!title) {
            return;
        }
        setTables([...tables, {
            _id: crypto.randomUUID(),
            name: title,
            products: [],
            active: true
        }]);
        setShowModal(false);
    }

    const deleteCategory = (index: number) => {
        tables.splice(index, 1);
        setTables([...tables]);
    }

    const editCategory = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newTables = tables.map((table, i) => {
            if (i !== index) {
                return table
            }
            return {
                ...table,
                name: event.target.value
            }
        });
        setTables([...newTables])

    }

    const enableEditCategory = (index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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

    // Products
    const addProduct = (index: number) => {
        tables[index].products.push({
            _id: crypto.randomUUID(),
            name: "Product Example",
            price: 300,
            description: "Description Example",
            quantity: 0,
            active: true
        });
        setTables([...tables]);
    }

    const deleteProduct = (categoryIndex: number, productIndex: number) => {
        tables[categoryIndex].products.splice(productIndex, 1);
        setTables([...tables]);
    }

    const editProduct = (categoryIndex: number, productIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newTables = tables.map((table, i) => {
            if (i !== categoryIndex) {
                return table
            }
            const newProducts = table.products.map((product, j) => {
                if (j !== productIndex) {
                    return product
                }
                switch (event.target.dataset.field) {
                    case "name":
                        return {
                            ...product,
                            name: event.target.value
                        }
                    case "description":
                        return {
                            ...product,
                            description: event.target.value
                        }
                    case "price":
                        return {
                            ...product,
                            price: parseFloat(event.target.value)
                        }
                    default:
                        return product;
                }
            });
            return {
                ...table,
                products: newProducts
            }
        });
        setTables([...newTables]);
    }

    const enableEditProduct = (categoryIndex: number, productIndex: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        /* document.getElementById("productId" + productIndex + "categoryId" + categoryIndex)?.querySelectorAll("input").forEach((input) => {
            input.removeAttribute("disabled");
        }); */
        changeClass(event);
        event.currentTarget.parentElement?.parentElement?.parentElement?.querySelectorAll("input").forEach((input) => {
            if (input.hasAttribute("disabled")) {
                input.removeAttribute("disabled");
            } else {
                input.setAttribute("disabled", "true");
            }
        });
    }

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
    return (
        <div className="w-full flex flex-col items-center relative p-0">
            <div className="sticky top-0 flex flex-col justify-between w-full items-center gap-1 bg-white m-0 px-4 pt-1">
                <div className="flex justify-between w-full">
                    <div className="flex gap-1 items-center">
                        <h1 className="text-xl font-bold text-center">Menu</h1>
                        <select name="menu" id="menu-select" onChange={(e) => setMenuSelected(e.target.value)} defaultValue={menuSelected}
                            className="px-2 py-1 ring-1 ring-slate-600 rounded">
                            {menu.map((menu: any) => (
                                <option key={menu._id} value={menu._id}
                                    className="rounded-none">{menu.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex">
                        <button className=" bg-orange-500 px-2 py-1 rounded text-white flex justify-center items-center mx-1" onClick={() => setShowModal(!showModal)}><i className="bi bi-plus-circle-fill text-xl mx-1"></i>Add Category</button>
                        <button className="bg-blue-500 text-white px-2 py-1 rounded flex justify-center items-center mx-1 disabled:bg-blue-300" disabled={trigger} onClick={() => setTrigger(!trigger)}>
                            {save ? <i className="bi bi-hourglass animate-spin text-xl mx-1"></i> : <i className="bi bi-floppy-fill text-xl mx-1"></i>} Save</button>
                    </div>
                </div>

                <div className="flex flex-col items-start w-full">
                    <div className="flex gap-2">
                        <p className="text-center text-slate-500">Categories: {tables.length}</p>
                        <p className="text-center text-slate-500">Total Products: {countProducts}/100</p>
                    </div>
                    <hr className="w-full border-slate-500" />
                </div>
            </div>
            {showModal &&
                <div id="modal" className="w-screen h-screen bg-slate-500/50 fixed left-0 top-0 flex justify-center items-center">
                    <div className="flex bg-white flex-col p-4 items-center justify-center rounded border-2">
                        <h1>Category Name</h1>
                        <form onSubmit={(e) => addCategory(e)}>
                            <input id="titleCategory" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                            <div className="mt-2 w-full justify-center items-center flex">
                                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-1" type="submit">Save</button>
                                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-1" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>

                    </div>
                </div>}
            <div className="w-full flex flex-col items-center px-2">
                {tables.map((table, index) => {
                    return (
                        <div key={"table" + index} id={"table" + index} className="flex flex-col items-center bg-slate-50 mb-2 max-md:w-full w-2/3 rounded mt-2 shadow-lg border-2 border-slate-100">
                            <div className="flex w-full justify-between bg-orange-400 p-2 rounded">
                                <input className="text-white font-bold bg-transparent p-0 rounded" value={table.name} size={table.name.length} disabled onChange={(e) => editCategory(index, e)} />
                                <div>
                                    <button onClick={() => deleteCategory(index)} className="text-red-500 bg-slate-50 px-1 py-1 mx-1 rounded-full w-8 h-8 hover:ring-1 hover:ring-slate-500"><i className="bi bi-trash-fill"></i></button>
                                    <button onClick={(e) => enableEditCategory(index, e)} className="text-blue-500 px-1 py-1 mx-1 rounded-full w-8 h-8 bg-slate-50 hover:ring-1 hover:ring-slate-500"><i className="bi bi-pen-fill"></i></button>
                                </div>
                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="py-1">Name</th>
                                        <th className="py-1">Description</th>
                                        <th className="py-1">Price</th>
                                        <th className="py-1">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.products.map((product, indexProduct) => (
                                        <tr key={product._id.toString()} id={product._id.toString()} className="max-md:text-xl ">

                                            <td className="border">
                                                <input
                                                    type="text"
                                                    data-field="name"
                                                    value={product.name}
                                                    onChange={(e) => editProduct(index, indexProduct, e)}
                                                    disabled
                                                    className="border p-1 w-full active:bg-white active:border-blue-300 disabled:bg-gray-50 enabled:bg-white enabled:border-blue-300 enabled:ring-1 ring-blue-300 text-wrap break-words"
                                                />
                                            </td>
                                            <td className="border">
                                                <input
                                                    type="text"
                                                    value={product.description}
                                                    data-field="description"
                                                    onChange={(e) => editProduct(index, indexProduct, e)}
                                                    disabled
                                                    className="border p-1 w-full active:bg-white active:border-blue-300 disabled:bg-gray-50 enabled:bg-white enabled:border-blue-300 enabled:ring-1 ring-blue-300 text-wrap break-words"
                                                />
                                            </td>
                                            <td className="border">
                                                <input
                                                    type="number"
                                                    value={product.price}
                                                    data-field="price"
                                                    onChange={(e) => editProduct(index, indexProduct, e)}
                                                    disabled
                                                    className="border p-1 w-full active:bg-white active:border-blue-300 disabled:bg-gray-50 enabled:bg-white enabled:border-blue-300 enabled:ring-1 ring-blue-300 text-wrap break-words"
                                                />
                                            </td>
                                            <td className="border">
                                                <div className="flex max-md:text-3xl gap-1 items-center justify-center">
                                                    <button
                                                        className=" text-red-500 px-1 rounded hover:ring-1 ring-slate-500"
                                                        onClick={() => deleteProduct(index, indexProduct)}
                                                    ><i className="bi bi-trash-fill"></i></button>
                                                    <button
                                                        className="text-blue-500 px-1 rounded hover:ring-1 ring-slate-500"
                                                        onClick={(e) => enableEditProduct(index, indexProduct, e)}
                                                    ><i className="bi bi-pen-fill"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                            <div className="flex w-full">
                                <button className="bg-green-500 m-1 rounded w-full active:bg-green-500 hover:ring-1 ring-green-800 ring-inset hover:bg-green-700" onClick={() => addProduct(index)}> <i className="bi bi-plus-square text-white"></i> </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}