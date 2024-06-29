import React, { useEffect, useState } from "react";
import { ProductTable } from "./ProductTable";
import { Modal } from "./Modal";

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
    const [categories, setCategories] = useState([] as Category[]);
    const [save, setSave] = useState(false);
    const [trigger, setTrigger] = useState(false);

    const countProducts = categories.reduce((acc, table) => {
        return acc + table.products.length;
    }, 0);
    // Load
    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch("/api/menu/categories");
            const data = await response.json();
            setMenu(data.map(({ _id, name, categories }: { _id: any, name: string, categories: [] }) => ({ _id, name, categories })));
            setMenuSelected(data[0]._id);
            setCategories(data[0].categories);
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
                body: JSON.stringify({ menuId: menuSelected, categoriesData: categories })
            });
            const data = await res.json();
            setSave(false);
            setTrigger(false);
            setCategories(data.categories);
            alert("Saved");
        };
        try {
            setTimeout(savePost, 750);
        } catch (error) {
            console.error(error);
        }

    }, [trigger]);
    // Change Menu
    useEffect(() => {
        console.log(menuSelected);
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
            setCategories(data.categories);
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
        setCategories([...categories, {
            _id: crypto.randomUUID(),
            name: title,
            products: [],
            active: true
        }]);
        setShowModal(false);
    }

    const deleteCategory = (index: number) => {
        categories.splice(index, 1);
        setCategories([...categories]);
    }

    const editCategory = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newTables = categories.map((table, i) => {
            if (i !== index) {
                return table
            }
            return {
                ...table,
                name: event.target.value
            }
        });
        setCategories([...newTables])

    }

    // Products
    const addProduct = (index: number) => {
        categories[index].products.push({
            _id: crypto.randomUUID(),
            name: "Product Example",
            price: 300,
            description: "Description Example",
            quantity: 0,
            active: true
        });
        setCategories([...categories]);
    }

    const deleteProduct = (categoryIndex: number, productIndex: number) => {
        categories[categoryIndex].products.splice(productIndex, 1);
        setCategories([...categories]);
    }

    const editProduct = (categoryIndex: number, productIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newTables = categories.map((category, i) => {
            if (i !== categoryIndex) {
                return category
            }
            const newProducts = category.products.map((product, j) => {
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
                ...category,
                products: newProducts
            }
        });
        setCategories([...newTables]);
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
                        <p className="text-center text-slate-500">Categories: {categories.length}</p>
                        <p className="text-center text-slate-500">Total Products: {countProducts}/100</p>
                    </div>
                    <hr className="w-full border-slate-500" />
                </div>
            </div>
            {showModal && <Modal categories={categories} setCategories={setCategories} setShowModal={setShowModal} />}
            <div className="w-full flex flex-col items-center px-2">
                {categories.map((category, index) => {
                    return <ProductTable addProduct={addProduct} category={category} deleteCategory={deleteCategory} deleteProduct={deleteProduct} editCategory={editCategory} editProduct={editProduct} index={index} key={category._id}></ProductTable>
                })}
            </div>
        </div>
    );
}