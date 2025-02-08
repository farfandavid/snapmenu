import { type ICategory, type ISelectedItem, type IProduct } from '../../client/types/Interfaces';

interface IProps {
    index: number;
    data: ICategory;
    children?: React.ReactNode;
    setData: React.Dispatch<React.SetStateAction<ICategory[]>>;
    setShowProductForm: React.Dispatch<React.SetStateAction<boolean>>;
    setShowCategoryForm: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedItem: React.Dispatch<React.SetStateAction<ISelectedItem>>;
    moveCategoryUp: (index: number) => void;
    moveCategoryDown: (index: number) => void;
    handleDeleteProduct: (selectedItem: ISelectedItem) => void;
    handleDeleteCategory: (selectedItem: ISelectedItem) => void;
}

export default function CategoryTable({ children, index, data, setData, setShowProductForm, setSelectedItem, moveCategoryUp, moveCategoryDown, setShowCategoryForm, handleDeleteProduct, handleDeleteCategory }: IProps) {

    const moveProductUp = (index: number) => {
        if (index === 0) return;
        const newProducts = data.products ? [...data.products] : [];
        const [removed] = newProducts.splice(index, 1);
        newProducts.splice(index - 1, 0, removed);
        setData((prev) => {
            const updatedData = prev.map((category) => {
                if (category._id === data._id) {
                    category.products = newProducts;
                }
                return category;
            });
            return updatedData;
        });
    }

    const moveProductDown = (index: number) => {
        if (!data.products || index === data.products.length - 1) return;
        const newProducts = [...data.products];
        const [removed] = newProducts.splice(index, 1);
        newProducts.splice(index + 1, 0, removed);
        setData((prev) => {
            const updatedData = prev.map((category) => {
                if (category._id === data._id) {
                    category.products = newProducts;
                }
                return category;
            });
            return updatedData;
        });
    }
    return (
        <div className="border border-gray-300 p-3 rounded-md bg-slate-50 shadow" id={data._id}>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        <button type="button" className="h-7 w-7  bg-orange-500 hover:bg-orange-400 rounded-md text-white disabled:opacity-50 disabled:hover:bg-orange-500 font-bold flex gap-2 items-center justify-center" onClick={() => moveCategoryUp(index)}>
                            <i className="bi bi-caret-up-fill"></i>
                        </button>
                        <button type="button" className="h-7 w-7  bg-orange-500 hover:bg-orange-400 rounded-md text-white disabled:opacity-50 disabled:hover:bg-orange-500 font-bold flex gap-2 items-center justify-center" onClick={() => moveCategoryDown(index)}>
                            <i className="bi bi-caret-down-fill"></i>
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold">{data.name}</h2>
                </div>

                <div className="flex gap-2">
                    <button id='edit-category' className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 disabled:opacity-50 disabled:hover:bg-gray-100 font-bold" onClick={() => {
                        setSelectedItem((prev) => {
                            return { ...prev, category: data }
                        })
                        setShowCategoryForm(true)
                    }}>
                        <i className="bi bi-pencil-fill"></i>
                    </button>
                    <button id='delete-category' className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 disabled:opacity-50 disabled:hover:bg-gray-100 font-bold"
                        onClick={() => {
                            setSelectedItem((prev) => {
                                return { ...prev, category: data }
                            })
                            handleDeleteCategory({ category: data })
                        }}>
                        <i className="bi bi-trash-fill"></i>
                    </button>
                    <button id='add-product' className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 disabled:opacity-50 disabled:hover:bg-gray-100 font-bold" onClick={() => {
                        setSelectedItem((prev) => { return { ...prev, category: data, product: undefined } })
                        setShowProductForm(true)
                    }}>
                        <i className="bi bi-plus-lg"></i>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto w-full">
                <table className="border-collapse w-full min-w-[720px] py-5">
                    <thead>
                        <tr className="border-b text-left text-gray-500">
                            <th className="py-2 px-4 w-[10%]">Imagen</th>
                            <th className="py-2 px-4 w-[20%]">Nombre</th>
                            <th className="py-2 px-4 w-[15%]">Precio</th>
                            <th className="py-2 px-4 w-[30%]">Descripción</th>
                            <th className="py-2 px-4 w-[10%]">Activo</th>
                            <th className="py-2 px-4 w-[10%]">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.products?.map((product, index) => (
                            <tr key={product._id} className="border-b">
                                <td className="py-2 px-4 w-[10%]">
                                    <div className="w-12 h-12 bg-gray-200 rounded mx-auto"></div>
                                </td>
                                <td className="py-2 px-4 w-[20%]">{product.name}</td>
                                <td className="py-2 px-4 w-[15%]">{product.price}</td>
                                <td className="py-2 px-4 w-[30%]">{product.description}</td>
                                <td className="py-2 px-4 w-[10%]">
                                    <label
                                        htmlFor={product._id.toString()}
                                        className="bg-gray-300 border border-gray-400 has-[:checked]:bg-orange-500 flex has-[:checked]:border-orange-500 w-10 h-5 rounded-full relative transition-all duration-300 hover:cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            name={product._id.toString()}
                                            id={product._id.toString()}
                                            className={`hidden peer`}
                                            checked={product.active}
                                            onChange={(e) => {
                                                setData((prev) => {
                                                    const newData = prev.map((category) => {
                                                        if (category._id === data._id) {
                                                            category.products = category.products ? category.products.map((prod) => {
                                                                if (prod._id === product._id) {
                                                                    prod.active = e.target.checked;
                                                                }
                                                                return prod;
                                                            }) : [];
                                                        }
                                                        return category;
                                                    });
                                                    return newData;
                                                });
                                            }}
                                        />
                                        <span className={`bg-gray-100 border-gray-400 peer-checked:border-orange-500 border border-inherit h-full aspect-square rounded-full absolute peer-checked:right-0 top-1/2 transform -translate-y-1/2 transition-all duration-300`} ></span>

                                    </label>
                                </td>
                                <td className="py-2 px-4 flex space-x-2 w-[10%]">
                                    <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 disabled:opacity-50 disabled:hover:bg-gray-100 font-bold" onClick={() => {
                                        setSelectedItem((prev) => { return { ...prev, category: data, product: product } })
                                        setShowProductForm(true)
                                    }}>
                                        <i className="bi bi-pencil-fill"></i>
                                    </button>
                                    <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 disabled:opacity-50 disabled:hover:bg-gray-100 font-bold" onClick={() => {
                                        setSelectedItem((prev) => { return { ...prev, category: data, product: product } })
                                        handleDeleteProduct({ category: data, product: product })
                                    }}>
                                        <i className="bi bi-trash-fill"></i>
                                    </button>

                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <button className="h-6 w-10 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 disabled:opacity-50 disabled:hover:bg-gray-100 font-bold flex items-center justify-center" onClick={() => moveProductUp(index)}>
                                            <i className="bi bi-caret-up-fill"></i>
                                        </button>
                                        <button className="h-6 w-10 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 disabled:opacity-50 disabled:hover:bg-gray-100 font-bold flex items-center justify-center" onClick={() => moveProductDown(index)}>
                                            <i className="bi bi-caret-down-fill"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
};