import React, { useEffect, useState } from 'react';
import { type ICategory, type ISelectedItem, type IProduct } from '../../client/types/Interfaces';

interface FormProductModalProps {
    handleSave: (selectedProduct: ISelectedItem) => void;
    selectedItem?: ISelectedItem;
}


const FormProduct = ({ handleSave, selectedItem }: FormProductModalProps) => {

    const { category, product } = selectedItem || {};
    const initialState: IProduct = {
        _id: '',
        name: '',
        description: '',
        price: 0,
        url_image: '',
        quantity: 0,
        active: true,
    };

    const [formProduct, setFormProduct] = useState<IProduct>(product || initialState);

    useEffect(() => {
        setFormProduct(product || initialState);
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === "price") {
            if (value.length > 11) return;

            // Permitir solo números, puntos o comas (mientras se escribe)
            if (!/^[\d.,]*$/.test(value)) return;

            // Remplazar coma por punto (para consistencia)
            let cleanedValue = value.replace(",", ".");

            // Validar número con hasta dos decimales
            if (cleanedValue !== "" && !/^\d+(\.\d{0,2})?$/.test(cleanedValue)) return;

            if (parseFloat(cleanedValue) > 0.999 && cleanedValue.startsWith("0")) {
                cleanedValue = cleanedValue.slice(1);
            }
            if (cleanedValue.startsWith("00")) {
                cleanedValue = cleanedValue.slice(1);
            }
            setFormProduct(prev => ({
                ...prev,
                [name]: cleanedValue,
            }));
        } else {
            setFormProduct(prev => ({
                ...prev,
                [name]: value,
            }));
            return;
        }

    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSave({
            category: {
                _id: category?._id || '',
                name: category?.name || '',
                description: category?.description || '',
                active: category?.active || true,
            },
            product: { ...formProduct, _id: formProduct._id || "" },
        });
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">
                {product ? 'Editar Producto' : 'Agregar Producto'}
            </h2>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="formProductImage">
                        Imagen
                    </label>
                    <input type="file" name="formProductImage" id="formProductImage" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="formProductName">Nombre</label>
                    <input
                        type="text"
                        id="formProductName"
                        name="name"
                        value={formProduct?.name}
                        onChange={handleChange}
                        required
                        className='p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-0 focus:border-2 focus:border-orange-500 disabled:text-gray-400 disabled:bg-slate-200'
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="formProductPrice">Precio</label>
                    <input
                        id="formProductPrice"
                        name="price"
                        value={formProduct?.price}
                        onChange={handleChange}
                        required
                        className='p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-0 focus:border-2 focus:border-orange-500 disabled:text-gray-400 disabled:bg-slate-200'
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="formProductDescription">Descripción</label>
                    <textarea
                        id="formProductDescription"
                        name="description"
                        value={formProduct?.description}
                        onChange={handleChange}
                        required
                        className='p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-0 focus:border-2 focus:border-orange-500 disabled:text-gray-400 disabled:bg-slate-200'
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <p>Activo</p>
                    <label
                        htmlFor="formProductActive"
                        className="bg-gray-300 border border-gray-400 has-[:checked]:bg-orange-500 flex has-[:checked]:border-orange-500 w-10 h-5 rounded-full relative transition-all duration-300 hover:cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            name="active"
                            id="formProductActive"
                            className={`hidden peer`}
                            checked={formProduct.active}
                            onChange={(e) => {
                                setFormProduct({
                                    ...formProduct,
                                    active: e.target.checked,
                                });
                            }
                            }
                        />
                        <span className={`bg-gray-100 border-gray-400 peer-checked:border-orange-500 border border-inherit h-full aspect-square rounded-full absolute peer-checked:right-0 top-1/2 transform -translate-y-1/2 transition-all duration-300`} ></span>

                    </label>
                </div>
                <button type="submit" className='px-3 py-2 bg-orange-500 hover:bg-orange-400 rounded-md text-white disabled:opacity-50 disabled:hover:bg-orange-500 font-bold mt-2'>Guardar</button>
            </form>
        </>
    );
};

export default FormProduct;
