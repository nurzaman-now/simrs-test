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

const Pasien = ({auth, pasien}) => {
    const toast = useRef(null);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [dialogForm, setDialogForm] = useState(false);
    const dataJenisKelamin = [
        {label: "Laki-laki", value: "Laki-Laki"},
        {label: "Perempuan", value: "Perempuan"},
    ];
    const rowsOptions = [10, 25, 50, 100];
    const {data, setData,errors, processing, post, put} = useForm({
        id: null,
        nama: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        nomor_telepon: '',
    });

    const reloadData = (search, page, perPage) => {
        return router.get(
            route("pasien.index"), {per_page: perPage, search, page},
            {preserveState: true, preserveScroll: true},
        );
    }

    const paginatorRight = (
        <Button icon="pi pi-refresh" onClick={() => reloadData("", page, perPage)}/>
    );

    const dataPasien = pasien.data.map((item, index) => ({
        ...item,
        no: pasien.meta.from + index,
    }));

    const handleAdd = () => {
        setData({
            id: null,
            nama: '',
            tanggal_lahir: '',
            jenis_kelamin: '',
            nomor_telepon: '',
        });
        setDialogForm(true);
    }

    const handleEdit = (e) => {
        setData({
            id: e.id,
            nama: e.nama,
            tanggal_lahir: new Date(e.tanggal_lahir),
            jenis_kelamin: e.jenis_kelamin,
            nomor_telepon: e.nomor_telepon,
        });
        setDialogForm(true);
    }

    const sendForm = () => {
        if (data.id) {
            put(route("pasien.update", data.id), {
                onSuccess: () => {
                    setDialogForm(false);
                    reloadData("", page, perPage);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Berhasil',
                        detail: 'Data pasien berhasil diperbarui.',
                        life: 3000,
                    });
                },
                onError: (error) => {
                    console.log(error);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Gagal',
                        detail: 'Gagal memperbarui data pasien.',
                        life: 3000,
                    });
                },
            });
        } else {
            post(route("pasien.store"), {
                onSuccess: () => {
                    setDialogForm(false);
                    reloadData("", page, perPage);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Berhasil',
                        detail: 'Data pasien berhasil disimpan.',
                        life: 3000,
                    });
                },
                onError: () => {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Gagal',
                        detail: 'Gagal menyimpan data pasien.',
                        life: 3000,
                    });
                },
            });
        }
    }

    const confirmDelete = (e) => {
        confirmDialog({
            message: 'Apakah Anda yakin ingin menghapus data pasien ini?',
            header: 'Konfirmasi',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            closable: false,
            accept: () => handleDelete(e),
        });
    }

    const handleDelete = (e) => {
        router.delete(route("pasien.destroy", e.id), {
            onSuccess: () => {
                reloadData("", page, perPage);
                toast.current.show({
                    severity: 'success',
                    summary: 'Berhasil',
                    detail: 'Data pasien berhasil dihapus.',
                    life: 3000,
                });
            },
            onError: () => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Gagal',
                    detail: 'Gagal menghapus data pasien.',
                    life: 3000,
                });
            },
        });
    }

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Form Pasien</span>
        </div>
    );

    const footerContent = (
        <Button label={data.id ? "Update" : "Simpan"} className="mt-2" loading={processing} onClick={sendForm}/>
    );

    return (
        <Layout user={auth.user}>
            <Toast ref={toast}/>
            <ConfirmDialog/>
            <DatatableLayout title="Data Pasien" onReload={reloadData} onAdd={handleAdd}>
                <DataTable lazy value={dataPasien} emptyMessage="Data tidak ditemukan"
                           paginator first={pasien.meta.from} rows={pasien.meta.per_page}
                           totalRecords={pasien.meta.total}
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
                    <Column field="tanggal_lahir" header="Tanggal Lahir"/>
                    <Column field="jenis_kelamin" header="Jenis Kelamin"/>
                    <Column field="nomor_telepon" header="No. Telepon"/>
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
                        if (!dialogForm) return;
                        setDialogForm(false);
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
                    <label htmlFor="tanggal_lahir">Tanggal Lahir</label>
                    <Calendar id="tanggal_lahir" value={data.tanggal_lahir}
                              onChange={(e) => setData('tanggal_lahir', e.target.value)} required/>
                    {errors.tanggal_lahir && (
                        <Message severity="error" text={errors.tanggal_lahir} className="mt-2"/>
                    )}
                </div>
                <div className="flex flex-column gap-2 mt-2">
                    <label htmlFor="jenis_kelamin">Jenis Kelamin</label>
                    <Dropdown value={data.jenis_kelamin}
                              options={dataJenisKelamin} placeholder="Pilih jenis kelamin"
                              className="w-full" inputId="jenis_kelamin" optionLabel="label"
                              onChange={(e) => setData("jenis_kelamin", e.value)}
                    />
                    {errors.jenis_kelamin && (
                        <Message severity="error" text={errors.jenis_kelamin} className="mt-2"/>
                    )}
                </div>
                <div className="flex flex-column gap-2 mt-2">
                    <label htmlFor="nomor_telepon">No. Telepon</label>
                    <InputText id="nomor_telepon" value={data.nomor_telepon}
                               onChange={(e) => setData('nomor_telepon', e.target.value)} required/>
                    {errors.nomor_telepon && (
                        <Message severity="error" text={errors.nomor_telepon} className="mt-2"/>
                    )}
                </div>
            </Dialog>
        </Layout>
    );
}

export default Pasien;
