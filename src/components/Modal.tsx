import type React from "react";

export const Modal = ({ setShowModal, setCategories, categories }: { setShowModal: React.Dispatch<React.SetStateAction<boolean>>, setCategories: any, categories: any }) => {

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

    return (
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
        </div>
    );
};