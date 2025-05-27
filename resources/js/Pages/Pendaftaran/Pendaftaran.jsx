import React, {useRef, useState} from "react";
import Layout from "@/Layouts/layout/layout.jsx";
import {Card} from "primereact/card";
import {AutoComplete} from "primereact/autocomplete";
import {router, useForm} from "@inertiajs/react";
import {Button} from "primereact/button";
import {Dropdown} from "primereact/dropdown";
import {Calendar} from "primereact/calendar";
import {InputText} from "primereact/inputtext";
import {Toast} from "primereact/toast";

const Pendaftaran = ({auth, pasien}) => {
    const [newPasien, setSeletPasien] = useState(false)
    const toast = useRef(null);

    const dataJenisKelamin = [
        {label: "Laki-laki", value: "Laki-Laki"},
        {label: "Perempuan", value: "Perempuan"},
    ];

    const {data, setData, post, processing} = useForm({
        pasien: null,
        id: null,
        nama: "",
        tanggal_lahir: "",
        jenis_kelamin: "",
        nomor_telepon: "",
    });
    const handleSelectPasien = (e) => {
        setData({
            pasien: e.value,
            id: e.value.id,
            nama: e.value.nama,
            tanggal_lahir: new Date(e.value.tanggal_lahir),
            jenis_kelamin: e.value.jenis_kelamin,
            nomor_telepon: e.value.nomor_telepon,
        });
        setSeletPasien(true);
    };

    const search = (event) => {
        refresh(event.query);
    }

    const resetPasien = () => {
        setData({
            pasien: null,
            id: null,
            nama: "",
            tanggal_lahir: "",
            jenis_kelamin: "",
            nomor_telepon: "",
        });
        setSeletPasien(false);
    }

    const refresh = (pasien) => {
        router.get(route("pendaftaran.index"), {pasien: pasien}, {
            preserveState: true,
            preserveScroll: true,
        })
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("pendaftaran.store"), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Berhasil',
                    detail: 'Pendaftaran pasien berhasil dilakukan.',
                    life: 3000,
                });
                resetPasien()
            },
            onError: (errors) => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Gagal',
                    detail: 'Pendaftaran pasien gagal dilakukan. Periksa kembali data yang dimasukkan.',
                    life: 3000,
                });
            },
        });
    }

    return (
        <Layout user={auth.user}>
            <Toast ref={toast}/>
            <Card title="Pendaftaran Pasien" className="p-2">
                <form onSubmit={handleSubmit}>
                    {!newPasien ? (
                        <>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="col-span-1">
                                    <AutoComplete
                                        id="pasien"
                                        value={data.pasien}
                                        suggestions={pasien}
                                        completeMethod={search}
                                        field="nama"
                                        onChange={(e) => setData("pasien", e.value)}
                                        onSelect={(e) => handleSelectPasien(e)}
                                        placeholder="Cari pasien..."
                                        className="w-full"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Button
                                        type="button"
                                        label="Tambah Pasien Baru"
                                        severity="secondary"
                                        onClick={() => {
                                            setSeletPasien(true);
                                            setData({
                                                pasien: null,
                                                nama: "",
                                                tanggal_lahir: "",
                                                jenis_kelamin: "",
                                                nomor_telepon: "",
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            <div className="col-span-1">
                                <label htmlFor="pasien" className="block mb-2">Nama Pasien Baru</label>
                                <input
                                    type="text"
                                    id="pasien"
                                    value={data.nama || ""}
                                    onChange={(e) => setData("nama", e.target.value)}
                                    placeholder="Masukkan nama pasien baru..."
                                    className="p-inputtext p-component w-full"
                                />
                            </div>
                            {/* tanggal lahir */}
                            <div className="col-span-1">
                                <label htmlFor="tanggal_lahir" className="block mb-2">Tanggal Lahir</label>
                                <Calendar value={data.tanggal_lahir} onChange={(e) => setData('tanggal_lahir', e.value)}/>
                            </div>
                            {/* jenis kelamin */}
                            <div className="col-span-1">
                                <label htmlFor="jenis_kelamin" className="block mb-2">Jenis Kelamin</label>
                                <Dropdown value={data.jenis_kelamin}
                                          options={dataJenisKelamin} placeholder="Pilih jenis kelamin"
                                          className="w-full" inputId="jenis_kelamin" optionLabel="label"
                                          onChange={(e) => setData("jenis_kelamin", e.value)}
                                />
                            </div>
                            {/* nomor telepon */}
                            <div className="col-span-1">
                                <label htmlFor="nomor_telepon" className="block mb-2">Nomor Telepon</label>
                                <InputText
                                    id="nomor_telepon"
                                    value={data.nomor_telepon || ""}
                                    onChange={(e) => setData("nomor_telepon", e.target.value)}
                                    placeholder="Masukkan nomor telepon..."
                                    className="p-inputtext p-component w-full"
                                />
                            </div>
                            {/* button batal tambah */}
                            <div className="col-span-1">
                                <Button
                                    type="button"
                                    label="Batal"
                                    severity="secondary"
                                    className="mt-4"
                                    onClick={resetPasien}
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-4 text-right">
                        <button type="submit" disabled={processing} className="p-button p-component p-button-primary">
                            Daftar
                        </button>
                    </div>
                </form>
            </Card>
        </Layout>
    );
}

export default Pendaftaran;
