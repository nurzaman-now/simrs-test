import {Card} from "primereact/card";
import React, {useState} from "react";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";

export default function DatatableLayout({title, onReload, children}) {
    const [search, setSearch] = useState("");

    return (
        <Card title={title} className="p-mt-3">
            <div className="grid grid-cols-6 gap-1 justify-content-end">
                <div className="col-start-1 col-end-3">
                    <InputText
                        value={search}
                        placeholder={`Cari ${title}...`}
                        className="p-inputtext p-component"
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') onReload(search); }}
                    />
                </div>
                <div className="col-end-7 col-span-2">
                    <Button
                        icon="pi pi-search"
                        onClick={(e) => {
                            e.preventDefault();
                            onReload(search);
                        }}
                    />
                </div>
            </div>
            <div className="mt-3">
                {children}
            </div>
        </Card>
    );
}
