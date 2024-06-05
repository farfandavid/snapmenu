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
export const ProductTable = ({ index, table, editCategory, deleteCategory, enableEditCategory, editProduct, enableEditProduct, deleteProduct, addProduct }: { index: string, table: Category, editCategory: any, deleteCategory: any, enableEditCategory: any, editProduct: any, enableEditProduct: any, deleteProduct: any, addProduct: any }) => {
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
};