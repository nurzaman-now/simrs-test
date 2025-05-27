import React, {useRef, useState} from "react";
import Layout from "@/Layouts/layout/layout.jsx";
import DatatableLayout from "@/Components/DatatableLayout.jsx";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {router, useForm} from "@inertiajs/react";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {Toast} from "primereact/toast";
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";
import {Message} from "primereact/message";
import {RoleEnum} from "@/Constants/RoleEnum.js";

const Pengguna = ({auth, pengguna, role}) => {
    const toast = useRef(null);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [dialogForm, setDialogForm] = useState(false);
    const rowsOptions = [10, 25, 50, 100];
    const {data, setData, errors, processing, post, put, reset} = useForm({
        id: null,
        nama: null,
        email: null,
        role: null,
        password: null,
        password_confirmation: null,
    });

    const reloadData = (search, page, perPage) => {
        return router.get(
            route("pengguna.index"), {per_page: perPage, search, page},
            {preserveState: true, preserveScroll: true},
        );
    }

    const paginatorRight = (
        <Button icon="pi pi-refresh" onClick={() => reloadData("", page, perPage)}/>
    );

    const dataPengguna = pengguna.data.map((item, index) => ({
        ...item,
        no: pengguna.meta.from + index,
    }));

    const handleAdd = () => {
        reset();
        setDialogForm(true);
    }

    const handleEdit = (e) => {
        setData({
            id: e.id,
            nama: e.nama,
            email: e.email,
            role: e.role,
        });
        setDialogForm(true);
    }

    const sendForm = () => {
        if (data.id) {
            put(route("pengguna.update", data.id), {
                onSuccess: () => {
                    setDialogForm(false);
                    reloadData("", page, perPage);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Berhasil',
                        detail: 'Data pengguna berhasil diperbarui.',
                        life: 3000,
                    });
                },
                onError: (error) => {
                    console.log(error);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Gagal',
                        detail: 'Gagal memperbarui data pengguna.',
                        life: 3000,
                    });
                },
            });
        } else {
            post(route("pengguna.store"), {
                onSuccess: () => {
                    setDialogForm(false);
                    reloadData("", page, perPage);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Berhasil',
                        detail: 'Data pengguna berhasil disimpan.',
                        life: 3000,
                    });
                },
                onError: () => {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Gagal',
                        detail: 'Gagal menyimpan data pengguna.',
                        life: 3000,
                    });
                },
            });
        }
    }

    const confirmDelete = (e) => {
        confirmDialog({
            message: 'Apakah Anda yakin ingin menghapus data pengguna ini?',
            header: 'Konfirmasi',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            closable: false,
            accept: () => handleDelete(e),
        });
    }

    const handleDelete = (e) => {
        router.delete(route("pengguna.destroy", e.id), {
            onSuccess: () => {
                reloadData("", page, perPage);
                toast.current.show({
                    severity: 'success',
                    summary: 'Berhasil',
                    detail: 'Data pengguna berhasil dihapus.',
                    life: 3000,
                });
            },
            onError: () => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Gagal',
                    detail: 'Gagal menghapus data pengguna.',
                    life: 3000,
                });
            },
        });
    }

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Form Pengguna</span>
        </div>
    );

    const footerContent = (
        <Button label={data.id ? "Ubah" : "Simpan"} severity={data.id ? "warning" : "success"} className="mt-2"
                loading={processing} onClick={sendForm}/>
    );

    console.log(data);
    return (
        <Layout user={auth.user}>
            <Toast ref={toast}/>
            <ConfirmDialog/>
            <DatatableLayout title="Data Pengguna" onReload={reloadData} onAdd={handleAdd}>
                <DataTable lazy value={dataPengguna} emptyMessage="Data tidak ditemukan"
                           paginator first={pengguna.meta.from} rows={pengguna.meta.per_page}
                           totalRecords={pengguna.meta.total}
                           paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
                           rowsPerPageOptions={rowsOptions}
                           onPage={(e) => {
                               setPage(e.page + 1);
                               setPerPage(e.rows);
                               reloadData("", e.page + 1, e.rows);
                           }}
                           currentPageReportTemplate="{first} to {last} of {totalRecords}"
                           paginatorLeft={<></>} paginatorRight={paginatorRight}>
                    <Column field="no" header="No" style={{width: '50px'}}/>
                    <Column field="nama" header="Nama"/>
                    <Column field="email" header="Email"/>
                    <Column field="role_label" header="Role"/>
                    <Column header="Aksi" body={(e) => {
                        if (e.role === RoleEnum.SuperAdmin) return null; // Prevent actions for admin users
                        return (
                            <>
                                <Button icon="pi pi-pencil" severity="warning" rounded
                                        onClick={() => handleEdit(e)}/>
                                <Button icon="pi pi-trash" severity="danger" rounded className="ml-2"
                                        onClick={() => confirmDelete(e)}/>
                            </>
                        );
                    }}/>
                </DataTable>
            </DatatableLayout>
            <Dialog visible={dialogForm} modal header={headerElement} footer={footerContent} style={{width: '30rem'}}
                    onHide={() => {
                        setDialogForm(false);
                        reset();
                    }}>
                <div className="flex flex-column gap-2">
                    <label htmlFor="nama">Nama</label>
                    <InputText id="nama" value={data.nama} onChange={(e) => setData('nama', e.target.value)} required
                               autoFocus/>
                    {errors.nama && (
                        <Message severity="error" text={errors.nama} className="mt-2"/>
                    )}
                </div>
                <div className="flex flex-column gap-2 mt-2">
                    <label htmlFor="email">Email</label>
                    <InputText id="email" value={data.email} onChange={(e) => setData('email', e.target.value)}
                               required/>
                    {errors.email && (
                        <Message severity="error" text={errors.email} className="mt-2"/>
                    )}
                </div>
                <div className="flex flex-column gap-2 mt-2">
                    <label htmlFor="role">Role</label>
                    <Dropdown id="role" value={data.role} options={role} onChange={(e) => setData('role', e.value)}
                              optionLabel="label" placeholder="Pilih Role" required/>
                    {errors.role && (
                        <Message severity="error" text={errors.role} className="mt-2"/>
                    )}
                </div>
                {!data.id && (
                    <>
                        <div className="flex flex-column gap-2 mt-2">
                            <label htmlFor="password">Password</label>
                            <InputText id="password" type="password" value={data.password}
                                       onChange={(e) => setData('password', e.target.value)} required/>
                            {errors.password && (
                                <Message severity="error" text={errors.password} className="mt-2"/>
                            )}
                        </div>
                        <div className="flex flex-column gap-2 mt-2">
                            <label htmlFor="password_confirmation">Konfirmasi Password</label>
                            <InputText id="password_confirmation" type="password" value={data.password_confirmation}
                                       onChange={(e) => setData('password_confirmation', e.target.value)} required/>
                            {errors.password_confirmation && (
                                <Message severity="error" text={errors.password_confirmation} className="mt-2"/>
                            )}
                        </div>
                    </>
                )}
            </Dialog>
        </Layout>
    );
}

export default Pengguna;
