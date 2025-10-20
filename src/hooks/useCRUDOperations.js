import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { usePost, useUpdate, useDelete } from "@/utils/hooks/useCustomMutation";

const useCRUDOperations = ({
  endpoint,
  queryKey,
  titleKey,
  refetch,
}) => {
  const { t } = useTranslation();
  
  const [showCreate, setShowCreate] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [viewData, setViewData] = useState(null);

  const { data: dataList = [], isLoading } = useGet(queryKey, endpoint);
  const createMutation = usePost(queryKey, endpoint);
  const updateMutation = useUpdate(queryKey, endpoint, editData?.id);
  const deleteMutation = useDelete(queryKey, endpoint, deleteData?.id);

  const tableData = useMemo(() => {
    let rawData = Array.isArray(dataList) ? dataList : Array.isArray(dataList?.data) ? dataList.data : [];
    
    return rawData.map(item => ({
      ...item,
      searchableTitle: item.name || item.title ? Object.values(item.name || item.title || {}).join(' ') : '',
      searchText: item.name || item.title ? Object.values(item.name || item.title || {}).join(' ').toLowerCase() : '',
    }));
  }, [dataList]);

  const handleEdit = (data) => {
    setEditData(data);
    setShowCreate(true);
  };

  const handleFormSubmit = (values, { setSubmitting, resetForm }) => {
    if (editData) {
      updateMutation.mutate(values, {
        onSuccess: () => {
          toast.success(t(`${titleKey}.updated`));
          setShowCreate(false);
          setEditData(null);
          resetForm();
        },
        onError: (error) => {
          toast.error(error?.message || t('common.error'));
        },
        onSettled: () => setSubmitting(false),
      });
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success(t(`${titleKey}.added`));
          setShowCreate(false);
          resetForm();
        },
        onError: (error) => {
          toast.error(error?.message || t('common.error'));
        },
        onSettled: () => setSubmitting(false),
      });
    }
  };

  const handleDelete = () => {
    if (!deleteData || !deleteData.id) return;
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t(`${titleKey}.deleted`));
        setDeleteData(null);
      },
      onError: (error) => {
        toast.error(error?.message || t('common.error'));
      },
    });
  };

  const closeForm = () => {
    setShowCreate(false);
    setEditData(null);
  };

  return {
    // State
    showCreate,
    editData,
    deleteData,
    viewData,
    
    // Data
    tableData,
    isLoading,
    
    // Mutations
    createMutation,
    updateMutation,
    deleteMutation,
    
    // Handlers
    handleEdit,
    handleFormSubmit,
    handleDelete,
    closeForm,
    setDeleteData,
    setViewData,
    setShowCreate,
  };
};

export default useCRUDOperations;
