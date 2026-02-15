import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function useCrud({
    fetchApi,
    addApi,
    updateApi,
    deleteApi,
    getByIdApi,
    initialFormState,
}) {
    const [list, setList] = useState([]);
    const [form, setForm] = useState(initialFormState);
    const [loading, setLoading] = useState(true);
    const [isAddMode, setIsAddMode] = useState(true);
    const [currentId, setCurrentId] = useState(null);

    const hasFetched = useRef(false);

    // FETCH LIST
    const fetchList = async () => {
        try {
            setLoading(true);
            const res = await fetchApi();
            setList(res.data?.content || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchList();
    }, []);

    // VIEW / EDIT
    const fetchById = async (id, isView = false) => {
        try {
            setLoading(true);
            const res = await getByIdApi(id);
            if (!res.data?.content) {
                toast.error("Record not found");
                return;
            }
            setForm(res.data.content);
            setCurrentId(id);
            setIsAddMode(false);
        } catch (err) {
            toast.error("Failed to fetch details");
        } finally {
            setLoading(false);
        }
    };

    // ADD / UPDATE
    const submit = async (formData) => {
        try {
            setLoading(true);
            if (isAddMode) {
                await addApi(formData);
                toast.success("Added successfully!");
            } else {
                await updateApi(currentId, formData);
                toast.success("Updated successfully!");
            }
            reset();
            fetchList();
        } catch (err) {
            console.error(err);
            toast.error("Failed to save");
        } finally {
            setLoading(false);
        }
    };

    // DELETE
    const remove = async (id) => {
        try {
            setLoading(true);
            await deleteApi(id);
            toast.success("Deleted successfully!");
            fetchList();
        } catch (err) {
            toast.error("Failed to delete");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setForm(initialFormState);
        setIsAddMode(true);
        setCurrentId(null);
    };

    return {
        list,
        form,
        setForm,
        loading,
        isAddMode,
        setIsAddMode,
        fetchList,
        fetchById,
        submit,
        remove,
        reset,
    };
}
