import React, {useRef, useState} from "react";
import Layout from "@/Layouts/layout/layout.jsx";
import DatatableLayout from "@/Components/DatatableLayout.jsx";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {router, useForm} from "@inertiajs/react";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";
import {Toast} from "primereact/toast";
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";
import {Message} from "primereact/message";
import {InputTextarea} from "primereact/inputtextarea";
import {InputNumber} from "primereact/inputnumber";
import formatCurrency from "@/Constants/currencies.js";

const Obat = ({auth, obat}) => {
    const toast = useRef(null);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [dialogForm, setDialogForm] = useState(false);
    const dataJenisKelamin = [
        {label: "Laki-laki", value: "Laki-Laki"},
        {label: "Perempuan", value: "Perempuan"},
    ];
    const rowsOptions = [10, 25, 50, 100];
    const {data, setData,errors, processing, post, put, reset} = useForm({
        id: null,
        nama: null,
        deskripsi: null,
        harga: null,
        stok: null,
    });

    const reloadData = (search, page, perPage) => {
        return router.get(
            route("obat.index"), {per_page: perPage, search, page},
            {preserveState: true, preserveScroll: true},
        );
    }

    const paginatorRight = (
        <Button icon="pi pi-refresh" onClick={() => reloadData("", page, perPage)}/>
    );

    const dataObat = obat.data.map((item, index) => ({
        ...item,
        no: obat.meta.from + index,
    }));

    const handleAdd = () => {
        reset();
        setDialogForm(true);
    }

    const handleEdit = (e) => {
        setData({
            id: e.id,
            nama: e.nama,
            deskripsi: e.deskripsi,
            harga: e.harga,
            stok: e.stok,
        });
        setDialogForm(true);
    }

    const sendForm = () => {
        if (data.id) {
            put(route("obat.update", data.id), {
                onSuccess: () => {
                    setDialogForm(false);
                    reloadData("", page, perPage);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Berhasil',
                        detail: 'Data obat berhasil diperbarui.',
                        life: 3000,
                    });
                },
                onError: (error) => {
                    console.log(error);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Gagal',
                        detail: 'Gagal memperbarui data obat.',
                        life: 3000,
                    });
                },
            });
        } else {
            post(route("obat.store"), {
                onSuccess: () => {
                    setDialogForm(false);
                    reloadData("", page, perPage);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Berhasil',
                        detail: 'Data obat berhasil disimpan.',
                        life: 3000,
                    });
                },
                onError: () => {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Gagal',
                        detail: 'Gagal menyimpan data obat.',
                        life: 3000,
                    });
                },
            });
        }
    }

    const confirmDelete = (e) => {
        confirmDialog({
            message: 'Apakah Anda yakin ingin menghapus data obat ini?',
            header: 'Konfirmasi',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            closable: false,
            accept: () => handleDelete(e),
        });
    }

    const handleDelete = (e) => {
        router.delete(route("obat.destroy", e.id), {
            onSuccess: () => {
                reloadData("", page, perPage);
                toast.current.show({
                    severity: 'success',
                    summary: 'Berhasil',
                    detail: 'Data obat berhasil dihapus.',
                    life: 3000,
                });
            },
            onError: () => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Gagal',
                    detail: 'Gagal menghapus data obat.',
                    life: 3000,
                });
            },
        });
    }

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Form Obat</span>
        </div>
    );

    const footerContent = (
        <Button label={data.id ? "Ubah" : "Simpan"} severity={data.id ? "warning" : "success"} className="mt-2" loading={processing} onClick={sendForm}/>
    );

    return (
        <Layout user={auth.user}>
            <Toast ref={toast}/>
            <ConfirmDialog/>
            <DatatableLayout title="Data Obat" onReload={reloadData} onAdd={handleAdd}>
                <DataTable lazy value={dataObat} emptyMessage="Data tidak ditemukan"
                           paginator first={obat.meta.from} rows={obat.meta.per_page}
                           totalRecords={obat.meta.total}
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
                    <Column field="deskripsi" header="Deskripsi"/>
                    <Column field="harga" header="Harga" body={(e) => formatCurrency(e.harga)}/>
                    <Column field="stok" header="Stok"/>
                    <Column header="Aksi" body={(e) => {
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
                    <label htmlFor="deskripsi">Deskripsi</label>
                    <InputTextarea id="deskripsi" value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} required/>
                    {errors.deskripsi && (
                        <Message severity="error" text={errors.deskripsi} className="mt-2"/>
                    )}
                </div>
                <div className="flex flex-column gap-2 mt-2">
                    <label htmlFor="harga">Harga</label>
                    <InputNumber id="harga" value={data.harga} min={1} mode="currency" currency="IDR" locale="id-ID"
                                 onChange={(e) => setData('harga', e.value)} required/>
                    {errors.harga && (
                        <Message severity="error" text={errors.harga} className="mt-2"/>
                    )}
                </div>
                <div className="flex flex-column gap-2 mt-2">
                    <label htmlFor="stok">Stok</label>
                    <InputNumber id="stok" value={data.stok} min={1} onChange={(e) => setData('stok', e.value)} required/>
                    {errors.stok && (
                        <Message severity="error" text={errors.stok} className="mt-2"/>
                    )}
                </div>
            </Dialog>
        </Layout>
    );
}

export default Obat;
