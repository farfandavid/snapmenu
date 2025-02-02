import { useEffect, useState } from "react";
import { type ICategory, type ISelectedItem, type IProduct } from '../../client/types/Interfaces';

interface FormCategoryProps {
    handleSave: (selectedItem: ISelectedItem) => void;
    selectedItem?: ISelectedItem;
    selectedCategory?: ICategory;
}

const FormCategory = ({ handleSave, selectedItem, selectedCategory }: FormCategoryProps) => {

    const initialState: ICategory = {
        _id: '',
        name: '',
        active: true,
        products: [],
    };

    const [formCategory, setFormCategory] = useState<ICategory>(selectedCategory || initialState);

    useEffect(() => {
        setFormCategory(selectedCategory || initialState);
    }, [selectedCategory]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormCategory({
            ...formCategory,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formCategory.name) return;
        handleSave({
            category: formCategory,
            product: undefined,
            menuId: selectedItem?.menuId,
        });
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">
                {selectedItem?.category ? "Editar" : "Crear"} Categoría
            </h2>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="name">Nombre</label>
                    <input
                        type="text"
                        className='p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-0 focus:border-2 focus:border-orange-500 disabled:text-gray-400 disabled:bg-slate-200'
                        id="name"
                        name="name"
                        value={formCategory.name}
                        onChange={handleChange}
                    />
                </div>

                <button
                    type="submit"
                    className='px-3 py-2 bg-orange-500 hover:bg-orange-400 rounded-md text-white disabled:opacity-50 disabled:hover:bg-orange-500 font-bold mt-2'
                >
                    Guardar
                </button>
            </form>
        </>
    );
}

export default FormCategory;