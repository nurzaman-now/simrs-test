import React, {useState} from "react";
import Layout from "@/Layouts/layout/layout.jsx";
import DatatableLayout from "@/Components/DatatableLayout.jsx";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {router} from "@inertiajs/react";

const Pasien = ({auth, pasien}) => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const rowsOptions = [10, 25, 50, 100];

    const reloadData = (search, page, perPage) => {
        return router.get(
            route("pasien.index"), {per_page: perPage, search, page},
            {preserveState: true, preserveScroll: true},
        );
    }

    const paginatorRight = (
        <Button icon="pi pi-refresh" onClick={() => reloadData("", page, perPage)}/>
    );

    const data = pasien.data.map((item, index) => ({
        ...item,
        no: pasien.meta.from + index,
    }));

    return (
        <Layout user={auth.user}>
            <DatatableLayout title="Data Pasien" onReload={reloadData}>
                <DataTable lazy value={data} emptyMessage="Data tidak ditemukan"
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
                                    onClick={() => router.get(route("pasien.edit", e.id))}/>
                            <Button icon="pi pi-trash" severity="danger" rounded className="ml-2"
                                    onClick={() => router.delete(route("pasien.destroy", e.id), {
                                        preserveScroll: true,
                                        preserveState: true,
                                        onSuccess: () => reloadData("", page, perPage),
                                    })} />
                            </>
                        );
                    }}/>
                </DataTable>
            </DatatableLayout>
        </Layout>
    );
}

export default Pasien;
