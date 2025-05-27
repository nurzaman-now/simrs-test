import {Chart} from 'primereact/chart';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {LayoutContext} from '@/Layouts/layout/context/layoutcontext';
import Layout from "@/Layouts/layout/layout.jsx";
import DashboardInfoCard from "@/Components/DashboardInfoCard.jsx";

const Dashboard = (
    {
        auth,
        countPasien,
        countPasienToday,
        countPemeriksaan,
        countPemeriksaanToday,
        countObat,
        countObatToday,
        countPemberianObat,
        countPemberianObatToday,
        pasienPerMonth,
        pemeriksaanPerMonth,
        obat,
    }) => {
    const [dataObat, setDataObat] = useState(obat || []);
    const [lineOptions, setLineOptions] = useState({});
    const {layoutConfig} = useContext(LayoutContext);

    const lineData = {
        labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', "Agustus", 'September', 'Oktober', 'November', 'Desember'],
        datasets: [
            {
                label: 'Pasien',
                data: pasienPerMonth,
                fill: false,
                backgroundColor: '#2f4860',
                borderColor: '#2f4860',
                tension: 0.4
            },
            {
                label: 'Pemeriksaan Pasien',
                data: pemeriksaanPerMonth,
                fill: false,
                backgroundColor: '#00bb7e',
                borderColor: '#00bb7e',
                tension: 0.4
            }
        ]
    };

    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    return (
        <Layout user={auth.user}>
            <div className="grid">
                <DashboardInfoCard title="Pasien"
                                   value={countPasien}
                                   icon="users"
                                   iconColor="blue"
                                   descriptionValue={"+" + countPasienToday + " Pasien"}
                                   descriptionText="Hari ini">
                </DashboardInfoCard>
                <DashboardInfoCard title="Pemeriksaan"
                                   value={countPemeriksaan}
                                   icon="calendar"
                                   iconColor="orange"
                                   descriptionValue={"+" + countPemeriksaanToday + " Pemeriksaan"}
                                   descriptionText="Hari ini">
                </DashboardInfoCard>
                <DashboardInfoCard title="Obat"
                                   value={countObat}
                                   icon="plus-circle"
                                   iconColor="cyan"
                                   descriptionValue={"+" + countObatToday + " Obat"}
                                   descriptionText="Hari ini">
                </DashboardInfoCard>
                <DashboardInfoCard title="Pemberian Obat"
                                   value={countPemberianObat}
                                   icon="check-circle"
                                   iconColor="purple"
                                   descriptionValue={"+" + countPemberianObatToday + " Pemberian Obat"}
                                   descriptionText="Hari Ini">
                </DashboardInfoCard>

                <div className="col-12 xl:col-7">
                    <div className="card">
                        <h5>Pemeriksaan Pasien & Jumlah Pasien</h5>
                        <Chart type="line" data={lineData} options={lineOptions}/>
                    </div>
                </div>

                <div className="col-12 xl:col-5">
                    <div className="card">
                        <div className="flex justify-content-between align-items-center mb-5">
                            <h5>Penjualan Obat</h5>
                        </div>
                        <ul className="list-none p-0 m-0">
                            {dataObat.map((item, index) => (
                                <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                    <div>
                                        <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{item.nama}</span>
                                        <div className="mt-1 text-600">{item.deskripsi}</div>
                                    </div>
                                    <div className="mt-2 md:mt-0 flex align-items-center">
                                        <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                                             style={{height: '8px'}}>
                                            <div className="bg-orange-500 h-full" style={{width: item.pemberian_obat_count / item.stok + '%'}}/>
                                        </div>
                                        <span className="text-orange-500 ml-3 font-medium">{item.pemberian_obat_count / item.stok}%</span>
                                        <span className="text-600 ml-3 font-medium">({item.pemberian_obat_count} dari {item.stok})</span>
                                    </div>
                                </li>
                            ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;

