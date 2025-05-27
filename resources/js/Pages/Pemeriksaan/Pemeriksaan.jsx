import React, {useRef, useState} from "react";
import Layout from "@/Layouts/layout/layout.jsx";
import DatatableLayout from "@/Components/DatatableLayout.jsx";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {router} from "@inertiajs/react";
import {RoleEnum} from "@/Constants/RoleEnum.js";
import {InputNumber} from "primereact/inputnumber";
import {InputMask} from "primereact/inputmask";
import {InputTextarea} from "primereact/inputtextarea";
import {Toast} from "primereact/toast";

const Pemeriksaan = ({auth, pasien}) => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);

    const rowsOptions = [10, 25, 50, 100];

    const reloadData = (search, page, perPage) => {
        return router.get(
            route("pemeriksaan.index"), {per_page: perPage, search, page},
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

    const beratBadanEditor = (options) => {
        return (
            <InputNumber value={options.value} suffix=" KG"
                         onChange={(e) => options.editorCallback(e.value)}
                         onKeyDown={(e) => e.stopPropagation()}/>
        );
    }

    const tekananDarahEditor = (options) => {
        return (
            <InputMask value={options.value} placeholder="Contoh: 120/80" mask="999/999"
                       onChange={(e) => options.editorCallback(e.target.value)}
                       onKeyDown={(e) => e.stopPropagation()}/>
        );
    }

    const keluhanDanDiagnosaEditor = (options) => {
        return (
            <InputTextarea value={options.value} rows={3} cols={20} autoResize
                           onChange={(e) => options.editorCallback(e.target.value)}
                           onKeyDown={(e) => e.stopPropagation()}/>
        );
    }

    const aksi = (rowData) => {
        const isPerawat = auth.user.role === RoleEnum.Perawat;
        const isDokter = auth.user.role === RoleEnum.Dokter;
        let disabled = (isPerawat && rowData.perawat_id !== auth.user.id && rowData.perawat_id !== null)
            || (isDokter && rowData.dokter_id !== auth.user.id && rowData.dokter_id !== null);
        return (
            <Button icon="pi pi-save" severity="success" size="small" rounded disabled={disabled}
                    onClick={() => {
                        router.put(route("pemeriksaan.update", rowData.id), rowData,
                            {
                                preserveScroll: true,
                                preserveState: true,
                                onSuccess: () => {
                                    toast.current.show({
                                        severity: 'success',
                                        summary: 'Berhasil',
                                        detail: 'Data pemeriksaan berhasil disimpan.',
                                        life: 3000
                                    });
                                },
                                onError: () => {
                                    toast.current.show({
                                        severity: 'error',
                                        summary: 'Gagal',
                                        detail: 'Data pemeriksaan gagal disimpan.',
                                        life: 3000
                                    });
                                }
                            })
                    }}/>
        );
    }

    const allowExpansion = (rowData) => {
        return rowData.pemeriksaan.length > 0;
    };

    const rowExpansionTemplate = (data) => {
        const pemeriksaan = data.pemeriksaan.map((item) => ({
            ...item,
            no: data.pemeriksaan.indexOf(item) + 1,
            berat_badan: item.berat_badan || 0,
            tekanan_darah: item.tekanan_darah || '0/0',
            keluhan: item.keluhan || '-',
            diagnosa: item.diagnosa || '-',
        }));
        if (auth.user.role === RoleEnum.Perawat) {
            return (
                <div className="p-3">
                    <h5>Pemeriksaan Pasien {data.nama}</h5>
                    <DataTable value={pemeriksaan} dataKey="id" className="p-datatable-striped">
                        <Column field="no" header="No" style={{width: '50px'}}/>
                        <Column field="tanggal_kunjungan" header="Tanggal Kunjungan"/>
                        <Column field="berat_badan" header="Berat Badan"
                                editor={(options) => beratBadanEditor(options)}/>
                        <Column field="tekanan_darah" header="Tekanan Darah"
                                editor={(options) => tekananDarahEditor(options)}/>
                        <Column header="Aksi" body={aksi} headerStyle={{width: '10%', minWidth: '8rem'}}
                                bodyStyle={{textAlign: 'center'}}/>
                    </DataTable>
                </div>
            );
        } else if (auth.user.role === RoleEnum.Dokter) {
            return (
                <div className="p-3">
                    <h5>Pemeriksaan Pasien {data.nama}</h5>
                    <DataTable value={pemeriksaan} dataKey="id" className="p-datatable-striped">
                        <Column field="no" header="No" style={{width: '50px'}}/>
                        <Column field="tanggal_kunjungan" header="Tanggal Kunjungan"/>
                        <Column field="berat_badan" header="Berat Badan"/>
                        <Column field="tekanan_darah" header="Tekanan Darah"/>
                        <Column field="keluhan" header="Keluhan"
                                editor={(options) => keluhanDanDiagnosaEditor(options)}/>
                        <Column field="diagnosa" header="Diagnosa"
                                editor={(options) => keluhanDanDiagnosaEditor(options)}/>
                        <Column header="Aksi" body={aksi} headerStyle={{width: '10%', minWidth: '8rem'}}
                                bodyStyle={{textAlign: 'center'}}/>
                    </DataTable>
                </div>
            );
        } else {
            return (
                <div className="p-3">
                    <h5>Pemeriksaan Pasien {data.nama}</h5>
                    <DataTable value={pemeriksaan} dataKey="id" className="p-datatable-striped">
                        <Column field="no" header="No" style={{width: '50px'}}/>
                        <Column field="tanggal_kunjungan" header="Tanggal Kunjungan"/>
                    </DataTable>
                </div>
            );
        }
    };

    return (
        <Layout user={auth.user}>
            <Toast ref={toast}/>
            <DatatableLayout title="Data Pasien" onReload={reloadData}>
                <DataTable lazy value={data} emptyMessage="Data tidak ditemukan"
                           expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                           rowExpansionTemplate={rowExpansionTemplate} dataKey="id"
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
                    <Column expander={allowExpansion} style={{width: '5rem'}}/>
                    <Column field="no" header="No" style={{width: '50px'}}/>
                    <Column field="nama" header="Nama"/>
                    <Column field="tanggal_lahir" header="Tanggal Lahir"/>
                    <Column field="jenis_kelamin" header="Jenis Kelamin"/>
                    <Column field="nomor_telepon" header="No. Telepon"/>
                </DataTable>
            </DatatableLayout>
        </Layout>
    );
}

export default Pemeriksaan;
