import React, {useRef, useState} from "react";
import Layout from "@/Layouts/layout/layout.jsx";
import DatatableLayout from "@/Components/DatatableLayout.jsx";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {router} from "@inertiajs/react";
import {AutoComplete} from "primereact/autocomplete";
import {InputNumber} from "primereact/inputnumber";
import formatCurrency from "@/Constants/currencies.js";
import {Toast} from "primereact/toast";
import PrimaryButton from "@/Components/PrimaryButton.jsx";

const PemberianObat = ({auth, pemeriksaan, obat}) => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);

    const setTotalHarga = (item) => {
        return item.reduce((total, d) => {
            return total + d?.total || 0;
        }, 0);
    }

    const [data, setData] = useState(() => pemeriksaan.data.map((item, index) => ({
        ...item,
        no: pemeriksaan.meta.from + index,
        pemberian_obat: item.pemberian_obat.map((obatItem, obatIndex) => ({
            ...obatItem,
            no: obatIndex + 1,
            total: (obatItem.obat?.harga ?? 0) * obatItem.jumlah,
        })),
        total_harga: setTotalHarga(item.pemberian_obat || []),
    })));
    const [meta, setMeta] = useState(() => pemeriksaan.meta);

    const rowsOptions = [10, 25, 50, 100];

    const reloadData = (search, page, perPage, searchObat = '') => {
        return router.get(
            route("pemberian-obat.index"), {per_page: perPage, search, page},
            {preserveState: true, preserveScroll: true},
        );
    }

    const paginatorRight = (
        <Button icon="pi pi-refresh" onClick={() => reloadData("", page, perPage)}/>
    );

    const addPemberianObat = (item) => {
        if (!item.dokter_id) {
            toast.current.show({
                severity: 'warn',
                summary: 'Gagal',
                detail: 'Pasien belum diperiksa oleh dokter',
                life: 3000,
            });
            return;
        }

        const pemberianObat = [
            ...item.pemberian_obat,
            {
                id: null,
                no: item.pemberian_obat.length + 1,
                obat: {id: null, nama: '', harga: 0},
                jumlah: 1,
                total: 0,
            }
        ];
        setData((prevData => prevData.map(d => {
            if (d.no === item.no) {
                return {
                    ...d,
                    pemberian_obat: pemberianObat,
                    total_harga: setTotalHarga(pemberianObat),
                };
            }
            return d;
        })));
    }

    const obatEditor = (options, item) => {
        return (
            <AutoComplete value={options.value} suggestions={obat}
                          completeMethod={(e) => {
                              reloadData('', page, perPage, e.query);
                          }}
                          field="nama" dropdown
                          onChange={(e) => {
                              const {value} = e;
                              if (value !== null && value.stok === 0) {
                                toast.current.show({
                                    severity: 'warn',
                                    summary: 'Stok Obat Habis',
                                    detail: 'Tidak Bisa Ditambahkan',
                                    life: 3000
                                });
                                options.editorCallback('');
                                return;
                              }

                              const obatIsExists = item.pemberian_obat.some(item => item.obat.id === value.id);
                              if (obatIsExists) {
                                  toast.current.show({
                                      severity: 'warn',
                                      summary: 'Obat Sudah Ada',
                                      detail: 'Tidak Bisa Ditambahkan',
                                      life: 3000
                                  });
                                  options.editorCallback('');
                                  return;
                              }

                              if (typeof value === 'string') {
                                  options.editorCallback(value);
                              } else {
                                  const newPemberianObat = item.pemberian_obat.map((item, index) => {
                                      if (index === options.rowIndex) {
                                          return {
                                              ...item,
                                              obat: value,
                                              total: value.harga * item.jumlah,
                                          };
                                      } else {
                                          return item;
                                      }
                                  })
                                  setData((prevData) => prevData.map((d) => {
                                      if (d.no === item.no) {
                                          return {
                                              ...d,
                                              pemberian_obat: newPemberianObat,
                                              total_harga: setTotalHarga(newPemberianObat),
                                          };
                                      }
                                      return d;
                                  }));
                              }
                          }}
                          onKeyDown={(e) => e.stopPropagation()}
                          placeholder="Pilih Obat" style={{width: '100%'}}/>
        )
    }

    const obatJumlahEditor = (options, item) => {
        return (
            <InputNumber value={options.value} min={1}
                         onChange={(e) => {
                             options.editorCallback(e.value);
                             const newData = item.pemberian_obat.map((item, index) => {
                                 if (index === options.rowIndex) {
                                     return {
                                         ...item,
                                         jumlah: e.value,
                                         total: item.obat.harga * e.value,
                                     };
                                 }
                                 return item;
                             });
                             setData((prevData) => prevData.map((d) => {
                                 if (d.no === item.no) {
                                     return {
                                         ...d,
                                         pemberian_obat: newData,
                                         total_harga: setTotalHarga(newData),
                                     };
                                 }
                                 return d;
                             }));
                         }}
                         onKeyDown={(e) => e.stopPropagation()} className="w-full"/>
        )
    }

    const aksi = (rowData, item) => {
        return (
            <Button icon="pi pi-trash" severity="danger" size="small" rounded
                    onClick={() => {
                        if (rowData.id) {
                            router.delete(route("pemberian-obat.destroy", rowData.id), {
                                preserveScroll: true,
                                preserveState: true,
                                onSuccess: () => {
                                    toast.current.show({
                                        severity: 'success',
                                        summary: 'Berhasil',
                                        detail: 'Pemberian obat berhasil dihapus',
                                        life: 3000,
                                    });
                                },
                                onError: () => {
                                    toast.current.show({
                                        severity: 'error',
                                        summary: 'Gagal',
                                        detail: 'Pemberian obat gagal dihapus',
                                        life: 3000,
                                    });
                                },
                            });
                        }
                        const updatedData = item.pemberian_obat.filter((item) => item.no !== rowData.no);
                        setData((prevData) => prevData.map(prev => {
                            if (prev.no === item.no) {
                                return {
                                    ...item,
                                    pemberian_obat: updatedData,
                                    total_harga: setTotalHarga(updatedData),
                                };
                            }
                            return prev;
                        }));
                    }}/>
        );
    }

    const footerExpansion = (item) => (
        <div className="flex align-items-center justify-content-end">
            <span className="font-bold">Total Harga: {formatCurrency(item.total_harga || 0)}</span>
            <Button label="Simpan" icon="pi pi-save" severity="success" className="ml-2"
                    disabled={item.pemberian_obat.length === 0}
                    onClick={() => {
                        const updatedData = item.pemberian_obat.map((obat, index) => ({
                            id: obat.id || null,
                            pemeriksaan_id: item.id,
                            obat_id: obat.obat.id,
                            jumlah: obat.jumlah,
                            total: obat.total,
                        }));
                        router.post(route("pemberian-obat.store.many"), {
                            pemberian_obat: updatedData,
                        }, {
                            onSuccess: (response) => {
                                const newData = response?.props?.pemeriksaan?.data?.find(p => p.id === item.id)?.pemberian_obat?.map((obat, index) => ({
                                    ...obat,
                                    no: index + 1,
                                }));
                                setData((prevData) => prevData.map(d => {
                                    if (d.no === item.no) {
                                        return {
                                            ...d,
                                            pemberian_obat: newData || [],
                                            total_harga: setTotalHarga(newData || []),
                                        };
                                    }
                                    return d;
                                }));
                                toast.current.show({
                                    severity: 'success',
                                    summary: 'Berhasil',
                                    detail: 'Pemberian obat berhasil disimpan',
                                    life: 3000,
                                });
                            },
                            onError: () => {
                                toast.current.show({
                                    severity: 'error',
                                    summary: 'Gagal',
                                    detail: 'Pemberian obat gagal disimpan',
                                    life: 3000,
                                });
                            },
                        });
                    }}/>
        </div>
    );
    const rowExpansionTemplate = (item) => {
        return (
            <div className="p-3">
                <div className="flex justify-content-between align-items-center mb-3">
                    <h5>Pemberian Obat Pasien {item.pasien.nama}</h5>
                    <PrimaryButton label="Tambah Obat" icon="pi pi-plus" className="mb-3"
                            onClick={() => {
                                addPemberianObat(item);
                            }}/>
                </div>
                <DataTable lazy value={item.pemberian_obat} dataKey="no" emptyMessage="Data tidak ditemukan"
                           footer={footerExpansion(item)}>
                    <Column field="no" header="No" style={{width: '50px'}}/>
                    <Column field="obat.nama" header="Obat"
                            editor={(options) => obatEditor(options, item)}/>
                    <Column field="jumlah" header="Jumlah"
                            editor={(options) => obatJumlahEditor(options, item)}/>
                    <Column field="obat.harga" header="Harga"/>
                    <Column field="total" header="Sub Total Harga"/>
                    <Column header="Aksi" body={(e) => aksi(e, item)} headerStyle={{width: '10%', minWidth: '8rem'}}
                            align="center"/>
                </DataTable>
            </div>
        );
    };

    return (
        <Layout user={auth.user}>
            <Toast ref={toast}/>
            <DatatableLayout title="Data Pasien" onReload={reloadData}>
                <DataTable lazy value={data} emptyMessage="Data tidak ditemukan"
                           expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                           rowExpansionTemplate={rowExpansionTemplate} dataKey="id"
                           paginator first={meta.from} rows={meta.per_page}
                           totalRecords={meta.total}
                           paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
                           rowsPerPageOptions={rowsOptions}
                           onPage={(e) => {
                               setPage(e.page + 1);
                               setPerPage(e.rows);
                               reloadData("", e.page + 1, e.rows);
                           }}
                           currentPageReportTemplate="{first} to {last} of {totalRecords}"
                           paginatorLeft={<></>} paginatorRight={paginatorRight}>
                    <Column expander style={{width: '5rem'}}/>
                    <Column field="no" header="No" style={{width: '50px'}}/>
                    <Column field="tanggal_kunjungan" header="Tanggal Kunjungan"/>
                    <Column field="pasien.nama" header="Nama"/>
                    <Column field="berat_badan" header="Berat Badan"/>
                    <Column field="tekanan_darah" header="Tekanan Darah"/>
                    <Column field="keluhan" header="Keluhan"/>
                    <Column field="diagnosa" header="Diagnosa"/>
                </DataTable>
            </DatatableLayout>
        </Layout>
    );
}

export default PemberianObat;
