import React from 'react';
import AppMenuitem from './AppMenuitem';
import {MenuProvider} from './context/menucontext';
import {RoleEnum} from "@/Constants/RoleEnum.js";

const AppMenu = ({user}) => {
    let items;
    switch (user.role) {
        case RoleEnum.SuperAdmin:
            items = [
            ];
            break;
        case RoleEnum.Pendaftaran:
            items = [
                {label: 'Pendaftaran', icon: 'pi pi-fw pi-users', to: route('pendaftaran.index')},
                {label: 'Kunjungan Pasien', icon: 'pi pi-fw pi-calendar', to: route('pemeriksaan.index')},
            ];
            break;
        case RoleEnum.Perawat:
        case RoleEnum.Dokter:
            items = [
                {label: 'Pemeriksaan Pasien', icon: 'pi pi-fw pi-calendar', to: route('pemeriksaan.index')},
            ];
            break;
        case RoleEnum.Apoteker:
            items = [
                {label: 'Pemberian Obat', icon: 'pi pi-fw pi-plus-circle', to: route('pemberian-obat.index')},
            ];
            break;
        default:
            items = [];
            break;
    }
    const model = [
        {
            label: 'Home',
            items: [
                {label: 'Dashboard', icon: 'pi pi-fw pi-home', to: route('dashboard')},
                ...items,
                {label: 'Riwayat Pemeriksaan', icon: 'pi pi-fw pi-history', to: route('pemeriksaan.history')},
            ]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label}/> :
                        <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
