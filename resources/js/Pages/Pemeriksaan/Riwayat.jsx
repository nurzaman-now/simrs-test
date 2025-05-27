import React, {useRef, useState} from "react";
import Layout from "@/Layouts/layout/layout.jsx";
import DatatableLayout from "@/Components/DatatableLayout.jsx";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {router} from "@inertiajs/react";
import {Toast} from "primereact/toast";
import formatCurrency from "@/Constants/currencies.js";

const Riwayat = ({auth, pasien}) => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [expandedPemeriksaan, setExpandedPemeriksaan] = useState(null);
    const [expandedPemberianObat, setExpandedPemberianObat] = useState(null);
    const toast = useRef(null);

    const rowsOptions = [10, 25, 50, 100];

    const reloadData = (search, page, perPage) => {
        return router.get(
            route("pemeriksaan.history"), {per_page: perPage, search, page},
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

    const dataPemberianObatTemplate = (data) => {
        const pemberianObat = data.pemberian_obat.map((item) => ({
            ...item,
            no: data.pemberian_obat.indexOf(item) + 1,
        }));

        const footerExpansion = () => {
            const totalHarga = pemberianObat.reduce((total, obat) => total + (obat.harga * obat.jumlah), 0);

            return (
                <div className="flex align-items-center justify-content-end">
                    <span className="font-bold">Total Harga: {formatCurrency(totalHarga)}</span>
                </div>
            )
        };

        return (
            <div className="p-3">
                <h5>Pemberian Obat Pasien {data.nama}</h5>
                <DataTable value={pemberianObat} emptyMessage="Data tidak ditemukan" dataKey="id"
                    footer={footerExpansion(data)}>
                    <Column field="no" header="No" style={{width: '50px'}}/>
                    <Column field="tanggal_pemberian" header="Tanggal Pemberian"/>
                    <Column field="obat.nama" header="Nama Obat"/>
                    <Column field="obat.deskripsi" header="Deskripsi Obat"/>
                    <Column field="harga" header="Harga"/>
                    <Column field="jumlah" header="Jumlah"/>
                    <Column field="total" header="Total Harga"/>
                </DataTable>
            </div>
        );
    }

    const dataPemeriksaanTemplate = (data) => {
        const pemeriksaan = data.pemeriksaan.map((item) => ({
            ...item,
            no: data.pemeriksaan.indexOf(item) + 1,
            berat_badan: item.berat_badan || 0,
            tekanan_darah: item.tekanan_darah || '0/0',
            keluhan: item.keluhan || '-',
            diagnosa: item.diagnosa || '-',
        }));

        return (
            <div className="p-3">
                <h5>Pemeriksaan Pasien {data.nama}</h5>
                <DataTable value={pemeriksaan} emptyMessage="Data tidak ditemukan"
                           expandedRows={expandedPemberianObat} onRowToggle={(e) => setExpandedPemberianObat(e.data)}
                           rowExpansionTemplate={dataPemberianObatTemplate} dataKey="id">
                    <Column field="no" header="No" style={{width: '50px'}}/>
                    <Column field="tanggal_kunjungan" header="Tanggal Kunjungan"/>
                    <Column field="dokter.nama" header="Dokter"/>
                    <Column field="perawat.nama" header="Perawat"/>
                    <Column field="berat_badan" header="Berat Badan"/>
                    <Column field="tekanan_darah" header="Tekanan Darah"/>
                    <Column field="keluhan" header="Keluhan"/>
                    <Column field="diagnosa" header="Diagnosa"/>
                    <Column header="Aksi" align="center" expander={(rowsOptions) => {
                        return rowsOptions.pemberian_obat?.length;
                    }} style={{width: '5rem'}} body={(dataRow) => {
                        return (
                            <Button text onClick={() => setExpandedPemberianObat(expandedPemberianObat ? null : [dataRow])}>
                                Obat
                            </Button>
                        );
                    }}/>
                </DataTable>
            </div>
        );
    };

    return (
        <Layout user={auth.user}>
            <Toast ref={toast}/>
            <DatatableLayout title="Riwayat Pemeriksaan Pasien" onReload={reloadData}>
                <DataTable lazy value={data} emptyMessage="Data tidak ditemukan"
                           expandedRows={expandedPemeriksaan} onRowToggle={(e) => setExpandedPemeriksaan(e.data)}
                           rowExpansionTemplate={dataPemeriksaanTemplate} dataKey="id"
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
                    <Column header="Aksi" align="center" expander={(rowsOptions) => {
                        return rowsOptions.pemeriksaan.length > 0
                    }} style={{width: '5rem'}}
                            body={(dataRow) => {
                                return (
                                    <Button text
                                            onClick={() => setExpandedPemeriksaan(expandedPemeriksaan ? null : [dataRow])}>
                                        Pemeriksaan
                                    </Button>
                                );
                            }}/>
                </DataTable>
            </DatatableLayout>
        </Layout>
    );
}

export default Riwayat;
